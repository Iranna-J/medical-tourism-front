import api from '../config/api';

export interface Notification {
    id: number;
    userId: number;
    type: 'INQUIRY' | 'ASSESSMENT' | 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'SYSTEM';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    relatedId?: number;
}

export const notificationService = {
    getMyNotifications: async (): Promise<Notification[]> => {
        try {
            const response = await api.get<any>('/v1/notifications/me');
            // Backend returns paginated response, extract content
            return response.data.content || response.data || [];
        } catch (error) {
            // Backend endpoint not implemented yet, return empty array
            console.warn('Notifications endpoint not available yet');
            return [];
        }
    },

    markAsRead: async (id: number): Promise<void> => {
        try {
            await api.put(`/v1/notifications/${id}/read`);
        } catch (error) {
            console.warn('Notifications endpoint not available yet');
        }
    },

    markAllAsRead: async (): Promise<void> => {
        try {
            await api.put('/v1/notifications/read-all');
        } catch (error) {
            console.warn('Notifications endpoint not available yet');
        }
    },

    getUnreadCount: async (): Promise<number> => {
        try {
            const response = await api.get<{ count: number }>('/v1/notifications/unread-count');
            return response.data.count;
        } catch (error) {
            console.warn('Notifications endpoint not available yet');
            return 0;
        }
    },
};
