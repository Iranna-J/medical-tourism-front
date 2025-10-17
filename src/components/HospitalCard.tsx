import { MapPin, Star, Award, Bed } from 'lucide-react';
import type { Hospital } from '../types';
import { Link } from 'react-router-dom';

interface HospitalCardProps {
    hospital: Hospital;
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
    return (
        <div className="card group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {hospital.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{hospital.city}, {hospital.state}</span>
                    </div>
                </div>
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="font-semibold text-yellow-900">{hospital.rating.toFixed(1)}</span>
                </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{hospital.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {hospital.isJciAccredited && (
                    <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <Award className="h-4 w-4 mr-1" />
                        JCI Accredited
                    </span>
                )}
                {hospital.isNabhAccredited && (
                    <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <Award className="h-4 w-4 mr-1" />
                        NABH Accredited
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center text-gray-600">
                    <Bed className="h-5 w-5 mr-2" />
                    <span className="text-sm">{hospital.totalBeds} Beds</span>
                </div>
                <Link
                    to={`/hospitals/${hospital.id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}
