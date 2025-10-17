import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Search as SearchIcon, MapPin, Star,
    Building2, User, Activity, DollarSign
} from 'lucide-react';
import { searchService } from '../services/searchService';
import type { SearchResultItem } from '../services/searchService';
import toast from 'react-hot-toast';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'hospitals' | 'doctors' | 'treatments'>('all');

    // Filters
    const [minRating, setMinRating] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [selectedLocation, setSelectedLocation] = useState<string>('');

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
            performSearch(q);
        }
    }, [searchParams]);

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            const response = await searchService.searchAll(searchQuery);
            setResults(response.results);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to perform search');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setSearchParams({ q: query });
            performSearch(query);
        }
    };

    const filteredResults = () => {
        let filtered = results;

        // Filter by tab
        if (activeTab !== 'all') {
            filtered = filtered.filter(r => {
                if (activeTab === 'hospitals') return r.type === 'HOSPITAL';
                if (activeTab === 'doctors') return r.type === 'DOCTOR';
                if (activeTab === 'treatments') return r.type === 'TREATMENT';
                return true;
            });
        }

        // Filter by rating
        if (minRating > 0) {
            filtered = filtered.filter(r => (r.rating || 0) >= minRating);
        }

        // Filter by price
        if (maxPrice > 0) {
            filtered = filtered.filter(r => !r.price || r.price <= maxPrice);
        }

        // Filter by location
        if (selectedLocation) {
            filtered = filtered.filter(r =>
                r.location?.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        return filtered;
    };

    const displayedResults = filteredResults();
    const hospitalCount = results.filter(r => r.type === 'HOSPITAL').length;
    const doctorCount = results.filter(r => r.type === 'DOCTOR').length;
    const treatmentCount = results.filter(r => r.type === 'TREATMENT').length;

    const getResultLink = (result: SearchResultItem) => {
        switch (result.type) {
            case 'HOSPITAL':
                return `/hospitals/${result.id}`;
            case 'DOCTOR':
                return `/doctors/${result.id}`;
            case 'TREATMENT':
                return `/treatments/${result.id}`;
            default:
                return '#';
        }
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'HOSPITAL':
                return <Building2 className="h-5 w-5 text-sky-600" />;
            case 'DOCTOR':
                return <User className="h-5 w-5 text-purple-600" />;
            case 'TREATMENT':
                return <Activity className="h-5 w-5 text-green-600" />;
            default:
                return null;
        }
    };

    const clearFilters = () => {
        setMinRating(0);
        setMaxPrice(0);
        setSelectedLocation('');
    };

    const hasActiveFilters = minRating > 0 || maxPrice > 0 || selectedLocation !== '';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <div className="bg-gradient-to-r from-sky-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">Search Medical Services</h1>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-3xl">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search hospitals, doctors, treatments..."
                                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">Filters</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-sky-600 hover:text-sky-700"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Rating Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={minRating}
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="0">Any Rating</option>
                                        <option value="3">3+ Stars</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                    </select>
                                </div>

                                {/* Price Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Price
                                    </label>
                                    <input
                                        type="number"
                                        value={maxPrice || ''}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        placeholder="Any price"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        placeholder="City or state"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="flex border-b overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'all'
                                        ? 'border-b-2 border-sky-500 text-sky-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    All Results ({results.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('hospitals')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'hospitals'
                                        ? 'border-b-2 border-sky-500 text-sky-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Hospitals ({hospitalCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('doctors')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'doctors'
                                        ? 'border-b-2 border-sky-500 text-sky-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Doctors ({doctorCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('treatments')}
                                    className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'treatments'
                                        ? 'border-b-2 border-sky-500 text-sky-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Treatments ({treatmentCount})
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        {query && (
                            <div className="mb-4">
                                <p className="text-gray-600">
                                    {loading ? (
                                        'Searching...'
                                    ) : (
                                        <>
                                            Found <span className="font-semibold">{displayedResults.length}</span> results
                                            {query && <> for "<span className="font-semibold">{query}</span>"</>}
                                        </>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1">
                                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : displayedResults.length > 0 ? (
                            /* Results List */
                            <div className="space-y-4">
                                {displayedResults.map((result) => (
                                    <Link
                                        key={`${result.type}-${result.id}`}
                                        to={getResultLink(result)}
                                        className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                                    >
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    {getResultIcon(result.type)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 hover:text-sky-600">
                                                            {result.name}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                                {result.type}
                                                            </span>
                                                            {result.specialty && (
                                                                <span className="flex items-center gap-1">
                                                                    <Activity className="h-4 w-4" />
                                                                    {result.specialty}
                                                                </span>
                                                            )}
                                                            {result.location && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    {result.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Rating & Price */}
                                                    <div className="flex flex-col items-end gap-2">
                                                        {result.rating && (
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="font-semibold">{result.rating.toFixed(1)}</span>
                                                                {result.reviewCount && result.reviewCount > 0 && (
                                                                    <span className="text-sm text-gray-500">
                                                                        ({result.reviewCount})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {result.price && (
                                                            <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                                                <DollarSign className="h-4 w-4" />
                                                                {result.price.toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {result.description && (
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {result.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : query ? (
                            /* No Results */
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
                                <p className="text-gray-600 mb-6">
                                    We couldn't find any results for "{query}". Try different keywords or adjust your filters.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* Initial State */
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Search</h3>
                                <p className="text-gray-600">
                                    Search for hospitals, doctors, or treatments to get started
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
