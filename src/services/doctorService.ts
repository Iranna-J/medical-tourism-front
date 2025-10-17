import api from '../config/api';
import type { Doctor, PaginatedResponse } from '../types';

export const doctorService = {
    getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Doctor>> => {
        const response = await api.get<PaginatedResponse<Doctor>>('/doctors', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number): Promise<Doctor> => {
        const response = await api.get<Doctor>(`/doctors/${id}`);
        return response.data;
    },

    getAvailable: async (page = 0, size = 10): Promise<PaginatedResponse<Doctor>> => {
        const response = await api.get<PaginatedResponse<Doctor>>('/doctors/available', {
            params: { page, size },
        });
        return response.data;
    },
};
