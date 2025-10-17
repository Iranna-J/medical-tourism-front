import api from '../config/api';

export interface Assessment {
    id: number;
    inquiryId: number;
    doctorId: number;
    diagnosis: string;
    assessmentNotes: string;
    recommendedTreatment: string;
    estimatedDuration: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    additionalTests?: string;
    precautions?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TreatmentRecommendation {
    id: number;
    assessmentId: number;
    hospitalId: number;
    doctorId: number;
    treatmentType: string;
    description: string;
    estimatedCost: number;
    estimatedDuration: string;
    successRate?: number;
    priority: number;
    createdAt: string;
}

export const assessmentService = {
    getAssessmentByInquiryId: async (inquiryId: number): Promise<Assessment> => {
        const response = await api.get<Assessment>(`/v1/assessments/inquiry/${inquiryId}`);
        return response.data;
    },

    getRecommendations: async (assessmentId: number): Promise<TreatmentRecommendation[]> => {
        const response = await api.get<TreatmentRecommendation[]>(`/v1/assessments/${assessmentId}/recommendations`);
        return response.data;
    },

    approveAssessment: async (assessmentId: number): Promise<void> => {
        await api.post(`/v1/assessments/${assessmentId}/approve`);
    },

    requestChanges: async (assessmentId: number, notes: string): Promise<void> => {
        await api.post(`/v1/assessments/${assessmentId}/request-changes`, { notes });
    },
};
