import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Building2 } from 'lucide-react';
import { reviewService, type Review } from '../../services/reviewService';

export default function MyReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewService.getMyReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
                    <p className="text-gray-600 mt-1">Your feedback and ratings</p>
                </div>
                <Link to="/dashboard/reviews/new" className="btn-primary">
                    Write a Review
                </Link>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-6">
                        You haven't written any reviews yet. Share your experience to help others!
                    </p>
                    <Link to="/dashboard/reviews/new" className="btn-primary inline-block">
                        Write Your First Review
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Star className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Building2 className="h-4 w-4 text-gray-600" />
                                                <h3 className="font-semibold text-gray-900">
                                                    Booking #{review.bookingId}
                                                </h3>
                                            </div>
                                        </div>
                                        {renderStars(review.overallRating)}
                                    </div>
                                    <p className="text-gray-700 mb-3">{review.comment}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
