import api from '../config/api';
import type { AuthResponse } from '../types';

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    },

    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};
