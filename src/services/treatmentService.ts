import api from '../config/api';
import type { Treatment, PaginatedResponse } from '../types';

export const treatmentService = {
    getAll: async (page = 0, size = 12): Promise<PaginatedResponse<Treatment>> => {
        const response = await api.get<PaginatedResponse<Treatment>>('/treatments', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number): Promise<Treatment> => {
        const response = await api.get<Treatment>(`/treatments/${id}`);
        return response.data;
    },

    getActive: async (page = 0, size = 12): Promise<PaginatedResponse<Treatment>> => {
        const response = await api.get<PaginatedResponse<Treatment>>('/treatments/active', {
            params: { page, size },
        });
        return response.data;
    },

    searchByName: async (name: string, page = 0, size = 12): Promise<PaginatedResponse<Treatment>> => {
        const response = await api.get<PaginatedResponse<Treatment>>('/treatments/search', {
            params: { name, page, size },
        });
        return response.data;
    },
};
