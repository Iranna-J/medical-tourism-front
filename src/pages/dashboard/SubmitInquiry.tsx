import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Check, AlertTriangle,
    FileText, DollarSign, Clock, Send
} from 'lucide-react';
import { inquiryService, type InquiryRequest } from '../../services/inquiryService';
import { medicalReportService, type MedicalReport } from '../../services/medicalReportService';
import { hospitalService } from '../../services/hospitalService';
import { doctorService } from '../../services/doctorService';
import type { Hospital, Doctor } from '../../types';
import toast from 'react-hot-toast';

export default function SubmitInquiry() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [formData, setFormData] = useState<InquiryRequest>({
        medicalCondition: '',
        symptoms: '',
        previousTreatments: '',
        preferredTreatment: '',
        budgetRangeMin: undefined,
        budgetRangeMax: undefined,
        preferredLocation: '',
        urgencyLevel: 'MEDIUM',
        additionalNotes: '',
        preferredHospitalId: undefined,
        preferredDoctorId: undefined,
        attachedReportIds: [],
    });

    const steps = [
        { id: 1, name: 'Medical Condition', icon: AlertTriangle },
        { id: 2, name: 'Treatment Preferences', icon: FileText },
        { id: 3, name: 'Budget & Location', icon: DollarSign },
        { id: 4, name: 'Additional Details', icon: Clock },
        { id: 5, name: 'Review & Submit', icon: Send },
    ];

    useEffect(() => {
        loadData();

        // Pre-fill from URL params
        const hospitalId = searchParams.get('hospitalId');
        const doctorId = searchParams.get('doctorId');
        if (hospitalId) {
            setFormData(prev => ({ ...prev, preferredHospitalId: parseInt(hospitalId) }));
        }
        if (doctorId) {
            setFormData(prev => ({ ...prev, preferredDoctorId: parseInt(doctorId) }));
        }
    }, [searchParams]);

    const loadData = async () => {
        try {
            const [reportsData, hospitalsData, doctorsData] = await Promise.all([
                medicalReportService.getMyReports(),
                hospitalService.getAll(0, 20),
                doctorService.getAll(0, 20),
            ]);
            setReports(reportsData);
            setHospitals(hospitalsData.content);
            setDoctors(doctorsData.content);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('budget') || name.includes('Id') ?
                (value ? Number(value) : undefined) : value,
        }));
    };

    const handleReportToggle = (reportId: number) => {
        setFormData(prev => ({
            ...prev,
            attachedReportIds: prev.attachedReportIds?.includes(reportId)
                ? prev.attachedReportIds.filter(id => id !== reportId)
                : [...(prev.attachedReportIds || []), reportId],
        }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(formData.medicalCondition && formData.symptoms);
            case 2:
                return true; // Optional fields
            case 3:
                return true; // Optional fields
            case 4:
                return !!formData.urgencyLevel;
            case 5:
                return true;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(5, prev + 1));
        } else {
            toast.error('Please fill in all required fields');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(1)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await inquiryService.submitInquiry(formData);
            toast.success('Inquiry submitted successfully!');
            navigate('/dashboard/inquiries');
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            toast.error('Failed to submit inquiry');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medical Condition *
                            </label>
                            <input
                                type="text"
                                name="medicalCondition"
                                value={formData.medicalCondition}
                                onChange={handleInputChange}
                                placeholder="e.g., Heart Disease, Diabetes, Cancer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Symptoms *
                            </label>
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Describe your symptoms in detail..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Treatments
                            </label>
                            <textarea
                                name="previousTreatments"
                                value={formData.previousTreatments}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="List any previous treatments, medications, or surgeries..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Treatment
                            </label>
                            <input
                                type="text"
                                name="preferredTreatment"
                                value={formData.preferredTreatment}
                                onChange={handleInputChange}
                                placeholder="e.g., Surgery, Medication, Therapy"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Hospital
                            </label>
                            <select
                                name="preferredHospitalId"
                                value={formData.preferredHospitalId || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">No preference</option>
                                {hospitals.map(hospital => (
                                    <option key={hospital.id} value={hospital.id}>
                                        {hospital.name} - {hospital.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Doctor
                            </label>
                            <select
                                name="preferredDoctorId"
                                value={formData.preferredDoctorId || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">No preference</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Range (USD)
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="number"
                                        name="budgetRangeMin"
                                        value={formData.budgetRangeMin || ''}
                                        onChange={handleInputChange}
                                        placeholder="Minimum"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="budgetRangeMax"
                                        value={formData.budgetRangeMax || ''}
                                        onChange={handleInputChange}
                                        placeholder="Maximum"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Location
                            </label>
                            <input
                                type="text"
                                name="preferredLocation"
                                value={formData.preferredLocation}
                                onChange={handleInputChange}
                                placeholder="e.g., India, Thailand, Singapore"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Urgency Level *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
                                    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                                    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                                    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200' },
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, urgencyLevel: option.value as any }))}
                                        className={`p-3 border-2 rounded-lg text-center font-medium transition ${formData.urgencyLevel === option.value
                                            ? option.color + ' border-current'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Any additional information you'd like to share..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Attach Medical Reports
                            </label>
                            {reports.length > 0 ? (
                                <div className="space-y-2">
                                    {reports.map(report => (
                                        <label key={report.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.attachedReportIds?.includes(report.id) || false}
                                                onChange={() => handleReportToggle(report.id)}
                                                className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                            />
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{report.fileName}</p>
                                                <p className="text-sm text-gray-500">{report.reportType}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No medical reports uploaded yet.
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Review Your Inquiry</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Medical Condition</p>
                                    <p className="text-gray-900">{formData.medicalCondition}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Symptoms</p>
                                    <p className="text-gray-900">{formData.symptoms}</p>
                                </div>
                                {formData.preferredTreatment && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Preferred Treatment</p>
                                        <p className="text-gray-900">{formData.preferredTreatment}</p>
                                    </div>
                                )}
                                {(formData.budgetRangeMin || formData.budgetRangeMax) && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Budget Range</p>
                                        <p className="text-gray-900">
                                            ${formData.budgetRangeMin?.toLocaleString() || '0'} -
                                            ${formData.budgetRangeMax?.toLocaleString() || 'No limit'}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Urgency Level</p>
                                    <p className="text-gray-900">{formData.urgencyLevel}</p>
                                </div>
                                {formData.attachedReportIds && formData.attachedReportIds.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Attached Reports</p>
                                        <p className="text-gray-900">{formData.attachedReportIds.length} reports attached</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Submit Medical Inquiry</h1>
                    <p className="text-gray-600 mt-1">Get expert medical consultation and treatment recommendations</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : isActive
                                        ? 'bg-sky-500 border-sky-500 text-white'
                                        : 'border-gray-300 text-gray-400'
                                    }`}>
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="ml-3 hidden md:block">
                                    <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {step.name}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Step {currentStep}: {steps[currentStep - 1].name}
                    </h2>
                </div>

                {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                </button>

                {currentStep < 5 ? (
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                    >
                        Next
                        <ArrowRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                        {submitting ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                )}
            </div>
        </div>
    );
}
