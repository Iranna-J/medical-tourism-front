import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import { hospitalService } from '../services/hospitalService';
import type { Hospital } from '../types';
import toast from 'react-hot-toast';

export default function Hospitals() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchHospitals();
    }, [page]);

    const fetchHospitals = async () => {
        try {
            setLoading(true);
            const response = await hospitalService.getActive(page, 12);
            setHospitals(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error('Failed to load hospitals');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="section-title">Find World-Class Hospitals</h1>
                    <p className="section-subtitle">
                        Browse through our network of accredited hospitals
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search hospitals by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <button className="btn-outline flex items-center justify-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Hospitals Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-gray-600">Loading hospitals...</p>
                    </div>
                ) : hospitals.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No hospitals found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hospitals.map((hospital) => (
                                <HospitalCard key={hospital.id} hospital={hospital} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 space-x-2">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="btn-outline px-4 py-2 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-700">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page === totalPages - 1}
                                    className="btn-outline px-4 py-2 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
