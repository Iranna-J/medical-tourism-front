import api from '../config/api';

export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'INSURANCE';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    paymentDate: string;
    notes?: string;
    createdAt: string;
}

export interface Invoice {
    id: number;
    bookingId: number;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
    items: InvoiceItem[];
    createdAt: string;
}

export interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface PaymentRequest {
    bookingId: number;
    amount: number;
    paymentMethod: string;
    notes?: string;
}

export const paymentService = {
    makePayment: async (data: PaymentRequest): Promise<Payment> => {
        const response = await api.post<Payment>('/payments', data);
        return response.data;
    },

    getPaymentsByBooking: async (bookingId: number): Promise<Payment[]> => {
        const response = await api.get<Payment[]>(`/payments/booking/${bookingId}`);
        return response.data;
    },

    getMyPayments: async (): Promise<Payment[]> => {
        const response = await api.get<Payment[]>('/payments/my-payments');
        return response.data;
    },

    getInvoiceByBooking: async (bookingId: number): Promise<Invoice> => {
        const response = await api.get<Invoice>(`/invoices/booking/${bookingId}`);
        return response.data;
    },

    downloadInvoice: async (invoiceId: number): Promise<Blob> => {
        const response = await api.get(`/invoices/${invoiceId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
