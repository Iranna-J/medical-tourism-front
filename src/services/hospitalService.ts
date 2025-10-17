import api from '../config/api';
import type { Hospital, PaginatedResponse } from '../types';

export const hospitalService = {
    getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Hospital>> => {
        const response = await api.get<PaginatedResponse<Hospital>>('/hospitals', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number): Promise<Hospital> => {
        const response = await api.get<Hospital>(`/hospitals/${id}`);
        return response.data;
    },

    getActive: async (page = 0, size = 10): Promise<PaginatedResponse<Hospital>> => {
        const response = await api.get<PaginatedResponse<Hospital>>('/hospitals/active', {
            params: { page, size },
        });
        return response.data;
    },

    searchByCity: async (city: string, page = 0, size = 10): Promise<PaginatedResponse<Hospital>> => {
        const response = await api.get<PaginatedResponse<Hospital>>('/hospitals/search/city', {
            params: { city, page, size },
        });
        return response.data;
    },
};
