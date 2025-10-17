import api from '../config/api';

export interface Patient {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
}

export interface PatientUpdateRequest {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    allergies?: string;
    chronicConditions?: string;
    currentMedications?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
}

export const patientService = {
    getMyProfile: async (): Promise<Patient> => {
        const response = await api.get<Patient>('/v1/patients/me');
        return response.data;
    },

    updateMyProfile: async (data: PatientUpdateRequest): Promise<Patient> => {
        const response = await api.put<Patient>('/v1/patients/me', data);
        return response.data;
    },

    getMedicalHistory: async (patientId: number): Promise<any> => {
        const response = await api.get(`/v1/patients/${patientId}/medical-history`);
        return response.data;
    },
};
