import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Filter, Clock, CheckCircle, XCircle,
    AlertTriangle, FileText, Calendar, DollarSign, MapPin
} from 'lucide-react';
import { inquiryService, type Inquiry } from '../../services/inquiryService';
import toast from 'react-hot-toast';

export default function MyInquiries() {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        try {
            setLoading(true);
            const data = await inquiryService.getMyInquiries();
            setInquiries(data);
        } catch (error) {
            console.error('Error loading inquiries:', error);
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelInquiry = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this inquiry?')) return;

        try {
            await inquiryService.cancelInquiry(id);
            toast.success('Inquiry cancelled successfully');
            loadInquiries();
        } catch (error) {
            console.error('Error cancelling inquiry:', error);
            toast.error('Failed to cancel inquiry');
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            ASSIGNED: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Assigned' },
            ASSESSED: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Assessed' },
            RECOMMENDED: { color: 'bg-indigo-100 text-indigo-800', icon: FileText, label: 'Recommended' },
            APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
            COMPLETED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Completed' },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    const getUrgencyBadge = (urgency: string) => {
        const badges = {
            LOW: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Low' },
            MEDIUM: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Medium' },
            HIGH: { color: 'bg-orange-50 text-orange-700 border-orange-200', label: 'High' },
            URGENT: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Urgent' },
        };
        return badges[urgency as keyof typeof badges] || badges.MEDIUM;
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = inquiry.medicalCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
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
                    <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
                    <p className="text-gray-600 mt-1">Track and manage your medical inquiries</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/inquiries/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    New Inquiry
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by condition or symptoms..."
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
                            <option value="ASSIGNED">Assigned</option>
                            <option value="ASSESSED">Assessed</option>
                            <option value="RECOMMENDED">Recommended</option>
                            <option value="APPROVED">Approved</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {inquiries.filter(i => i.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {inquiries.filter(i => ['ASSIGNED', 'ASSESSED', 'RECOMMENDED'].includes(i.status)).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {inquiries.filter(i => i.status === 'COMPLETED').length}
                    </p>
                </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm || statusFilter !== 'ALL' ? 'No inquiries found' : 'No inquiries yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || statusFilter !== 'ALL'
                            ? 'Try adjusting your search or filters'
                            : 'Start your medical journey by submitting your first inquiry'}
                    </p>
                    {!searchTerm && statusFilter === 'ALL' && (
                        <button
                            onClick={() => navigate('/dashboard/inquiries/new')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                        >
                            <Plus className="h-5 w-5" />
                            Submit New Inquiry
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredInquiries.map((inquiry) => {
                        const statusBadge = getStatusBadge(inquiry.status);
                        const urgencyBadge = getUrgencyBadge(inquiry.urgencyLevel);
                        const StatusIcon = statusBadge.icon;

                        return (
                            <div
                                key={inquiry.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                                onClick={() => navigate(`/dashboard/inquiries/${inquiry.id}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {inquiry.medicalCondition}
                                                </h3>
                                                <p className="text-gray-600 line-clamp-2">
                                                    {inquiry.symptoms}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(inquiry.submittedAt)}</span>
                                            </div>
                                            {inquiry.preferredLocation && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{inquiry.preferredLocation}</span>
                                                </div>
                                            )}
                                            {(inquiry.budgetRangeMin || inquiry.budgetRangeMax) && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>
                                                        ${inquiry.budgetRangeMin?.toLocaleString() || '0'} -
                                                        ${inquiry.budgetRangeMax?.toLocaleString() || 'No limit'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {statusBadge.label}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${urgencyBadge.color}`}>
                                                <AlertTriangle className="h-3 w-3" />
                                                {urgencyBadge.label}
                                            </span>
                                        </div>

                                        {inquiry.status === 'PENDING' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancelInquiry(inquiry.id);
                                                }}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Cancel Inquiry
                                            </button>
                                        )}

                                        {inquiry.status === 'ASSESSED' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/inquiries/${inquiry.id}/assessment`);
                                                }}
                                                className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                                            >
                                                View Assessment
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
