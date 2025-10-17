import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Building2, User, Clock, FileText,
    CheckCircle, AlertCircle, Send
} from 'lucide-react';
import { bookingService, type BookingRequest } from '../../services/bookingService';
import { inquiryService, type Inquiry } from '../../services/inquiryService';
import { assessmentService, type Assessment } from '../../services/assessmentService';
import { costEstimateService, type CostEstimate } from '../../services/costEstimateService';
import toast from 'react-hot-toast';

export default function CreateBooking() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<BookingRequest>({
        inquiryId: 0,
        hospitalId: 0,
        doctorId: 0,
        treatmentType: '',
        preferredStartDate: '',
        estimatedDuration: '',
        notes: '',
    });

    useEffect(() => {
        if (id) {
            loadData(parseInt(id));
        }
    }, [id]);

    const loadData = async (inquiryId: number) => {
        try {
            setLoading(true);
            const [inquiryData, assessmentData, costData] = await Promise.all([
                inquiryService.getInquiryById(inquiryId),
                assessmentService.getAssessmentByInquiryId(inquiryId),
                costEstimateService.getCostEstimateByInquiryId(inquiryId),
            ]);

            setInquiry(inquiryData);
            setAssessment(assessmentData);
            setCostEstimate(costData);

            // Pre-fill form data
            setFormData({
                inquiryId: inquiryId,
                hospitalId: inquiryData.preferredHospitalId || 0,
                doctorId: assessmentData.doctorId,
                treatmentType: assessmentData.recommendedTreatment,
                preferredStartDate: '',
                estimatedDuration: assessmentData.estimatedDuration,
                notes: '',
            });
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load booking information');
            navigate(`/dashboard/inquiries/${id}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Id') ? (value ? Number(value) : 0) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.preferredStartDate) {
            toast.error('Please select a preferred start date');
            return;
        }

        if (!formData.hospitalId || !formData.doctorId) {
            toast.error('Please select hospital and doctor');
            return;
        }

        try {
            setSubmitting(true);
            const booking = await bookingService.createBooking(formData);
            toast.success('Booking created successfully!');
            navigate(`/dashboard/bookings/${booking.id}`);
        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error('Failed to create booking');
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

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
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

    if (!inquiry || !assessment || !costEstimate) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Booking information not found</p>
            </div>
        );
    }

    const netPayable = costEstimate.totalCost - (costEstimate.insuranceCoverage || 0);

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
                    <h1 className="text-2xl font-bold text-gray-900">Create Booking</h1>
                    <p className="text-gray-600 mt-1">Schedule your treatment appointment</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Booking Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Treatment Summary */}
                        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-6 border border-sky-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-sky-600" />
                                Treatment Summary
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Condition</p>
                                    <p className="text-gray-900">{inquiry.medicalCondition}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Diagnosis</p>
                                    <p className="text-gray-900">{assessment.diagnosis}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Recommended Treatment</p>
                                    <p className="text-gray-900">{assessment.recommendedTreatment}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details Form */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Booking Details</h2>
                            <div className="space-y-6">
                                {/* Hospital Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Building2 className="inline h-4 w-4 mr-1" />
                                        Hospital *
                                    </label>
                                    <input
                                        type="number"
                                        name="hospitalId"
                                        value={formData.hospitalId || ''}
                                        onChange={handleInputChange}
                                        placeholder="Hospital ID"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {inquiry.preferredHospitalId ? 'Pre-filled from your preference' : 'Enter hospital ID'}
                                    </p>
                                </div>

                                {/* Doctor Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline h-4 w-4 mr-1" />
                                        Doctor *
                                    </label>
                                    <input
                                        type="number"
                                        name="doctorId"
                                        value={formData.doctorId || ''}
                                        onChange={handleInputChange}
                                        placeholder="Doctor ID"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Assigned doctor from assessment
                                    </p>
                                </div>

                                {/* Treatment Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Treatment Type *
                                    </label>
                                    <input
                                        type="text"
                                        name="treatmentType"
                                        value={formData.treatmentType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        required
                                        readOnly
                                    />
                                </div>

                                {/* Preferred Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="inline h-4 w-4 mr-1" />
                                        Preferred Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="preferredStartDate"
                                        value={formData.preferredStartDate}
                                        onChange={handleInputChange}
                                        min={getMinDate()}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Select your preferred treatment start date
                                    </p>
                                </div>

                                {/* Estimated Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="inline h-4 w-4 mr-1" />
                                        Estimated Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="estimatedDuration"
                                        value={formData.estimatedDuration}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        readOnly
                                    />
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Any special requests or additional information..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                Important Information
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span>Your booking will be confirmed within 24-48 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span>Payment will be required to confirm your booking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span>You can cancel or reschedule up to 48 hours before the start date</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <span>All medical reports should be submitted before the treatment date</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Cost Summary */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                            <h2 className="text-lg font-bold mb-4">Cost Summary</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-green-100 text-sm">Total Cost</p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(costEstimate.totalCost, costEstimate.currency)}
                                    </p>
                                </div>
                                {costEstimate.insuranceCoverage && costEstimate.insuranceCoverage > 0 && (
                                    <>
                                        <div className="pt-3 border-t border-green-400">
                                            <p className="text-green-100 text-sm">Insurance Coverage</p>
                                            <p className="text-xl font-bold">
                                                -{formatCurrency(costEstimate.insuranceCoverage, costEstimate.currency)}
                                            </p>
                                        </div>
                                        <div className="pt-3 border-t-2 border-white">
                                            <p className="text-green-100 text-sm">Amount to Pay</p>
                                            <p className="text-3xl font-bold">
                                                {formatCurrency(netPayable, costEstimate.currency)}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Treatment Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Treatment Info</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Duration</p>
                                        <p className="text-sm text-gray-900">{assessment.estimatedDuration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Risk Level</p>
                                        <p className="text-sm text-gray-900">{assessment.riskLevel}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 text-lg font-semibold"
                            >
                                <Send className="h-5 w-5" />
                                {submitting ? 'Creating Booking...' : 'Create Booking'}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                By creating a booking, you agree to our terms and conditions
                            </p>
                        </div>

                        {/* Help */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-2">Need Assistance?</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Our team is here to help you with your booking.
                            </p>
                            <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                                Contact Support →
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
