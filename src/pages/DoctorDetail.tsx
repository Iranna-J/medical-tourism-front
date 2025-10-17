import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Phone, Mail, Star, Award, Briefcase,
    GraduationCap, DollarSign, Calendar, Clock,
    Languages, User, Building2
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import type { Doctor } from '../types';
import toast from 'react-hot-toast';

export default function DoctorDetail() {
    const { id } = useParams<{ id: string }>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

    useEffect(() => {
        if (id) {
            loadDoctorData(parseInt(id));
        }
    }, [id]);

    const loadDoctorData = async (doctorId: number) => {
        try {
            setLoading(true);
            const doctorData = await doctorService.getById(doctorId);
            setDoctor(doctorData);
        } catch (error) {
            console.error('Error loading doctor:', error);
            toast.error('Failed to load doctor details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading doctor profile...</p>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
                    <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist.</p>
                    <Link
                        to="/doctors"
                        className="inline-flex items-center px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                        Back to Doctors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-sky-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Doctor Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                                {doctor.firstName[0]}{doctor.lastName[0]}
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </h1>
                                {doctor.isAvailable && (
                                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm font-medium">
                                        Available
                                    </span>
                                )}
                            </div>

                            <p className="text-xl text-white/90 mb-4">{doctor.specialization}</p>

                            <div className="flex flex-wrap items-center gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    <span>{doctor.experienceYears} years experience</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
                                    <span className="text-white/70">({doctor.totalReviews || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>${doctor.consultationFee} consultation fee</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex-shrink-0">
                            <Link
                                to={`/inquiries/new?doctorId=${doctor.id}`}
                                className="px-8 py-3 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-100 transition block text-center"
                            >
                                Book Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`py-4 px-2 border-b-2 font-medium transition ${activeTab === 'about'
                                    ? 'border-sky-500 text-sky-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-2 border-b-2 font-medium transition ${activeTab === 'reviews'
                                    ? 'border-sky-500 text-sky-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Reviews ({doctor.totalReviews || 0})
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                {/* Bio */}
                                {doctor.bio && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dr. {doctor.lastName}</h2>
                                        <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
                                    </div>
                                )}

                                {/* Qualifications */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualifications</h2>
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="h-6 w-6 text-sky-600 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{doctor.qualification}</p>
                                            <p className="text-gray-600 text-sm mt-1">Medical Degree & Certifications</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Specialization */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Specialization</h2>
                                    <div className="flex items-start gap-3">
                                        <Award className="h-6 w-6 text-purple-600 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{doctor.specialization}</p>
                                            <p className="text-gray-600 text-sm mt-1">Primary area of expertise</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="h-6 w-6 text-green-600 mt-1" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{doctor.experienceYears} Years</p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Extensive experience in {doctor.specialization.toLowerCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Languages */}
                                {doctor.languages && doctor.languages.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Languages</h2>
                                        <div className="flex items-start gap-3">
                                            <Languages className="h-6 w-6 text-blue-600 mt-1" />
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.languages.map((lang, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                    >
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Awards */}
                                {doctor.awards && doctor.awards.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
                                        <div className="space-y-3">
                                            {doctor.awards.map((award, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <Award className="h-5 w-5 text-yellow-600 mt-1" />
                                                    <p className="text-gray-700">{award}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h2>
                                <div className="text-center py-12">
                                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Reviews coming soon...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Consultation Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-semibold text-gray-900">${doctor.consultationFee}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-semibold text-gray-900">30-45 mins</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Availability</span>
                                    <span className={`font-semibold ${doctor.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        {doctor.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                {doctor.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <a href={`tel:${doctor.phone}`} className="text-sky-600 hover:underline">
                                                {doctor.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {doctor.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <a href={`mailto:${doctor.email}`} className="text-sky-600 hover:underline">
                                                {doctor.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Experience</span>
                                    <span className="font-semibold text-gray-900">{doctor.experienceYears} years</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Rating</span>
                                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {doctor.rating.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Reviews</span>
                                    <span className="font-semibold text-gray-900">{doctor.totalReviews || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-5 w-5" />
                                    <span>Monday - Friday</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span>9:00 AM - 5:00 PM</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-sky-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                            <h3 className="text-lg font-bold mb-2">Book Consultation</h3>
                            <p className="text-white/90 text-sm mb-4">
                                Get expert medical consultation from Dr. {doctor.lastName}
                            </p>
                            <Link
                                to={`/inquiries/new?doctorId=${doctor.id}`}
                                className="block w-full px-6 py-3 bg-white text-sky-600 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
                            >
                                Schedule Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
