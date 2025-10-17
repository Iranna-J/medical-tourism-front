export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'EXPERT';
    isActive: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

export interface Hospital {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
    postalCode?: string;
    phone: string;
    email: string;
    website?: string;
    isJciAccredited: boolean;
    isNabhAccredited: boolean;
    rating: number;
    totalBeds?: number;
    bedCount?: number;
    icuBeds?: number;
    isActive: boolean;
}

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    qualification: string;
    experienceYears: number;
    consultationFee: number;
    rating: number;
    totalReviews?: number;
    isAvailable: boolean;
    bio?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    languages?: string[];
    awards?: string[];
}

export interface Treatment {
    id: number;
    name: string;
    description: string;
    category: string;
    costEstimateMin: number;
    costEstimateMax: number;
    durationDays: number;
    successRate: number;
    isActive: boolean;
    specialization: Specialization;
}

export interface Specialization {
    id: number;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
}

export interface Inquiry {
    id: number;
    patientId: number;
    treatmentType: string;
    medicalCondition: string;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    preferredCountry?: string;
    budgetRange?: string;
    status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}

export interface Booking {
    id: number;
    confirmationNumber: string;
    patientId: number;
    hospitalId: number;
    doctorId: number;
    treatmentId: number;
    bookingDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    totalCost: number;
    createdAt: string;
}

export interface SearchFilters {
    query?: string;
    type?: 'hospital' | 'doctor' | 'treatment';
    location?: string;
    specialty?: string;
    minRating?: number;
    maxCost?: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
