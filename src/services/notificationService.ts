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
        const response = await api.get<Notification[]>('/notifications/my-notifications');
        return response.data;
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all');
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/notifications/unread-count');
        return response.data.count;
    },
};
