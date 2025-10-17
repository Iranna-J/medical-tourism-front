import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, CreditCard, DollarSign, CheckCircle,
    Download, FileText, Shield
} from 'lucide-react';
import { paymentService, type Payment, type Invoice, type PaymentRequest } from '../../services/paymentService';
import { bookingService, type Booking } from '../../services/bookingService';
import toast from 'react-hot-toast';

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [paymentData, setPaymentData] = useState<PaymentRequest>({
        bookingId: 0,
        amount: 0,
        paymentMethod: 'CREDIT_CARD',
        notes: '',
    });

    useEffect(() => {
        if (id) {
            loadData(parseInt(id));
        }
    }, [id]);

    const loadData = async (bookingId: number) => {
        try {
            setLoading(true);
            const [bookingData, paymentsData] = await Promise.all([
                bookingService.getBookingById(bookingId),
                paymentService.getPaymentsByBooking(bookingId),
            ]);
            setBooking(bookingData);
            setPayments(paymentsData);

            try {
                const invoiceData = await paymentService.getInvoiceByBooking(bookingId);
                setInvoice(invoiceData);
            } catch (error) {
                console.log('No invoice found');
            }

            setPaymentData(prev => ({
                ...prev,
                bookingId: bookingId,
                amount: bookingData.totalCost - bookingData.paidAmount,
            }));
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load payment information');
            navigate('/dashboard/bookings');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!booking || paymentData.amount <= 0) {
            toast.error('Invalid payment amount');
            return;
        }

        try {
            setSubmitting(true);
            await paymentService.makePayment(paymentData);
            toast.success('Payment processed successfully!');
            setShowPaymentModal(false);
            if (id) loadData(parseInt(id));
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!invoice) return;

        try {
            const blob = await paymentService.downloadInvoice(invoice.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Invoice downloaded successfully');
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPaymentStatusBadge = (status: string) => {
        const badges = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
            REFUNDED: 'bg-gray-100 text-gray-800',
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Booking not found</p>
            </div>
        );
    }

    const remainingAmount = booking.totalCost - booking.paidAmount;
    const paymentProgress = (booking.paidAmount / booking.totalCost) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(`/dashboard/bookings/${id}`)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Payment & Invoice</h1>
                    <p className="text-gray-600 mt-1">Manage your treatment payments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-sky-600" />
                            Payment Summary
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Total Cost</span>
                                <span className="text-xl font-bold text-gray-900">{formatCurrency(booking.totalCost)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Paid Amount</span>
                                <span className="text-lg font-semibold text-green-600">{formatCurrency(booking.paidAmount)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">Remaining Balance</span>
                                    <span className="text-2xl font-bold text-orange-600">{formatCurrency(remainingAmount)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all"
                                        style={{ width: `${paymentProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {paymentProgress.toFixed(0)}% paid
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Payment History</h2>
                        {payments.length > 0 ? (
                            <div className="space-y-3">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                                                <p className="text-sm text-gray-600">{payment.paymentMethod.replace('_', ' ')}</p>
                                                <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No payments made yet</p>
                        )}
                    </div>

                    {/* Invoice */}
                    {invoice && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-sky-600" />
                                    Invoice
                                </h2>
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Invoice Number</p>
                                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Issue Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Due Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="font-medium text-gray-900">{invoice.status.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                {invoice.items && invoice.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
                                        <div className="space-y-2">
                                            {invoice.items.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-gray-700">{item.description} (x{item.quantity})</span>
                                                    <span className="font-medium text-gray-900">{formatCurrency(item.totalPrice)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Make Payment Card */}
                    {remainingAmount > 0 && (
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                            <h2 className="text-lg font-bold mb-4">Make Payment</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-green-100 text-sm">Amount Due</p>
                                    <p className="text-3xl font-bold">{formatCurrency(remainingAmount)}</p>
                                </div>
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
                                >
                                    <CreditCard className="h-5 w-5" />
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Booking Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Info</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Booking ID</p>
                                <p className="font-medium text-gray-900">#{booking.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Treatment</p>
                                <p className="font-medium text-gray-900">{booking.treatmentType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Start Date</p>
                                <p className="font-medium text-gray-900">{formatDate(booking.preferredStartDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Secure Payment
                        </h3>
                        <p className="text-sm text-gray-700 mb-3">
                            We accept multiple payment methods. All transactions are encrypted and secure.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white rounded text-xs font-medium text-gray-700">Credit Card</span>
                            <span className="px-3 py-1 bg-white rounded text-xs font-medium text-gray-700">Debit Card</span>
                            <span className="px-3 py-1 bg-white rounded text-xs font-medium text-gray-700">Bank Transfer</span>
                            <span className="px-3 py-1 bg-white rounded text-xs font-medium text-gray-700">PayPal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Process Payment</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                    max={remainingAmount}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Maximum: {formatCurrency(remainingAmount)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentData.paymentMethod}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="DEBIT_CARD">Debit Card</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="PAYPAL">PayPal</option>
                                    <option value="INSURANCE">Insurance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={paymentData.notes}
                                    onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    placeholder="Add any notes..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={submitting || paymentData.amount <= 0}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Processing...' : (
                                    <>
                                        <CheckCircle className="h-4 w-4" />
                                        Pay {formatCurrency(paymentData.amount)}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
