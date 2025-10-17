import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Building2, User, Pill, FlaskConical,
    Home, Plane, Package, Receipt, Tag, Shield, Calendar,
    CheckCircle, AlertCircle, FileText, CreditCard
} from 'lucide-react';
import { costEstimateService, type CostEstimate } from '../../services/costEstimateService';
import { inquiryService, type Inquiry } from '../../services/inquiryService';
import toast from 'react-hot-toast';

export default function CostEstimatePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [estimate, setEstimate] = useState<CostEstimate | null>(null);
    const [loading, setLoading] = useState(true);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisionNotes, setRevisionNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadData(parseInt(id));
        }
    }, [id]);

    const loadData = async (inquiryId: number) => {
        try {
            setLoading(true);
            const [inquiryData, estimateData] = await Promise.all([
                inquiryService.getInquiryById(inquiryId),
                costEstimateService.getCostEstimateByInquiryId(inquiryId),
            ]);
            setInquiry(inquiryData);
            setEstimate(estimateData);
        } catch (error) {
            console.error('Error loading cost estimate:', error);
            toast.error('Failed to load cost estimate');
            navigate(`/dashboard/inquiries/${id}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!estimate) return;

        try {
            setSubmitting(true);
            await costEstimateService.approveCostEstimate(estimate.id, { approved: true });
            toast.success('Cost estimate approved! You can now proceed to booking.');
            setShowApproveModal(false);
            navigate('/dashboard/inquiries');
        } catch (error) {
            console.error('Error approving estimate:', error);
            toast.error('Failed to approve cost estimate');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestRevision = async () => {
        if (!estimate || !revisionNotes.trim()) {
            toast.error('Please provide details about the revision you need');
            return;
        }

        try {
            setSubmitting(true);
            await costEstimateService.requestRevision(estimate.id, revisionNotes);
            toast.success('Revision request submitted successfully!');
            setShowRevisionModal(false);
            navigate('/dashboard/inquiries');
        } catch (error) {
            console.error('Error requesting revision:', error);
            toast.error('Failed to submit revision request');
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const costItems = estimate ? [
        { icon: Building2, label: 'Treatment Cost', amount: estimate.treatmentCost, color: 'text-sky-600' },
        { icon: Building2, label: 'Hospital Fees', amount: estimate.hospitalFees, color: 'text-blue-600' },
        { icon: User, label: 'Doctor Fees', amount: estimate.doctorFees, color: 'text-purple-600' },
        { icon: Pill, label: 'Medication', amount: estimate.medicationCost, color: 'text-pink-600' },
        { icon: FlaskConical, label: 'Lab Tests', amount: estimate.labTestsCost, color: 'text-indigo-600' },
        { icon: Home, label: 'Accommodation', amount: estimate.accommodationCost, color: 'text-green-600' },
        { icon: Plane, label: 'Travel Assistance', amount: estimate.travelAssistanceCost, color: 'text-orange-600' },
        { icon: Package, label: 'Miscellaneous', amount: estimate.miscellaneousCost, color: 'text-gray-600' },
    ] : [];

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

    if (!estimate || !inquiry) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Cost estimate not found</p>
            </div>
        );
    }

    const netPayable = estimate.totalCost - (estimate.insuranceCoverage || 0);

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
                    <h1 className="text-2xl font-bold text-gray-900">Cost Estimate</h1>
                    <p className="text-gray-600 mt-1">Detailed breakdown of treatment costs</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Valid until {formatDate(estimate.validUntil)}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Cost Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Inquiry Summary */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-6 border border-sky-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-sky-600" />
                            Treatment Summary
                        </h2>
                        <p className="text-gray-900 font-medium">{inquiry.medicalCondition}</p>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-sky-600" />
                            Cost Breakdown
                        </h2>
                        <div className="space-y-3">
                            {costItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-5 w-5 ${item.color}`} />
                                            <span className="font-medium text-gray-900">{item.label}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            {formatCurrency(item.amount, estimate.currency)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Subtotal */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-lg">
                                <span className="font-medium text-gray-700">Subtotal</span>
                                <span className="font-bold text-gray-900">
                                    {formatCurrency(estimate.subtotal, estimate.currency)}
                                </span>
                            </div>
                        </div>

                        {/* Tax */}
                        {estimate.taxAmount > 0 && (
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-gray-700">Tax</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(estimate.taxAmount, estimate.currency)}
                                </span>
                            </div>
                        )}

                        {/* Discount */}
                        {estimate.discountAmount > 0 && (
                            <div className="mt-3 flex items-center justify-between text-green-600">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    <span>Discount</span>
                                </div>
                                <span className="font-semibold">
                                    -{formatCurrency(estimate.discountAmount, estimate.currency)}
                                </span>
                            </div>
                        )}

                        {/* Total */}
                        <div className="mt-6 pt-4 border-t-2 border-gray-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">Total Cost</span>
                                <span className="text-2xl font-bold text-sky-600">
                                    {formatCurrency(estimate.totalCost, estimate.currency)}
                                </span>
                            </div>
                        </div>

                        {/* Insurance Coverage */}
                        {estimate.insuranceCoverage && estimate.insuranceCoverage > 0 && (
                            <>
                                <div className="mt-4 flex items-center justify-between text-purple-600">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        <span className="font-medium">Insurance Coverage</span>
                                    </div>
                                    <span className="font-bold">
                                        -{formatCurrency(estimate.insuranceCoverage, estimate.currency)}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-purple-200 bg-purple-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">Net Payable</span>
                                        <span className="text-2xl font-bold text-purple-600">
                                            {formatCurrency(netPayable, estimate.currency)}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Additional Notes */}
                    {estimate.notes && (
                        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                Important Notes
                            </h2>
                            <p className="text-gray-900 whitespace-pre-wrap">{estimate.notes}</p>
                        </div>
                    )}

                    {/* Payment Options */}
                    {estimate.paymentOptions && estimate.paymentOptions.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-sky-600" />
                                Payment Options
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {estimate.paymentOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-gray-900">{option}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Total Summary Card */}
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <h2 className="text-lg font-bold mb-4">Total Estimate</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sky-100 text-sm">Total Cost</p>
                                <p className="text-3xl font-bold">
                                    {formatCurrency(estimate.totalCost, estimate.currency)}
                                </p>
                            </div>
                            {estimate.insuranceCoverage && estimate.insuranceCoverage > 0 && (
                                <>
                                    <div className="pt-3 border-t border-sky-400">
                                        <p className="text-sky-100 text-sm">Insurance Coverage</p>
                                        <p className="text-xl font-bold">
                                            -{formatCurrency(estimate.insuranceCoverage, estimate.currency)}
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t-2 border-white">
                                        <p className="text-sky-100 text-sm">You Pay</p>
                                        <p className="text-3xl font-bold">
                                            {formatCurrency(netPayable, estimate.currency)}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Estimate Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Estimate Details</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Created On</p>
                                <p className="text-sm text-gray-900">{formatDate(estimate.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Valid Until</p>
                                <p className="text-sm text-gray-900">{formatDate(estimate.validUntil)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Currency</p>
                                <p className="text-sm text-gray-900">{estimate.currency}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowApproveModal(true)}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                <CheckCircle className="h-5 w-5" />
                                {submitting ? 'Processing...' : 'Approve & Proceed'}
                            </button>
                            <button
                                onClick={() => setShowRevisionModal(true)}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                            >
                                <AlertCircle className="h-5 w-5" />
                                Request Revision
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
                        <h3 className="font-bold text-gray-900 mb-2">Questions?</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Need clarification on any costs? Our team is here to help.
                        </p>
                        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                            Contact Support →
                        </button>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Approve Cost Estimate</h3>
                        <p className="text-gray-600 mb-6">
                            By approving this cost estimate, you agree to proceed with the treatment at the estimated cost of{' '}
                            <span className="font-bold text-gray-900">
                                {formatCurrency(estimate.insuranceCoverage ? netPayable : estimate.totalCost, estimate.currency)}
                            </span>.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Approving...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Revision Modal */}
            {showRevisionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Revision</h3>
                        <p className="text-gray-600 mb-4">
                            Please describe what changes or clarifications you need regarding the cost estimate.
                        </p>
                        <textarea
                            value={revisionNotes}
                            onChange={(e) => setRevisionNotes(e.target.value)}
                            rows={4}
                            placeholder="Describe the revision you need..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRevisionModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestRevision}
                                disabled={submitting || !revisionNotes.trim()}
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
