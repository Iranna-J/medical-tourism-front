import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Clock, Building2, User, DollarSign,
    CheckCircle, XCircle, AlertCircle, FileText, CreditCard
} from 'lucide-react';
import { bookingService, type Booking } from '../../services/bookingService';
import toast from 'react-hot-toast';

export default function BookingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadBooking(parseInt(id));
        }
    }, [id]);

    const loadBooking = async (bookingId: number) => {
        try {
            setLoading(true);
            const data = await bookingService.getBookingById(bookingId);
            setBooking(data);
        } catch (error) {
            console.error('Error loading booking:', error);
            toast.error('Failed to load booking details');
            navigate('/dashboard/bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!booking) return;
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        try {
            await bookingService.cancelBooking(booking.id, reason);
            toast.success('Booking cancelled successfully');
            navigate('/dashboard/bookings');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Failed to cancel booking');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Confirmation' },
            CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
            IN_PROGRESS: { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, label: 'In Progress' },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
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

    const statusBadge = getStatusBadge(booking.status);
    const StatusIcon = statusBadge.icon;
    const paymentProgress = (booking.paidAmount / booking.totalCost) * 100;
    const remainingAmount = booking.totalCost - booking.paidAmount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/bookings')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                    <p className="text-gray-600 mt-1">View your treatment booking information</p>
                </div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${statusBadge.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    {statusBadge.label}
                </span>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Booking Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Treatment Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-sky-600" />
                            Treatment Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Treatment Type</p>
                                <p className="text-gray-900 text-lg">{booking.treatmentType}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                                    <p className="text-gray-900">{formatDate(booking.preferredStartDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Duration</p>
                                    <p className="text-gray-900">{booking.estimatedDuration}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hospital & Doctor */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Healthcare Providers</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <Building2 className="h-6 w-6 text-sky-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Hospital</p>
                                    <p className="text-gray-900 font-medium">Hospital ID: {booking.hospitalId}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <User className="h-6 w-6 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Doctor</p>
                                    <p className="text-gray-900 font-medium">Doctor ID: {booking.doctorId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-sky-600" />
                            Payment Information
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
                                    <span className="text-xl font-bold text-orange-600">{formatCurrency(remainingAmount)}</span>
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

                    {/* Additional Notes */}
                    {booking.notes && (
                        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">Additional Notes</h2>
                            <p className="text-gray-900 whitespace-pre-wrap">{booking.notes}</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Booking Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Info</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Booking ID</p>
                                <p className="text-sm text-gray-900">#{booking.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Booked On</p>
                                <p className="text-sm text-gray-900">{formatDateTime(booking.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Last Updated</p>
                                <p className="text-sm text-gray-900">{formatDateTime(booking.updatedAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Inquiry ID</p>
                                <p className="text-sm text-gray-900">#{booking.inquiryId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                        <div className="space-y-3">
                            {booking.status === 'CONFIRMED' && remainingAmount > 0 && (
                                <button
                                    onClick={() => navigate(`/dashboard/payments/${booking.id}`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    <DollarSign className="h-5 w-5" />
                                    Make Payment
                                </button>
                            )}
                            {booking.status === 'COMPLETED' && (
                                <button
                                    onClick={() => navigate(`/dashboard/reviews/new?bookingId=${booking.id}`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                                >
                                    Submit Review
                                </button>
                            )}
                            {booking.status === 'PENDING' && (
                                <button
                                    onClick={handleCancelBooking}
                                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Cancel Booking
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/dashboard/inquiries/${booking.inquiryId}`)}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                View Inquiry
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/bookings')}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Back to Bookings
                            </button>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Have questions about your booking? Contact our support team.
                        </p>
                        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            Contact Support →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
