'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Calendar, Monitor, Clock, PlayCircle, Image as ImageIcon,
    ChevronRight, Globe, Loader2, Gamepad2, Star, ChevronLeft,
    ShoppingCart, Cpu, ExternalLink
} from 'lucide-react';
import { rawgService, RawgGame, RawgScreenshot, RawgMovie, MOCK_GAMES } from '@/lib/rawgService';
import GameRatingWidget from '@/components/games/GameRatingWidget';

type TabType = 'overview' | 'media' | 'stores';

export default function GameDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [game, setGame] = useState<RawgGame | null>(null);
    const [screenshots, setScreenshots] = useState<RawgScreenshot[]>([]);
    const [trailers, setTrailers] = useState<RawgMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [communityStats, setCommunityStats] = useState<{ count: number; average: number } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            setLoading(true);

            try {
                const [detailsData, screensData, moviesData] = await Promise.all([
                    rawgService.getGameDetails(slug),
                    rawgService.getGameScreenshots(slug),
                    rawgService.getGameTrailers(slug)
                ]);

                setGame(detailsData);
                setScreenshots(screensData.results || []);
                setTrailers(moviesData.results || []);
            } catch (error) {
                console.warn('RAWG API failed, using mock data:', error);
                // Fallback to mock data
                const mockGame = MOCK_GAMES.find(g => g.slug === slug);
                if (mockGame) {
                    setGame(mockGame);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const getMetacriticColor = (score?: number) => {
        if (!score) return 'bg-gray-600';
        if (score >= 90) return 'bg-green-500';
        if (score >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
                <Loader2 size={48} className="text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
                <div className="text-center">
                    <Gamepad2 size={64} className="mx-auto mb-4 text-gray-700" />
                    <h1 className="text-2xl font-bold text-white mb-2">Game not found</h1>
                    <Link href="/games" className="text-cyan-400 hover:underline">Back to Database</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* Cinematic Hero */}
            <div className="relative h-[500px] lg:h-[600px] overflow-hidden bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/80 to-transparent z-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/50 to-transparent z-20" />
                {game.background_image && (
                    <Image
                        src={game.background_image}
                        alt={game.name}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 lg:p-12 z-30">
                    <div className="container mx-auto">
                        {/* Back Link */}
                        <Link href="/games" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-6 py-2 px-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40">
                            <ChevronLeft size={14} /> Back to Database
                        </Link>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                            <div className="lg:col-span-8">
                                {/* Genres */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {game.genres?.map(g => (
                                        <span key={g.id} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold rounded-full">
                                            {g.name}
                                        </span>
                                    ))}
                                    {game.released && (
                                        <span className="px-3 py-1 bg-white/10 text-gray-300 border border-white/20 text-xs font-bold rounded-full">
                                            {game.released.split('-')[0]}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
                                    {game.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-300">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} className="text-cyan-400" /> {game.released}
                                    </span>
                                    {game.developers && game.developers.length > 0 && (
                                        <span className="flex items-center gap-2">
                                            <Monitor size={16} className="text-cyan-400" /> {game.developers[0].name}
                                        </span>
                                    )}
                                    {game.playtime && game.playtime > 0 && (
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} className="text-cyan-400" /> ~{game.playtime} Hours
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Scores */}
                            <div className="lg:col-span-4 flex justify-start lg:justify-end gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                                            {communityStats && communityStats.count > 0 ? 'Community' : 'User'}
                                        </div>
                                        <div className="text-xs font-bold text-gray-500">Rating</div>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center font-black text-2xl text-black shadow-2xl border-2 border-white/20">
                                        {communityStats && communityStats.count > 0
                                            ? communityStats.average.toFixed(1)
                                            : (game.rating?.toFixed(1) || '-')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs font-black uppercase tracking-widest text-gray-400">Metascore</div>
                                        <div className="text-xs font-bold text-gray-500">Critic</div>
                                    </div>
                                    <div className={`w-16 h-16 rounded-2xl ${getMetacriticColor(game.metacritic)} flex items-center justify-center font-black text-2xl text-white shadow-2xl border-2 border-white/20`}>
                                        {game.metacritic || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="glass-dark border-b border-white/10 sticky top-[72px] z-40 shadow-sm">
                <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
                    {['overview', 'media', 'stores'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as TabType)}
                            className={`py-5 text-xs font-black uppercase tracking-widest border-b-4 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-cyan-500 text-cyan-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-12">
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            {/* About */}
                            <section className="glass-dark p-8 rounded-2xl border border-white/10">
                                <h3 className="text-2xl font-black text-white mb-6">About The Game</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-300 leading-relaxed text-lg"
                                    dangerouslySetInnerHTML={{ __html: game.description || game.description_raw || 'No description available.' }}
                                />
                            </section>

                            {/* Tags */}
                            {game.tags && game.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {game.tags.slice(0, 10).map(tag => (
                                        <span key={tag.id} className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* System Requirements */}
                            {game.platforms?.find(p => p.platform.slug === 'pc')?.requirements_en && (
                                <section className="glass-dark p-8 rounded-2xl border border-white/10">
                                    <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-2">
                                        <Cpu size={24} /> System Requirements
                                    </h3>
                                    <div className="space-y-6">
                                        {game.platforms.find(p => p.platform.slug === 'pc')?.requirements_en?.minimum && (
                                            <div>
                                                <h4 className="font-black uppercase text-xs tracking-widest mb-4 text-cyan-400 border-b border-white/10 pb-2">
                                                    Minimum / Recommended
                                                </h4>
                                                <div className="text-sm whitespace-pre-line leading-relaxed font-mono p-4 rounded-lg bg-black/40 text-gray-400 border border-[var(--border-subtle)]">
                                                    {game.platforms.find(p => p.platform.slug === 'pc')?.requirements_en?.minimum}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'media' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Trailers */}
                            {trailers.map(trailer => (
                                <div
                                    key={trailer.id}
                                    className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer bg-black border border-white/10"
                                    onClick={() => setSelectedMedia(trailer.data[480])}
                                >
                                    <Image src={trailer.preview} alt={trailer.name} fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform">
                                            <PlayCircle size={24} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 text-white text-xs font-bold">{trailer.name}</div>
                                </div>
                            ))}

                            {/* Screenshots */}
                            {screenshots.map(screen => (
                                <div
                                    key={screen.id}
                                    className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer border border-white/10"
                                    onClick={() => setSelectedMedia(screen.image)}
                                >
                                    <Image src={screen.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ImageIcon size={16} />
                                    </div>
                                </div>
                            ))}

                            {screenshots.length === 0 && trailers.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-gray-500">
                                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No media available for this game.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'stores' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {game.stores?.map(s => (
                                <a
                                    href={`https://${s.store.domain}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={s.store.id}
                                    className="flex items-center justify-between p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all group glass-dark"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                            <ShoppingCart size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{s.store.name}</h4>
                                            <span className="text-xs font-mono text-gray-500">{s.store.domain}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-widest text-cyan-400">
                                        Buy Now <ExternalLink size={14} />
                                    </div>
                                </a>
                            ))}

                            {(!game.stores || game.stores.length === 0) && (
                                <div className="text-center py-12 text-gray-500">
                                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No store links available for this game.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Right Sidebar */}
                <aside className="space-y-8">
                    {/* Rating Widget */}
                    <GameRatingWidget
                        gameSlug={slug}
                        rawgRating={game.rating}
                        onStatsUpdate={setCommunityStats}
                    />

                    {/* Info Card */}
                    <div className="glass-dark rounded-xl border border-white/10 p-6">
                        <h4 className="font-black uppercase text-sm mb-6 tracking-widest text-white flex items-center gap-2">
                            <Globe size={16} /> Information
                        </h4>
                        <div className="space-y-4">
                            {game.website && (
                                <div>
                                    <div className="text-xs font-bold uppercase mb-1 text-gray-500">Official Website</div>
                                    <a href={game.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-cyan-400 hover:underline truncate block">
                                        {game.website}
                                    </a>
                                </div>
                            )}
                            {game.publishers && game.publishers.length > 0 && (
                                <div>
                                    <div className="text-xs font-bold uppercase mb-1 text-gray-500">Publisher</div>
                                    <div className="text-sm font-bold text-white">{game.publishers[0].name}</div>
                                </div>
                            )}
                            {game.esrb_rating && (
                                <div>
                                    <div className="text-xs font-bold uppercase mb-1 text-gray-500">ESRB Rating</div>
                                    <div className="text-sm font-bold text-white">{game.esrb_rating.name}</div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Platforms */}
                    {game.parent_platforms && game.parent_platforms.length > 0 && (
                        <div className="glass-dark rounded-xl border border-white/10 p-6">
                            <h4 className="font-black uppercase text-sm mb-4 tracking-widest text-white">Platforms</h4>
                            <div className="flex flex-wrap gap-2">
                                {game.parent_platforms.map(p => (
                                    <span key={p.platform.id} className="px-3 py-1.5 bg-white/5 text-gray-300 border border-white/10 text-xs font-bold rounded-lg">
                                        {p.platform.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Media Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedMedia(null)}
                >
                    <button className="absolute top-4 right-4 text-white hover:text-cyan-400">
                        <ChevronRight size={32} className="rotate-45" />
                    </button>
                    {selectedMedia.includes('mp4') ? (
                        <video src={selectedMedia} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
                    ) : (
                        <Image src={selectedMedia} alt="" width={1920} height={1080} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" />
                    )}
                </div>
            )}
        </div>
    );
}
