import api from '../config/api';

export interface MedicalReport {
    id: number;
    patientId: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    reportType: string;
    description?: string;
    uploadedAt: string;
}

export const medicalReportService = {
    uploadReport: async (file: File, reportType: string, description?: string): Promise<MedicalReport> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('reportType', reportType);
        if (description) {
            formData.append('description', description);
        }

        const response = await api.post<MedicalReport>('/v1/medical-reports/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getMyReports: async (): Promise<MedicalReport[]> => {
        const response = await api.get<MedicalReport[]>('/v1/medical-reports/patient/me');
        return response.data;
    },

    getReportById: async (id: number): Promise<MedicalReport> => {
        const response = await api.get<MedicalReport>(`/v1/medical-reports/${id}`);
        return response.data;
    },

    deleteReport: async (id: number): Promise<void> => {
        await api.delete(`/v1/medical-reports/${id}`);
    },

    downloadReport: async (id: number): Promise<Blob> => {
        const response = await api.get(`/v1/medical-reports/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
