import { Star, Award, Calendar } from 'lucide-react';
import type { Doctor } from '../types';
import { Link } from 'react-router-dom';

interface DoctorCardProps {
    doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <div className="card group cursor-pointer">
            <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {doctor.firstName[0]}{doctor.lastName[0]}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                    <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{doctor.rating.toFixed(1)} Rating</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.qualification}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.experienceYears} years experience</span>
                </div>
            </div>

            {doctor.bio && (
                <p className="text-gray-600 mt-3 text-sm line-clamp-2">{doctor.bio}</p>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div>
                    <span className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</span>
                    <span className="text-sm text-gray-600 ml-1">/ consultation</span>
                </div>
                <Link
                    to={`/doctors/${doctor.id}`}
                    className="btn-primary text-sm px-4 py-2"
                >
                    Book Now
                </Link>
            </div>
        </div>
    );
}
