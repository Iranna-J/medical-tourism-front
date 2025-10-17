import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Calendar, MapPin, DollarSign, AlertTriangle,
    FileText, User, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { inquiryService, type Inquiry } from '../../services/inquiryService';
import toast from 'react-hot-toast';

export default function InquiryDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadInquiry(parseInt(id));
        }
    }, [id]);

    const loadInquiry = async (inquiryId: number) => {
        try {
            setLoading(true);
            const data = await inquiryService.getInquiryById(inquiryId);
            setInquiry(data);
        } catch (error) {
            console.error('Error loading inquiry:', error);
            toast.error('Failed to load inquiry details');
            navigate('/dashboard/inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelInquiry = async () => {
        if (!inquiry || !confirm('Are you sure you want to cancel this inquiry?')) return;

        try {
            await inquiryService.cancelInquiry(inquiry.id);
            toast.success('Inquiry cancelled successfully');
            navigate('/dashboard/inquiries');
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
            LOW: { color: 'bg-green-100 text-green-800', label: 'Low Priority' },
            MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Priority' },
            HIGH: { color: 'bg-orange-100 text-orange-800', label: 'High Priority' },
            URGENT: { color: 'bg-red-100 text-red-800', label: 'Urgent' },
        };
        return badges[urgency as keyof typeof badges] || badges.MEDIUM;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (!inquiry) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Inquiry not found</p>
            </div>
        );
    }

    const statusBadge = getStatusBadge(inquiry.status);
    const urgencyBadge = getUrgencyBadge(inquiry.urgencyLevel);
    const StatusIcon = statusBadge.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/inquiries')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Inquiry Details</h1>
                    <p className="text-gray-600 mt-1">View your medical inquiry information</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${statusBadge.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusBadge.label}
                    </span>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${urgencyBadge.color}`}>
                        <AlertTriangle className="h-4 w-4" />
                        {urgencyBadge.label}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Medical Condition */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Medical Condition</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Condition</p>
                                <p className="text-gray-900">{inquiry.medicalCondition}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Symptoms</p>
                                <p className="text-gray-900 whitespace-pre-wrap">{inquiry.symptoms}</p>
                            </div>
                            {inquiry.previousTreatments && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Previous Treatments</p>
                                    <p className="text-gray-900 whitespace-pre-wrap">{inquiry.previousTreatments}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Treatment Preferences */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Treatment Preferences</h2>
                        <div className="space-y-4">
                            {inquiry.preferredTreatment && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Preferred Treatment</p>
                                    <p className="text-gray-900">{inquiry.preferredTreatment}</p>
                                </div>
                            )}
                            {inquiry.preferredHospitalId && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Preferred Hospital</p>
                                    <p className="text-gray-900">Hospital ID: {inquiry.preferredHospitalId}</p>
                                </div>
                            )}
                            {inquiry.preferredDoctorId && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Preferred Doctor</p>
                                    <p className="text-gray-900">Doctor ID: {inquiry.preferredDoctorId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    {inquiry.additionalNotes && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h2>
                            <p className="text-gray-900 whitespace-pre-wrap">{inquiry.additionalNotes}</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Quick Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Submitted</p>
                                    <p className="text-sm text-gray-900">{formatDate(inquiry.submittedAt)}</p>
                                </div>
                            </div>
                            {inquiry.preferredLocation && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Preferred Location</p>
                                        <p className="text-sm text-gray-900">{inquiry.preferredLocation}</p>
                                    </div>
                                </div>
                            )}
                            {(inquiry.budgetRangeMin || inquiry.budgetRangeMax) && (
                                <div className="flex items-start gap-3">
                                    <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Budget Range</p>
                                        <p className="text-sm text-gray-900">
                                            ${inquiry.budgetRangeMin?.toLocaleString() || '0'} -
                                            ${inquiry.budgetRangeMax?.toLocaleString() || 'No limit'}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {inquiry.assignedDoctorId && (
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Assigned Doctor</p>
                                        <p className="text-sm text-gray-900">Doctor ID: {inquiry.assignedDoctorId}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attached Reports */}
                    {inquiry.attachedReportIds && inquiry.attachedReportIds.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Attached Reports</h2>
                            <div className="space-y-2">
                                {inquiry.attachedReportIds.map((reportId) => (
                                    <div key={reportId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-900">Report #{reportId}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                        <div className="space-y-3">
                            {inquiry.status === 'ASSESSED' && (
                                <button
                                    onClick={() => navigate(`/dashboard/inquiries/${inquiry.id}/assessment`)}
                                    className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                                >
                                    View Assessment
                                </button>
                            )}
                            {inquiry.status === 'PENDING' && (
                                <button
                                    onClick={handleCancelInquiry}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Cancel Inquiry
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/dashboard/inquiries')}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Back to Inquiries
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
