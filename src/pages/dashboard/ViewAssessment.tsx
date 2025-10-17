import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, FileText, AlertTriangle, Clock, CheckCircle,
    Activity, TrendingUp, Shield, Calendar, DollarSign,
    User, Building2, Stethoscope, ThumbsUp, MessageSquare
} from 'lucide-react';
import { assessmentService, type Assessment, type TreatmentRecommendation } from '../../services/assessmentService';
import { inquiryService, type Inquiry } from '../../services/inquiryService';
import toast from 'react-hot-toast';

export default function ViewAssessment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [recommendations, setRecommendations] = useState<TreatmentRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showChangesModal, setShowChangesModal] = useState(false);
    const [changeNotes, setChangeNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadData(parseInt(id));
        }
    }, [id]);

    const loadData = async (inquiryId: number) => {
        try {
            setLoading(true);
            const [inquiryData, assessmentData] = await Promise.all([
                inquiryService.getInquiryById(inquiryId),
                assessmentService.getAssessmentByInquiryId(inquiryId),
            ]);
            setInquiry(inquiryData);
            setAssessment(assessmentData);

            if (assessmentData) {
                const recsData = await assessmentService.getRecommendations(assessmentData.id);
                setRecommendations(recsData);
            }
        } catch (error) {
            console.error('Error loading assessment:', error);
            toast.error('Failed to load assessment');
            navigate(`/dashboard/inquiries/${id}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!assessment || !confirm('Are you sure you want to approve this assessment?')) return;

        try {
            setSubmitting(true);
            await assessmentService.approveAssessment(assessment.id);
            toast.success('Assessment approved successfully!');
            navigate('/dashboard/inquiries');
        } catch (error) {
            console.error('Error approving assessment:', error);
            toast.error('Failed to approve assessment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestChanges = async () => {
        if (!assessment || !changeNotes.trim()) {
            toast.error('Please provide details about the changes you need');
            return;
        }

        try {
            setSubmitting(true);
            await assessmentService.requestChanges(assessment.id, changeNotes);
            toast.success('Change request submitted successfully!');
            setShowChangesModal(false);
            navigate('/dashboard/inquiries');
        } catch (error) {
            console.error('Error requesting changes:', error);
            toast.error('Failed to submit change request');
        } finally {
            setSubmitting(false);
        }
    };

    const getRiskBadge = (risk: string) => {
        const badges = {
            LOW: { color: 'bg-green-100 text-green-800', label: 'Low Risk' },
            MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Risk' },
            HIGH: { color: 'bg-red-100 text-red-800', label: 'High Risk' },
        };
        return badges[risk as keyof typeof badges] || badges.MEDIUM;
    };

    const getUrgencyBadge = (urgency: string) => {
        const badges = {
            LOW: { color: 'bg-green-100 text-green-800', label: 'Low Urgency' },
            MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Urgency' },
            HIGH: { color: 'bg-orange-100 text-orange-800', label: 'High Urgency' },
            URGENT: { color: 'bg-red-100 text-red-800', label: 'Urgent' },
        };
        return badges[urgency as keyof typeof badges] || badges.MEDIUM;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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

    if (!assessment || !inquiry) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Assessment not found</p>
            </div>
        );
    }

    const riskBadge = getRiskBadge(assessment.riskLevel);
    const urgencyBadge = getUrgencyBadge(assessment.urgencyLevel);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(`/dashboard/inquiries/${id}`)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Medical Assessment</h1>
                    <p className="text-gray-600 mt-1">Review your doctor's assessment and recommendations</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${riskBadge.color}`}>
                        <Shield className="h-4 w-4" />
                        {riskBadge.label}
                    </span>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${urgencyBadge.color}`}>
                        <AlertTriangle className="h-4 w-4" />
                        {urgencyBadge.label}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Assessment Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Original Inquiry Summary */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-6 border border-sky-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-sky-600" />
                            Your Inquiry
                        </h2>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Condition</p>
                                <p className="text-gray-900">{inquiry.medicalCondition}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Symptoms</p>
                                <p className="text-gray-900">{inquiry.symptoms}</p>
                            </div>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Stethoscope className="h-5 w-5 text-sky-600" />
                            Diagnosis
                        </h2>
                        <p className="text-gray-900 text-lg font-medium mb-3">{assessment.diagnosis}</p>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{assessment.assessmentNotes}</p>
                        </div>
                    </div>

                    {/* Recommended Treatment */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-sky-600" />
                            Recommended Treatment
                        </h2>
                        <p className="text-gray-900 whitespace-pre-wrap mb-4">{assessment.recommendedTreatment}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                                <Clock className="h-5 w-5 text-sky-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Duration</p>
                                    <p className="text-gray-900">{assessment.estimatedDuration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Risk Level</p>
                                    <p className="text-gray-900">{assessment.riskLevel}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Tests */}
                    {assessment.additionalTests && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-sky-600" />
                                Additional Tests Required
                            </h2>
                            <p className="text-gray-900 whitespace-pre-wrap">{assessment.additionalTests}</p>
                        </div>
                    )}

                    {/* Precautions */}
                    {assessment.precautions && (
                        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                Precautions & Care Instructions
                            </h2>
                            <p className="text-gray-900 whitespace-pre-wrap">{assessment.precautions}</p>
                        </div>
                    )}

                    {/* Treatment Recommendations */}
                    {recommendations.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-sky-600" />
                                Recommended Treatment Options
                            </h2>
                            <div className="space-y-4">
                                {recommendations.map((rec, index) => (
                                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:border-sky-300 transition">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center justify-center w-8 h-8 bg-sky-100 text-sky-600 rounded-full font-bold text-sm">
                                                    {index + 1}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900">{rec.treatmentType}</h3>
                                            </div>
                                            {rec.successRate && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {rec.successRate}% Success Rate
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-4">{rec.description}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900 font-medium">
                                                    ${rec.estimatedCost.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-700">{rec.estimatedDuration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-700">Hospital ID: {rec.hospitalId}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Assessment Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Assessment Info</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Assessed On</p>
                                    <p className="text-sm text-gray-900">{formatDate(assessment.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Assessed By</p>
                                    <p className="text-sm text-gray-900">Doctor ID: {assessment.doctorId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Summary */}
                    {recommendations.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Cost Range</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Minimum</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ${Math.min(...recommendations.map(r => r.estimatedCost)).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Maximum</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ${Math.max(...recommendations.map(r => r.estimatedCost)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={handleApprove}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                <ThumbsUp className="h-5 w-5" />
                                {submitting ? 'Processing...' : 'Approve Assessment'}
                            </button>
                            <button
                                onClick={() => setShowChangesModal(true)}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                            >
                                <MessageSquare className="h-5 w-5" />
                                Request Changes
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/inquiries/${id}`)}
                                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Back to Inquiry
                            </button>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Have questions about your assessment? Contact our support team.
                        </p>
                        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            Contact Support →
                        </button>
                    </div>
                </div>
            </div>

            {/* Request Changes Modal */}
            {showChangesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Changes</h3>
                        <p className="text-gray-600 mb-4">
                            Please describe what changes or clarifications you need from the doctor.
                        </p>
                        <textarea
                            value={changeNotes}
                            onChange={(e) => setChangeNotes(e.target.value)}
                            rows={4}
                            placeholder="Describe the changes you need..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowChangesModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestChanges}
                                disabled={submitting || !changeNotes.trim()}
                                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
