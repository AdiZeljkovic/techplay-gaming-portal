'use client';

import { useState, useEffect } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';
import api, { getCsrfToken } from '@/lib/api';
import Image from 'next/image';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface ReviewStats {
    count: number;
    average: number;
}

interface ProductReviewsProps {
    productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { user, isAuthenticated } = useAuth();
    const { openLogin } = useAuthModal();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats>({ count: 0, average: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [userReview, setUserReview] = useState<Review | null>(null);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/products/${productId}/reviews`);
            setReviews(response.data.data);
            setStats(response.data.stats);

            // Check if user already reviewed
            if (user) {
                const existing = response.data.data.find((r: Review) => String(r.user.id) === user?.id);
                if (existing) {
                    setUserReview(existing);
                    setRating(existing.rating);
                    setComment(existing.comment || '');
                }
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            openLogin();
            return;
        }

        setSubmitting(true);
        try {
            // Get fresh CSRF token before POST
            await getCsrfToken();
            await api.post(`/products/${productId}/reviews`, { rating, comment });
            await fetchReviews();
            if (!userReview) {
                setComment('');
            }
        } catch (error) {
            console.error('Failed to submit review', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Customer Reviews
                </h2>
                <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={20}
                                className={star <= Math.round(stats.average) ? 'fill-current' : 'text-gray-600'}
                            />
                        ))}
                    </div>
                    <span className="text-white font-bold">{stats.average || 0}</span>
                    <span className="text-gray-500">({stats.count} reviews)</span>
                </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="glass-dark rounded-2xl border border-white/10 p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">
                    {userReview ? 'Update Your Review' : 'Leave a Review'}
                </h3>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 text-sm mr-2">Your Rating:</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-transform hover:scale-110"
                            >
                                <Star
                                    size={28}
                                    className={`transition-colors ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product... (optional)"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none mb-4"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                >
                    {submitting ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                    {userReview ? 'Update Review' : 'Submit Review'}
                </button>
            </form>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No reviews yet. Be the first to review this product!
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className={`glass-dark rounded-xl border p-5 ${String(review.user.id) === user?.id ? 'border-red-500/50' : 'border-white/10'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-500 to-orange-500 shrink-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {review.user.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-bold text-white">{review.user.name}</span>
                                        </div>
                                        <span className="text-gray-500 text-sm">{formatDate(review.created_at)}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={star <= review.rating ? 'fill-current' : 'text-gray-600'}
                                            />
                                        ))}
                                    </div>
                                    {review.comment && (
                                        <p className="text-gray-300">{review.comment}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
