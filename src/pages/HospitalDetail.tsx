import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin, Phone, Mail, Globe, Award, Bed, Star,
    CheckCircle, Building2, Users, Calendar
} from 'lucide-react';
import { hospitalService } from '../services/hospitalService';
import type { Hospital, Doctor } from '../types';
import DoctorCard from '../components/DoctorCard';
import toast from 'react-hot-toast';

export default function HospitalDetail() {
    const { id } = useParams<{ id: string }>();
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'reviews'>('overview');

    useEffect(() => {
        if (id) {
            loadHospitalData(parseInt(id));
        }
    }, [id]);

    const loadHospitalData = async (hospitalId: number) => {
        try {
            setLoading(true);
            const [hospitalData, doctorsData] = await Promise.all([
                hospitalService.getById(hospitalId),
                hospitalService.getDoctors(hospitalId)
            ]);
            setHospital(hospitalData);
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Error loading hospital:', error);
            toast.error('Failed to load hospital details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading hospital details...</p>
                </div>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Hospital Not Found</h2>
                    <p className="text-gray-600 mb-6">The hospital you're looking for doesn't exist.</p>
                    <Link
                        to="/hospitals"
                        className="inline-flex items-center px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                        Back to Hospitals
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
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-4xl font-bold">{hospital.name}</h1>
                                {hospital.isJciAccredited && (
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                        JCI Accredited
                                    </span>
                                )}
                                {hospital.isNabhAccredited && (
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                        NABH Accredited
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>{hospital.city}, {hospital.state}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{hospital.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bed className="h-5 w-5" />
                                    <span>{hospital.totalBeds} Beds</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to={`/inquiries/new?hospitalId=${hospital.id}`}
                            className="px-8 py-3 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Book Consultation
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-2 border-b-2 font-medium transition ${activeTab === 'overview'
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`py-4 px-2 border-b-2 font-medium transition ${activeTab === 'doctors'
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Doctors ({doctors.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-2 border-b-2 font-medium transition ${activeTab === 'reviews'
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Reviews
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* About */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About Hospital</h2>
                                    <p className="text-gray-600 leading-relaxed">{hospital.description}</p>
                                </div>

                                {/* Facilities */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Facilities & Services</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700">24/7 Emergency</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700">ICU ({hospital.icuBeds} beds)</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700">Operation Theaters</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700">Diagnostic Center</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700">Pharmacy</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-700">Blood Bank</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Accreditations */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Accreditations</h2>
                                    <div className="flex gap-4">
                                        {hospital.isJciAccredited && (
                                            <div className="flex items-center gap-3 px-4 py-3 bg-sky-50 rounded-lg">
                                                <Award className="h-6 w-6 text-sky-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">JCI Accredited</p>
                                                    <p className="text-sm text-gray-600">Joint Commission International</p>
                                                </div>
                                            </div>
                                        )}
                                        {hospital.isNabhAccredited && (
                                            <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-lg">
                                                <Award className="h-6 w-6 text-purple-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">NABH Accredited</p>
                                                    <p className="text-sm text-gray-600">National Accreditation Board</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'doctors' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Doctors</h2>
                                {doctors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {doctors.map((doctor) => (
                                            <DoctorCard key={doctor.id} doctor={doctor} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No doctors available at this hospital.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h2>
                                <div className="text-center py-12">
                                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Reviews coming soon...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="text-gray-900">{hospital.address}</p>
                                        <p className="text-gray-900">{hospital.city}, {hospital.state}</p>
                                        <p className="text-gray-900">{hospital.country} - {hospital.pincode}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <a href={`tel:${hospital.phone}`} className="text-sky-600 hover:underline">
                                            {hospital.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <a href={`mailto:${hospital.email}`} className="text-sky-600 hover:underline">
                                            {hospital.email}
                                        </a>
                                    </div>
                                </div>

                                {hospital.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <a
                                                href={hospital.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sky-600 hover:underline"
                                            >
                                                Visit Website
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
                                    <span className="text-gray-600">Total Beds</span>
                                    <span className="font-semibold text-gray-900">{hospital.totalBeds}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">ICU Beds</span>
                                    <span className="font-semibold text-gray-900">{hospital.icuBeds}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Doctors</span>
                                    <span className="font-semibold text-gray-900">{doctors.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Rating</span>
                                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {hospital.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-sky-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                            <h3 className="text-lg font-bold mb-2">Ready to Book?</h3>
                            <p className="text-white/90 text-sm mb-4">
                                Get expert medical consultation and treatment at {hospital.name}
                            </p>
                            <Link
                                to={`/inquiries/new?hospitalId=${hospital.id}`}
                                className="block w-full px-6 py-3 bg-white text-sky-600 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
                            >
                                Submit Inquiry
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
