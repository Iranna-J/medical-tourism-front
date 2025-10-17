import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Send, Building2, User, Activity } from 'lucide-react';
import { reviewService, type ReviewRequest } from '../../services/reviewService';
import { bookingService, type Booking } from '../../services/bookingService';
import toast from 'react-hot-toast';

export default function SubmitReview() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<ReviewRequest>({
        bookingId: 0,
        hospitalRating: 0,
        doctorRating: 0,
        treatmentRating: 0,
        comment: '',
        wouldRecommend: true,
    });

    useEffect(() => {
        if (bookingId) {
            loadBooking(parseInt(bookingId));
        }
    }, [bookingId]);

    const loadBooking = async (id: number) => {
        try {
            setLoading(true);
            const data = await bookingService.getBookingById(id);
            setBooking(data);
            setFormData(prev => ({ ...prev, bookingId: id }));
        } catch (error) {
            console.error('Error loading booking:', error);
            toast.error('Failed to load booking information');
            navigate('/dashboard/bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (field: 'hospitalRating' | 'doctorRating' | 'treatmentRating', rating: number) => {
        setFormData(prev => ({ ...prev, [field]: rating }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.hospitalRating === 0 || formData.doctorRating === 0 || formData.treatmentRating === 0) {
            toast.error('Please provide all ratings');
            return;
        }

        if (!formData.comment.trim()) {
            toast.error('Please provide a comment');
            return;
        }

        try {
            setSubmitting(true);
            await reviewService.submitReview(formData);
            toast.success('Review submitted successfully!');
            navigate('/dashboard/bookings');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRatingChange(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`h-8 w-8 ${star <= rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Booking not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard/bookings')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Submit Review</h1>
                    <p className="text-gray-600 mt-1">Share your experience with us</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Review Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Info */}
                        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-6 border border-sky-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">Treatment Details</h2>
                            <div className="space-y-2">
                                <p className="text-gray-900 font-medium">{booking.treatmentType}</p>
                                <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                            </div>
                        </div>

                        {/* Hospital Rating */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-sky-600" />
                                Hospital Rating
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                How would you rate the hospital facilities and services?
                            </p>
                            <StarRating
                                rating={formData.hospitalRating}
                                onRatingChange={(rating) => handleRatingChange('hospitalRating', rating)}
                            />
                        </div>

                        {/* Doctor Rating */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-purple-600" />
                                Doctor Rating
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                How would you rate your doctor's expertise and care?
                            </p>
                            <StarRating
                                rating={formData.doctorRating}
                                onRatingChange={(rating) => handleRatingChange('doctorRating', rating)}
                            />
                        </div>

                        {/* Treatment Rating */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-600" />
                                Treatment Rating
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                How satisfied are you with the treatment outcome?
                            </p>
                            <StarRating
                                rating={formData.treatmentRating}
                                onRatingChange={(rating) => handleRatingChange('treatmentRating', rating)}
                            />
                        </div>

                        {/* Comment */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Review</h2>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                rows={6}
                                placeholder="Share your experience in detail. Your feedback helps other patients make informed decisions..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                required
                            />
                        </div>

                        {/* Recommendation */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Would you recommend this?</h2>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.wouldRecommend === true}
                                        onChange={() => setFormData(prev => ({ ...prev, wouldRecommend: true }))}
                                        className="w-4 h-4 text-sky-600"
                                    />
                                    <span className="text-gray-900">Yes, I would recommend</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.wouldRecommend === false}
                                        onChange={() => setFormData(prev => ({ ...prev, wouldRecommend: false }))}
                                        className="w-4 h-4 text-sky-600"
                                    />
                                    <span className="text-gray-900">No, I would not recommend</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Rating Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Rating Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Hospital</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-gray-900">
                                            {formData.hospitalRating || '-'}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Doctor</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-gray-900">
                                            {formData.doctorRating || '-'}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Treatment</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium text-gray-900">
                                            {formData.treatmentRating || '-'}/5
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Overall</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-lg font-bold text-gray-900">
                                                {formData.hospitalRating && formData.doctorRating && formData.treatmentRating
                                                    ? ((formData.hospitalRating + formData.doctorRating + formData.treatmentRating) / 3).toFixed(1)
                                                    : '-'}/5
                                            </span>
                                        </div>
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
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>

                        {/* Help */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-2">Review Guidelines</h3>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li>• Be honest and specific</li>
                                <li>• Focus on your experience</li>
                                <li>• Avoid personal information</li>
                                <li>• Be respectful and constructive</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
