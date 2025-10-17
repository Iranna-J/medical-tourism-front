import api from '../config/api';

export interface Review {
    id: number;
    bookingId: number;
    patientId: number;
    hospitalId: number;
    doctorId: number;
    hospitalRating: number;
    doctorRating: number;
    treatmentRating: number;
    overallRating: number;
    comment: string;
    wouldRecommend: boolean;
    createdAt: string;
}

export interface ReviewRequest {
    bookingId: number;
    hospitalRating: number;
    doctorRating: number;
    treatmentRating: number;
    comment: string;
    wouldRecommend: boolean;
}

export const reviewService = {
    submitReview: async (data: ReviewRequest): Promise<Review> => {
        const response = await api.post<Review>('/v1/reviews', data);
        return response.data;
    },

    getMyReviews: async (): Promise<Review[]> => {
        try {
            const response = await api.get<any>('/v1/reviews/me');
            // Backend returns paginated response, extract content
            return response.data.content || response.data || [];
        } catch (error) {
            console.warn('Reviews endpoint may not be available yet');
            return [];
        }
    },

    getReviewByBooking: async (bookingId: number): Promise<Review> => {
        const response = await api.get<Review>(`/v1/reviews/booking/${bookingId}`);
        return response.data;
    },
};
