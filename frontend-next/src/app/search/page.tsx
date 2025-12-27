'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button } from '@/components/UI';
import api from '@/lib/api';
import {
    Search, Filter, X, FileText, Gamepad2, MessageSquare, BookOpen,
    Clock, ChevronRight, Star, TrendingUp, Sparkles, Loader2
} from 'lucide-react';

interface SearchResult {
    id: number;
    type: 'article' | 'game' | 'forum' | 'guide';
    title: string;
    description: string;
    url: string;
    image?: string;
    date?: string;
    score?: number;
    category?: string;
}

const typeIcons: Record<string, any> = {
    article: FileText,
    game: Gamepad2,
    forum: MessageSquare,
    guide: BookOpen
};

const typeColors: Record<string, string> = {
    article: 'bg-blue-500',
    game: 'bg-purple-500',
    forum: 'bg-green-500',
    guide: 'bg-orange-500'
};

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [popularSearches] = useState<string[]>(['GTA 6', 'RTX 5090', 'Game Pass', 'Steam Deck', 'PS5 Pro']);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }, [initialQuery]);

    const performSearch = useCallback(async (searchQuery: string, filter?: string) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setHasSearched(true);

        try {
            const response = await api.get('/search', {
                params: { q: searchQuery, type: filter }
            });
            setResults(response.data.results || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Search error:', error);
            // Mock results for demo
            setResults([
                { id: 1, type: 'article', title: `Results for "${searchQuery}"`, description: 'Sample search result', url: '/post/sample', date: 'Dec 2024' },
                { id: 2, type: 'game', title: 'Sample Game Result', description: 'Game matching your query', url: '/games/sample', score: 9.2 },
            ]);
            setTotal(2);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            performSearch(query, activeFilter || undefined);
        }
    };

    const handleFilterChange = (filter: string | null) => {
        setActiveFilter(filter);
        if (query.trim()) {
            performSearch(query, filter || undefined);
        }
    };

    const handlePopularClick = (term: string) => {
        setQuery(term);
        performSearch(term, activeFilter || undefined);
    };

    const filters = [
        { id: null, label: 'All', icon: Search },
        { id: 'article', label: 'Articles', icon: FileText },
        { id: 'game', label: 'Games', icon: Gamepad2 },
        { id: 'forum', label: 'Forum', icon: MessageSquare },
        { id: 'guide', label: 'Guides', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-body)]">
            {/* Hero Search Section */}
            <div className="bg-[var(--bg-surface)] pt-10 pb-16 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#1a202c]" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-tech-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-white font-manrope mb-4">
                            Search <span className="text-tech-red">Everything</span>
                        </h1>
                        <p className="text-gray-400 mb-8">
                            Find articles, games, forum posts, and guides across TechPlay.gg
                        </p>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative">
                                <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for games, articles, guides..."
                                    className="w-full bg-white/10 border border-white/10 text-white text-lg pl-16 pr-32 py-5 rounded-2xl focus:outline-none focus:border-tech-red focus:bg-white/15 transition-all placeholder-gray-500 font-medium"
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    disabled={loading}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </Button>
                            </div>
                        </form>

                        {/* Popular Searches */}
                        {!hasSearched && popularSearches.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6"
                            >
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
                                    <TrendingUp size={14} />
                                    <span>Popular searches</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handlePopularClick(term)}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-full text-sm font-medium transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Filters & Results */}
            <div className="container mx-auto px-4 py-10">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.id || 'all'}
                            onClick={() => handleFilterChange(filter.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter.id
                                ? 'bg-tech-red text-white shadow-[0_5px_20px_-5px_rgba(220,38,38,0.4)]'
                                : 'glass-dark text-gray-300 border border-white/10 hover:border-white/20'
                                }`}
                        >
                            <filter.icon size={16} />
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 size={48} className="text-tech-red animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Searching...</p>
                        </motion.div>
                    ) : hasSearched && results.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 glass-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                                <Search size={32} className="text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                            <p className="text-gray-500">Try different keywords or remove filters</p>
                        </motion.div>
                    ) : hasSearched ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Results header */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-gray-400">
                                    Found <span className="font-bold text-white">{total}</span> results for &quot;<span className="text-tech-red font-medium">{query}</span>&quot;
                                </p>
                            </div>

                            {/* Results grid */}
                            <div className="grid gap-4">
                                {results.map((result, idx) => {
                                    const IconComponent = typeIcons[result.type];
                                    const colorClass = typeColors[result.type];

                                    return (
                                        <motion.div
                                            key={`${result.type}-${result.id}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                href={result.url}
                                                className="flex gap-5 p-5 glass-dark rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                                            >
                                                {/* Image or Icon */}
                                                {result.image ? (
                                                    <div className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                                                        <img
                                                            src={result.image}
                                                            alt={result.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass} bg-opacity-20`}>
                                                        <IconComponent size={32} className={colorClass.replace('bg-', 'text-')} />
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge
                                                            color={result.type === 'article' ? 'blue' : result.type === 'game' ? 'purple' : result.type === 'guide' ? 'red' : 'dark'}
                                                            className="text-[9px]"
                                                        >
                                                            <IconComponent size={10} className="mr-1" />
                                                            {result.type}
                                                        </Badge>
                                                        {result.category && (
                                                            <span className="text-[10px] text-gray-500 font-medium">{result.category}</span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-tech-red transition-colors mb-1 truncate">
                                                        {result.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 line-clamp-1">{result.description}</p>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500 font-medium">
                                                        {result.date && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={10} /> {result.date}
                                                            </span>
                                                        )}
                                                        {result.score && (
                                                            <span className="flex items-center gap-1 text-yellow-400">
                                                                <Star size={10} /> {result.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <ChevronRight size={20} className="text-gray-500 group-hover:text-tech-red transition-colors self-center flex-shrink-0" />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-tech-red/20 to-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-tech-red/20">
                                <Sparkles size={40} className="text-tech-red" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Start your search</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Enter a search term above to find articles, games, forum discussions, and guides
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SearchFallback() {
    return (
        <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
            <Loader2 size={48} className="text-tech-red animate-spin" />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchFallback />}>
            <SearchContent />
        </Suspense>
    );
}
