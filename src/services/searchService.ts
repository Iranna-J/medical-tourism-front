import api from '../config/api';
import type { SearchFilters } from '../types';

export const searchService = {
    quickSearch: async (filters: SearchFilters) => {
        const response = await api.get('/search/quick', { params: filters });
        return response.data;
    },

    advancedSearch: async (filters: SearchFilters) => {
        const response = await api.post('/search', filters);
        return response.data;
    },
};
