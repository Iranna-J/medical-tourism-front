import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, CheckCircle, XCircle, AlertCircle,
    Building2, User, DollarSign, Search, Filter, Eye
} from 'lucide-react';
import { bookingService, type Booking } from '../../services/bookingService';
import toast from 'react-hot-toast';

export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id: number) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        try {
            await bookingService.cancelBooking(id, reason);
            toast.success('Booking cancelled successfully');
            loadBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Failed to cancel booking');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
            IN_PROGRESS: { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, label: 'In Progress' },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.treatmentType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6">
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600 mt-1">Track and manage your treatment bookings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by treatment type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {bookings.filter(b => b.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {bookings.filter(b => b.status === 'CONFIRMED').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {bookings.filter(b => b.status === 'IN_PROGRESS').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {bookings.filter(b => b.status === 'COMPLETED').length}
                    </p>
                </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm || statusFilter !== 'ALL' ? 'No bookings found' : 'No bookings yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || statusFilter !== 'ALL'
                            ? 'Try adjusting your search or filters'
                            : 'Your treatment bookings will appear here'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.map((booking) => {
                        const statusBadge = getStatusBadge(booking.status);
                        const StatusIcon = statusBadge.icon;
                        const paymentProgress = (booking.paidAmount / booking.totalCost) * 100;

                        return (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {booking.treatmentType}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusBadge.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-gray-600">Start Date</p>
                                                    <p className="font-medium text-gray-900">{formatDate(booking.preferredStartDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-gray-600">Duration</p>
                                                    <p className="font-medium text-gray-900">{booking.estimatedDuration}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-gray-600">Hospital</p>
                                                    <p className="font-medium text-gray-900">ID: {booking.hospitalId}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Progress */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600">Payment Progress</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(booking.paidAmount)} / {formatCurrency(booking.totalCost)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${paymentProgress}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {paymentProgress.toFixed(0)}% paid
                                            </p>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="h-4 w-4" />
                                            <span>Doctor ID: {booking.doctorId}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                        <button
                                            onClick={() => navigate(`/dashboard/bookings/${booking.id}`)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </button>
                                        {booking.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        {booking.status === 'CONFIRMED' && booking.paidAmount < booking.totalCost && (
                                            <button
                                                onClick={() => navigate(`/dashboard/payments/${booking.id}`)}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                            >
                                                <DollarSign className="h-4 w-4" />
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
