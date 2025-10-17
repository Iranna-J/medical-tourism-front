import api from '../config/api';
import type { Doctor, Treatment, User, PaginatedResponse } from '../types';

export const adminService = {
    // Doctor Management
    doctors: {
        getAll: async (page = 0, size = 100): Promise<PaginatedResponse<Doctor>> => {
            const response = await api.get<PaginatedResponse<Doctor>>('/v1/doctors', {
                params: { page, size },
            });
            return response.data;
        },

        create: async (data: Partial<Doctor>): Promise<Doctor> => {
            const response = await api.post<Doctor>('/v1/doctors', data);
            return response.data;
        },

        update: async (id: number, data: Partial<Doctor>): Promise<Doctor> => {
            const response = await api.put<Doctor>(`/v1/doctors/${id}`, data);
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await api.delete(`/v1/doctors/${id}`);
        },
    },

    // Treatment Management
    treatments: {
        getAll: async (page = 0, size = 100): Promise<PaginatedResponse<Treatment>> => {
            const response = await api.get<PaginatedResponse<Treatment>>('/v1/treatments', {
                params: { page, size },
            });
            return response.data;
        },

        create: async (data: Partial<Treatment>): Promise<Treatment> => {
            const response = await api.post<Treatment>('/v1/treatments', data);
            return response.data;
        },

        update: async (id: number, data: Partial<Treatment>): Promise<Treatment> => {
            const response = await api.put<Treatment>(`/v1/treatments/${id}`, data);
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await api.delete(`/v1/treatments/${id}`);
        },
    },

    // User Management
    users: {
        getAll: async (): Promise<User[]> => {
            const response = await api.get<User[]>('/v1/admin/users');
            return response.data;
        },

        updateRole: async (userId: number, role: string): Promise<User> => {
            const response = await api.put<User>(`/v1/admin/users/${userId}/role`, { role });
            return response.data;
        },

        toggleStatus: async (userId: number): Promise<User> => {
            const response = await api.put<User>(`/v1/admin/users/${userId}/toggle-status`);
            return response.data;
        },

        delete: async (userId: number): Promise<void> => {
            await api.delete(`/v1/admin/users/${userId}`);
        },
    },

    // Analytics
    analytics: {
        getStats: async () => {
            const response = await api.get('/v1/admin/analytics/stats');
            return response.data;
        },
    },
};
