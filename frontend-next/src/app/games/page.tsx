'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Grid, Star, Clock, Monitor, Gamepad2,
    ChevronDown, AlertCircle, Loader2, Tag, ShoppingCart, Image as ImageIcon
} from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { rawgService, RawgGame, MOCK_GAMES } from '@/lib/rawgService';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';

// Platform configuration
const platforms = [
    { name: 'PC', id: '1', color: 'bg-blue-500' },
    { name: 'PlayStation', id: '2', color: 'bg-indigo-500' },
    { name: 'Xbox', id: '3', color: 'bg-green-500' },
    { name: 'Nintendo', id: '7', color: 'bg-red-500' },
];

// Sort options
const sortOptions = [
    { label: 'Popularity', value: '-added' },
    { label: 'Highest Rated', value: '-metacritic' },
    { label: 'Newest', value: '-released' },
];

export default function GamesDatabasePage() {
    const [games, setGames] = useState<RawgGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [platform, setPlatform] = useState('');
    const [ordering, setOrdering] = useState('-metacritic');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isSortOpen, setIsSortOpen] = useState(false);


    const { isAuthenticated } = useAuth();
    const { openLogin } = useAuthModal();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch games
    const fetchGames = async (reset = false) => {
        // Search Limit check for guests
        if (!isAuthenticated && debouncedSearch && reset) {
            const searchCount = parseInt(localStorage.getItem('guest_search_count') || '0');
            console.log('Search attempt:', searchCount + 1);

            if (searchCount >= 2) {
                // Show popup on 3rd attempt (after 2 allowed)
                openLogin();
                // Reset search query to prevent loop if we just return
                // But we want to keep the input, maybe just stop the fetch
                setLoading(false);
                return;
            }

            localStorage.setItem('guest_search_count', (searchCount + 1).toString());
        }

        try {
            setLoading(true);
            setError('');

            const currentPage = reset ? 1 : page;

            try {
                const data = await rawgService.getGames({
                    page: currentPage,
                    page_size: 20,
                    search: debouncedSearch || undefined,
                    parent_platforms: platform || undefined,
                    ordering: ordering,
                });

                if (reset) {
                    setGames(data.results);
                } else {
                    setGames(prev => [...prev, ...data.results]);
                }

                setHasMore(!!data.next);
                if (!reset) setPage(currentPage + 1);
                else setPage(2);
            } catch (apiError) {
                // Fallback to mock data if API fails
                console.warn('RAWG API failed, using mock data:', apiError);
                setGames(MOCK_GAMES);
                setHasMore(false);
            }

        } catch (err) {
            console.error(err);
            setError('Failed to load games. Using demo data.');
            setGames(MOCK_GAMES);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on filter change
    useEffect(() => {
        fetchGames(true);
    }, [platform, ordering, debouncedSearch]);

    const handleLoadMore = () => {
        fetchGames(false);
    };

    const getMetacriticColor = (score?: number) => {
        if (!score) return 'bg-gray-600';
        if (score >= 90) return 'bg-green-500';
        if (score >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* PageHero */}
            <PageHero
                icon={Gamepad2}
                iconColor="text-cyan-400"
                title="The "
                titleAccent="Database"
                accentGradient="from-cyan-400 to-blue-500"
                description="Access over 350,000 games. Real-time data, ratings, and system specs."
            />

            <div className="container mx-auto px-4 py-12">
                {/* Platform Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ y: -5 }}
                        onClick={() => setPlatform('')}
                        className={`group flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${platform === '' ? 'bg-cyan-500 text-white border-cyan-500 shadow-[0_5px_20px_-5px_rgba(6,182,212,0.4)]' : 'glass-dark text-white border-[var(--border-subtle)] hover:border-white/20'}`}
                    >
                        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Gamepad2 size={16} className="text-white" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">All</span>
                    </motion.button>
                    {platforms.map((p) => (
                        <motion.button
                            key={p.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setPlatform(p.id)}
                            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${platform === p.id ? 'bg-cyan-500 text-white border-cyan-500 shadow-[0_5px_20px_-5px_rgba(6,182,212,0.4)]' : 'glass-dark text-white border-[var(--border-subtle)] hover:border-white/20'}`}
                        >
                            <div className={`w-8 h-8 ${p.color} bg-opacity-20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <Monitor size={16} className="text-white" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest">{p.name}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Search Bar & Sort */}
                <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search titles (e.g. Witcher 3)..."
                            className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500 transition-all placeholder-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative shrink-0">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 bg-black/20 border border-white/10 px-6 py-3 rounded-xl text-sm font-bold text-white uppercase tracking-wider hover:border-cyan-500 hover:text-cyan-400 transition-colors w-full md:w-auto justify-between"
                        >
                            {sortOptions.find(s => s.value === ordering)?.label || 'Sort'}
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-full md:w-48 bg-[var(--bg-body)] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-xl"
                                >
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setOrdering(opt.value); setIsSortOpen(false); }}
                                            className="block w-full text-left px-5 py-3 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-cyan-400 border-b border-[var(--border-subtle)] last:border-b-0 uppercase tracking-wider"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 text-red-400 p-4 rounded-xl border border-red-500/30 flex items-center gap-3 mb-6 max-w-4xl mx-auto">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold text-gray-500">
                        {games.length > 0 ? `Showing ${games.length} games` : 'No results found'}
                    </div>
                </div>

                {/* Game Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map(game => (
                        <Link
                            href={`/games/${game.slug}`}
                            key={game.id}
                            className="glass-dark rounded-xl overflow-hidden shadow-lg border border-[var(--border-subtle)] group hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="aspect-[16/9] relative overflow-hidden bg-gray-900">
                                {game.background_image ? (
                                    <Image
                                        src={game.background_image}
                                        alt={game.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <ImageIcon size={32} />
                                    </div>
                                )}

                                {/* Metacritic Badge */}
                                <div className="absolute top-2 right-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-lg ${getMetacriticColor(game.metacritic)}`}>
                                        {game.metacritic || '-'}
                                    </div>
                                </div>

                                {/* ESRB Badge */}
                                {game.esrb_rating && (
                                    <div className="absolute top-2 left-2">
                                        <div className="bg-black/80 backdrop-blur border border-white/10 text-[10px] font-black text-gray-300 px-1.5 py-0.5 rounded">
                                            {game.esrb_rating.name}
                                        </div>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between items-end">
                                        <span className="text-white text-xs font-bold">{game.released}</span>
                                        {game.playtime && game.playtime > 0 && (
                                            <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                                                <Clock size={12} /> {game.playtime}h
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-wrap gap-1">
                                        {game.parent_platforms?.slice(0, 3).map(p => (
                                            <span key={p.platform.id} className="text-[9px] px-1.5 py-0.5 border border-white/20 text-gray-400 rounded">
                                                {p.platform.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-xs font-bold text-white">{game.rating}</span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-white mb-3 group-hover:text-cyan-400 transition-colors font-manrope leading-tight line-clamp-1" title={game.name}>
                                    {game.name}
                                </h3>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {game.tags?.slice(0, 3).map(tag => (
                                        <span key={tag.id} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-[var(--border-subtle)]">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                    {/* Stores */}
                                    <div className="flex items-center gap-2">
                                        {game.stores?.slice(0, 3).map(s => (
                                            <div key={s.store.id} className="text-gray-500 hover:text-cyan-400 transition-colors" title={s.store.name}>
                                                <ShoppingCart size={14} />
                                            </div>
                                        ))}
                                        {game.stores && game.stores.length > 3 && (
                                            <span className="text-[10px] text-gray-600">+{game.stores.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Loading Skeletons */}
                    {loading && Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="glass-dark rounded-xl overflow-hidden border border-[var(--border-subtle)] h-80 animate-pulse">
                            <div className="h-48 bg-white/5" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-white/10 rounded w-1/2" />
                                <div className="h-6 bg-white/10 rounded w-3/4" />
                                <div className="h-4 bg-white/10 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {hasMore && !loading && games.length > 0 && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-12 py-4 bg-cyan-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-cyan-600 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        >
                            Load More Games
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && games.length === 0 && (
                    <div className="text-center py-20">
                        <Gamepad2 size={64} className="mx-auto mb-4 text-gray-700" />
                        <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
