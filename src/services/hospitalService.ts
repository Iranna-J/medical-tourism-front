import api from '../config/api';
import type { Hospital, Doctor, PaginatedResponse } from '../types';

export const hospitalService = {
    getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Hospital>> => {
        const response = await api.get<PaginatedResponse<Hospital>>('/v1/hospitals', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number): Promise<Hospital> => {
        const response = await api.get<Hospital>(`/v1/hospitals/${id}`);
        return response.data;
    },

    getDoctors: async (id: number): Promise<Doctor[]> => {
        const response = await api.get<Doctor[]>(`/v1/hospitals/${id}/doctors`);
        return response.data;
    },

    getActive: async (page = 0, size = 10): Promise<PaginatedResponse<Hospital>> => {
        const response = await api.get<PaginatedResponse<Hospital>>('/v1/hospitals/active', {
            params: { page, size },
        });
        return response.data;
    },

    searchByCity: async (city: string, page = 0, size = 10): Promise<PaginatedResponse<Hospital>> => {
        const response = await api.get<PaginatedResponse<Hospital>>('/v1/hospitals/search/city', {
            params: { city, page, size },
        });
        return response.data;
    },

    // Admin methods
    create: async (data: Partial<Hospital>): Promise<Hospital> => {
        const response = await api.post<Hospital>('/v1/hospitals', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Hospital>): Promise<Hospital> => {
        const response = await api.put<Hospital>(`/v1/hospitals/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/v1/hospitals/${id}`);
    },
};
