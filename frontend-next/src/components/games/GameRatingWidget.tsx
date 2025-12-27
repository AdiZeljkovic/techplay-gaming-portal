'use client';

import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';
import api, { getCsrfToken } from '@/lib/api';

interface RatingStats {
    count: number;
    average: number;
}

interface GameRatingWidgetProps {
    gameSlug: string;
    rawgRating?: number;
    onStatsUpdate?: (stats: RatingStats) => void;
}

export default function GameRatingWidget({ gameSlug, rawgRating, onStatsUpdate }: GameRatingWidgetProps) {
    const { isAuthenticated } = useAuth();
    const { openLogin } = useAuthModal();
    const [stats, setStats] = useState<RatingStats>({ count: 0, average: 0 });
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchRatings = async () => {
        try {
            const response = await api.get(`/games/${gameSlug}/ratings`);
            setStats(response.data.stats);
            setUserRating(response.data.user_rating);
            onStatsUpdate?.(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch ratings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [gameSlug]);

    const handleRate = async (rating: number) => {
        if (!isAuthenticated) {
            openLogin();
            return;
        }

        setSubmitting(true);
        try {
            await getCsrfToken();
            const response = await api.post(`/games/${gameSlug}/ratings`, { rating });
            setStats(response.data.stats);
            setUserRating(response.data.user_rating);
            onStatsUpdate?.(response.data.stats);
        } catch (error) {
            console.error('Failed to submit rating', error);
        } finally {
            setSubmitting(false);
        }
    };

    const displayRating = stats.count > 0 ? stats.average : (rawgRating || 0);

    return (
        <div className="glass-dark rounded-xl border border-white/10 p-6">
            <h4 className="font-black uppercase text-sm mb-4 tracking-widest text-white flex items-center gap-2">
                <Star size={16} className="text-yellow-400" /> Community Rating
            </h4>

            {/* Current Rating Display */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center font-black text-2xl text-black shadow-lg">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : displayRating.toFixed(1)}
                </div>
                <div>
                    <div className="text-white font-bold">
                        {stats.count > 0 ? `${stats.count} votes` : 'No votes yet'}
                    </div>
                    {rawgRating && stats.count === 0 && (
                        <div className="text-xs text-gray-500">RAWG: {rawgRating.toFixed(1)}</div>
                    )}
                </div>
            </div>

            {/* Star Rating Input */}
            <div className="border-t border-white/10 pt-4">
                <div className="text-xs uppercase font-bold text-gray-400 mb-3">
                    {userRating ? 'Your Rating' : 'Rate This Game'}
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            disabled={submitting}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => handleRate(star)}
                            className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
                        >
                            <Star
                                size={28}
                                className={`transition-colors ${star <= (hoverRating || userRating || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                    {submitting && <Loader2 size={20} className="ml-2 animate-spin text-yellow-400" />}
                </div>
                {userRating && (
                    <div className="text-xs text-green-400 mt-2">✓ You rated this {userRating}/5</div>
                )}
                {!isAuthenticated && (
                    <button onClick={openLogin} className="text-xs text-cyan-400 hover:underline mt-2">
                        Login to rate
                    </button>
                )}
            </div>
        </div>
    );
}
