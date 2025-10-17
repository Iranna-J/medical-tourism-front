import api from '../config/api';
import type { Hospital, Doctor, Treatment } from '../types';

export interface SearchRequest {
    query: string;
    type?: 'HOSPITAL' | 'DOCTOR' | 'TREATMENT' | 'ALL';
    specialty?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}

export interface SearchResultItem {
    id: number;
    type: 'HOSPITAL' | 'DOCTOR' | 'TREATMENT';
    name: string;
    description?: string;
    location?: string;
    specialty?: string;
    rating?: number;
    reviewCount?: number;
    price?: number;
    imageUrl?: string;
}

export interface SearchResponse {
    results: SearchResultItem[];
    totalResults: number;
    hospitals: SearchResultItem[];
    doctors: SearchResultItem[];
    treatments: SearchResultItem[];
}

export const searchService = {
    search: async (request: SearchRequest): Promise<SearchResponse> => {
        const response = await api.post<SearchResponse>('/search', request);
        return response.data;
    },

    quickSearch: async (query: string): Promise<SearchResponse> => {
        const response = await api.get<SearchResponse>('/search', {
            params: { query },
        });
        return response.data;
    },

    // Fallback: Search individual endpoints if unified search is not available
    searchAll: async (query: string): Promise<SearchResponse> => {
        try {
            // Try unified search first
            return await searchService.quickSearch(query);
        } catch (error) {
            // Fallback to individual searches
            const [hospitals, doctors, treatments] = await Promise.all([
                api.get<{ content: Hospital[] }>('/hospitals', { params: { page: 0, size: 10 } }),
                api.get<{ content: Doctor[] }>('/doctors', { params: { page: 0, size: 10 } }),
                api.get<{ content: Treatment[] }>('/treatments', { params: { page: 0, size: 10 } }),
            ]);

            const queryLower = query.toLowerCase();

            // Filter and map hospitals
            const hospitalResults: SearchResultItem[] = hospitals.data.content
                .filter(h =>
                    h.name.toLowerCase().includes(queryLower) ||
                    h.city.toLowerCase().includes(queryLower) ||
                    h.description?.toLowerCase().includes(queryLower)
                )
                .map(h => ({
                    id: h.id,
                    type: 'HOSPITAL' as const,
                    name: h.name,
                    description: h.description,
                    location: `${h.city}, ${h.state}`,
                    rating: h.rating,
                    reviewCount: 0,
                    imageUrl: h.website,
                }));

            // Filter and map doctors
            const doctorResults: SearchResultItem[] = doctors.data.content
                .filter(d =>
                    `${d.firstName} ${d.lastName}`.toLowerCase().includes(queryLower) ||
                    d.specialization.toLowerCase().includes(queryLower) ||
                    d.bio?.toLowerCase().includes(queryLower)
                )
                .map(d => ({
                    id: d.id,
                    type: 'DOCTOR' as const,
                    name: `Dr. ${d.firstName} ${d.lastName}`,
                    description: d.bio,
                    specialty: d.specialization,
                    rating: d.rating,
                    reviewCount: d.totalReviews || 0,
                    price: d.consultationFee,
                }));

            // Filter and map treatments
            const treatmentResults: SearchResultItem[] = treatments.data.content
                .filter(t =>
                    t.name.toLowerCase().includes(queryLower) ||
                    t.description?.toLowerCase().includes(queryLower)
                )
                .map(t => ({
                    id: t.id,
                    type: 'TREATMENT' as const,
                    name: t.name,
                    description: t.description,
                    specialty: t.specialization?.name,
                    price: t.costEstimateMin,
                }));

            const allResults = [...hospitalResults, ...doctorResults, ...treatmentResults];

            return {
                results: allResults,
                totalResults: allResults.length,
                hospitals: hospitalResults,
                doctors: doctorResults,
                treatments: treatmentResults,
            };
        }
    },
};
