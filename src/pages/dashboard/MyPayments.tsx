import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar } from 'lucide-react';
import { paymentService, type Payment } from '../../services/paymentService';

export default function MyPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getMyPayments();
            setPayments(data);
        } catch (error) {
            console.error('Failed to load payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'REFUNDED':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>
                <p className="text-gray-600 mt-1">View your payment history and transactions</p>
            </div>

            {payments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Yet</h3>
                    <p className="text-gray-600 mb-6">
                        You haven't made any payments yet. Payments will appear here once you book a treatment.
                    </p>
                    <Link to="/dashboard/inquiries/new" className="btn-primary inline-block">
                        Submit New Inquiry
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {payments.map((payment) => (
                        <div key={payment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-sky-100 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-sky-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">
                                                Payment #{payment.id}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            {payment.transactionId && (
                                                <p className="text-xs text-gray-500">
                                                    Transaction ID: {payment.transactionId}
                                                </p>
                                            )}
                                            <p>Payment Method: {payment.paymentMethod || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${payment.amount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">USD</p>
                                    {payment.status === 'PENDING' && (
                                        <Link
                                            to={`/dashboard/payments/${payment.id}`}
                                            className="mt-3 inline-block text-sm text-sky-600 hover:text-sky-700 font-semibold"
                                        >
                                            Complete Payment →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
