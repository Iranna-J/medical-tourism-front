import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Activity } from 'lucide-react';
import { treatmentService } from '../services/treatmentService';
import TreatmentCard from '../components/TreatmentCard';
import type { Treatment } from '../types';
import toast from 'react-hot-toast';

export default function Treatments() {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'cost' | 'duration' | 'success'>('name');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const categories = [
        'All Treatments',
        'Cardiology',
        'Orthopedics',
        'Oncology',
        'Neurology',
        'Gastroenterology',
        'Cosmetic Surgery',
        'Dental',
        'Eye Care',
    ];

    useEffect(() => {
        loadTreatments();
    }, [currentPage]);

    const loadTreatments = async () => {
        try {
            setLoading(true);
            const response = await treatmentService.getAll(currentPage, 12);
            setTreatments(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error loading treatments:', error);
            toast.error('Failed to load treatments');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadTreatments();
            return;
        }

        try {
            setLoading(true);
            const response = await treatmentService.searchByName(searchQuery, currentPage, 12);
            setTreatments(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error searching treatments:', error);
            toast.error('Failed to search treatments');
        } finally {
            setLoading(false);
        }
    };

    const filteredAndSortedTreatments = () => {
        let filtered = [...treatments];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(
                (t) => t.specialization?.name.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'cost':
                    return (a.costEstimateMin || 0) - (b.costEstimateMin || 0);
                case 'duration':
                    return (a.durationDays || 0) - (b.durationDays || 0);
                case 'success':
                    return (b.successRate || 0) - (a.successRate || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const displayedTreatments = filteredAndSortedTreatments();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Medical Treatments</h1>
                    <p className="text-xl text-white/90 max-w-2xl">
                        Explore our comprehensive range of medical treatments and procedures
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Search */}
                        <div className="md:col-span-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search treatments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="md:col-span-3">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.slice(1).map((category) => (
                                        <option key={category} value={category.toLowerCase()}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="md:col-span-3">
                            <div className="relative">
                                <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="cost">Sort by Cost</option>
                                    <option value="duration">Sort by Duration</option>
                                    <option value="success">Sort by Success Rate</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedCategory !== 'all') && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {searchQuery && (
                                <span className="inline-flex items-center px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
                                    Search: {searchQuery}
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            loadTreatments();
                                        }}
                                        className="ml-2 hover:text-sky-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {selectedCategory !== 'all' && (
                                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    Category: {selectedCategory}
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className="ml-2 hover:text-purple-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold">{displayedTreatments.length}</span> treatments
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : displayedTreatments.length > 0 ? (
                    <>
                        {/* Treatments Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {displayedTreatments.map((treatment) => (
                                <TreatmentCard key={treatment.id} treatment={treatment} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-600">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Treatments Found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || selectedCategory !== 'all'
                                ? 'Try adjusting your filters or search query'
                                : 'No treatments available at the moment'}
                        </p>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    loadTreatments();
                                }}
                                className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
