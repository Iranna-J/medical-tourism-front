import api from '../config/api';

export interface CostEstimate {
    id: number;
    assessmentId: number;
    inquiryId: number;
    treatmentCost: number;
    hospitalFees: number;
    doctorFees: number;
    medicationCost: number;
    labTestsCost: number;
    accommodationCost: number;
    travelAssistanceCost: number;
    miscellaneousCost: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalCost: number;
    currency: string;
    validUntil: string;
    notes?: string;
    insuranceCoverage?: number;
    paymentOptions?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CostApprovalRequest {
    approved: boolean;
    notes?: string;
}

export const costEstimateService = {
    getCostEstimateByInquiryId: async (inquiryId: number): Promise<CostEstimate> => {
        const response = await api.get<CostEstimate>(`/v1/cost-estimates/inquiry/${inquiryId}`);
        return response.data;
    },

    approveCostEstimate: async (estimateId: number, data: CostApprovalRequest): Promise<void> => {
        await api.post(`/v1/cost-estimates/${estimateId}/approve`, data);
    },

    requestRevision: async (estimateId: number, notes: string): Promise<void> => {
        await api.post(`/v1/cost-estimates/${estimateId}/request-revision`, { notes });
    },
};
