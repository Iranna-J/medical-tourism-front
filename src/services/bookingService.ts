import api from '../config/api';

export interface Booking {
    id: number;
    inquiryId: number;
    patientId: number;
    hospitalId: number;
    doctorId: number;
    treatmentType: string;
    bookingDate: string;
    preferredStartDate: string;
    estimatedDuration: string;
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    totalCost: number;
    paidAmount: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingRequest {
    inquiryId: number;
    hospitalId: number;
    doctorId: number;
    treatmentType: string;
    preferredStartDate: string;
    estimatedDuration: string;
    notes?: string;
}

export const bookingService = {
    createBooking: async (data: BookingRequest): Promise<Booking> => {
        const response = await api.post<Booking>('/v1/bookings', data);
        return response.data;
    },

    getMyBookings: async (): Promise<Booking[]> => {
        const response = await api.get<any>('/v1/bookings/me');
        // Backend returns paginated response, extract content
        return response.data.content || response.data;
    },

    getBookingById: async (id: number): Promise<Booking> => {
        const response = await api.get<Booking>(`/v1/bookings/${id}`);
        return response.data;
    },

    cancelBooking: async (id: number, reason: string): Promise<void> => {
        await api.put(`/v1/bookings/${id}/cancel`, { reason });
    },
};
