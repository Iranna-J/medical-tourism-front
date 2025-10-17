import { DollarSign, Clock, TrendingUp, Activity } from 'lucide-react';
import type { Treatment } from '../types';
import { Link } from 'react-router-dom';

interface TreatmentCardProps {
    treatment: Treatment;
}

export default function TreatmentCard({ treatment }: TreatmentCardProps) {
    return (
        <Link to={`/treatments/${treatment.id}`}>
            <div className="card group cursor-pointer h-full">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                        {treatment.name}
                    </h3>
                    {treatment.successRate && (
                        <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-sm font-semibold text-green-900">
                                {treatment.successRate}%
                            </span>
                        </div>
                    )}
                </div>

                {treatment.specialization && (
                    <div className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <Activity className="h-4 w-4 mr-1" />
                        {treatment.specialization.name}
                    </div>
                )}

                <p className="text-gray-600 mb-4 line-clamp-3">{treatment.description}</p>

                <div className="space-y-2 mb-4">
                    {treatment.durationDays && (
                        <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">{treatment.durationDays} days duration</span>
                        </div>
                    )}
                    <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                            ${treatment.costEstimateMin?.toLocaleString()} - ${treatment.costEstimateMax?.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <span className="text-sky-600 hover:text-sky-700 font-semibold group-hover:underline">
                        View Details →
                    </span>
                </div>
            </div>
        </Link>
    );
}
