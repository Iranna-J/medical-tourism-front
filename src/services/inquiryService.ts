import api from '../config/api';

export interface Inquiry {
    id: number;
    patientId: number;
    medicalCondition: string;
    symptoms: string;
    previousTreatments?: string;
    preferredTreatment?: string;
    budgetRangeMin?: number;
    budgetRangeMax?: number;
    preferredLocation?: string;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    additionalNotes?: string;
    status: 'PENDING' | 'ASSIGNED' | 'ASSESSED' | 'RECOMMENDED' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
    submittedAt: string;
    assignedDoctorId?: number;
    preferredHospitalId?: number;
    preferredDoctorId?: number;
    attachedReportIds?: number[];
}

export interface InquiryRequest {
    medicalCondition: string;
    symptoms: string;
    previousTreatments?: string;
    preferredTreatment?: string;
    budgetRangeMin?: number;
    budgetRangeMax?: number;
    preferredLocation?: string;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    additionalNotes?: string;
    preferredHospitalId?: number;
    preferredDoctorId?: number;
    attachedReportIds?: number[];
}

export const inquiryService = {
    submitInquiry: async (data: InquiryRequest): Promise<Inquiry> => {
        const response = await api.post<Inquiry>('/v1/inquiries', data);
        return response.data;
    },

    getMyInquiries: async (): Promise<Inquiry[]> => {
        const response = await api.get<any>('/v1/inquiries/me');
        // Backend returns paginated response, extract content
        return response.data.content || response.data;
    },

    getInquiryById: async (id: number): Promise<Inquiry> => {
        const response = await api.get<Inquiry>(`/v1/inquiries/${id}`);
        return response.data;
    },

    cancelInquiry: async (id: number): Promise<void> => {
        await api.put(`/v1/inquiries/${id}/cancel`);
    },
};
