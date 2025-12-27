'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Calendar, Monitor, Clock, PlayCircle, Image as ImageIcon,
    ChevronLeft, Globe, Loader2, Gamepad2, Timer, ExternalLink,
    Share2, Bell
} from 'lucide-react';
import { rawgService, RawgGame, RawgScreenshot, RawgMovie, MOCK_GAMES } from '@/lib/rawgService';

export default function UpcomingGamePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [game, setGame] = useState<RawgGame | null>(null);
    const [screenshots, setScreenshots] = useState<RawgScreenshot[]>([]);
    const [trailers, setTrailers] = useState<RawgMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

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
                console.warn('RAWG API failed, loading mock data', error);
                const mockGame = MOCK_GAMES.find(g => g.slug === slug);
                if (mockGame) setGame(mockGame);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Countdown Logic
    useEffect(() => {
        if (!game || !game.released) return;

        const releaseDate = new Date(game.released).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = releaseDate - now;

            if (distance < 0) {
                setTimeRemaining(null);
                clearInterval(timer);
            } else {
                setTimeRemaining({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [game]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
                <Loader2 size={48} className="text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center flex-col gap-4">
                <Gamepad2 size={64} className="text-gray-700" />
                <h1 className="text-2xl font-black text-white">Game Not Found</h1>
                <Link href="/calendar" className="text-purple-400 hover:text-purple-300 font-bold hover:underline">
                    Back to Calendar
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#0f0b15] min-h-screen text-white font-sans selection:bg-purple-500/30">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0">
                {game.background_image && (
                    <Image
                        src={game.background_image}
                        alt="Background"
                        fill
                        className="object-cover opacity-30 blur-sm scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b15] via-[#0f0b15]/80 to-purple-900/10" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
                {/* Header / Nav */}
                <header className="flex items-center justify-between mb-12">
                    <Link
                        href="/calendar"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10"
                    >
                        <ChevronLeft size={16} /> Calendar
                    </Link>
                    <div className="flex gap-2">
                        {game.parent_platforms?.map(p => (
                            <div key={p.platform.id} className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-gray-400 border border-white/5" title={p.platform.name}>
                                {p.platform.name === 'PC' && <Monitor size={14} />}
                                {p.platform.name === 'PlayStation' && <Gamepad2 size={14} />}
                                {p.platform.name === 'Xbox' && <Gamepad2 size={14} />}
                                {p.platform.name === 'Nintendo' && <Gamepad2 size={14} />}
                                {!['PC', 'PlayStation', 'Xbox', 'Nintendo'].includes(p.platform.name) && <Gamepad2 size={14} />}
                            </div>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* Main Info Column */}
                    <div className="lg:col-span-7 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Release Date Badge */}
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 text-purple-300 font-bold uppercase tracking-widest text-xs mb-8 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]">
                                <Calendar size={14} className="text-purple-400" />
                                {new Date(game.released).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>

                            {/* Title */}
                            <h1 className="text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 leading-tight mb-8">
                                {game.name}
                            </h1>

                            {/* Countdown Timer */}
                            {timeRemaining ? (
                                <div className="grid grid-cols-4 gap-4 max-w-2xl mb-12">
                                    {[
                                        { label: 'Days', value: timeRemaining.days },
                                        { label: 'Hours', value: timeRemaining.hours },
                                        { label: 'Minutes', value: timeRemaining.minutes },
                                        { label: 'Seconds', value: timeRemaining.seconds }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-4 text-center group hover:border-purple-500/50 transition-colors">
                                            <div className="text-3xl lg:text-5xl font-black text-white mb-1 font-mono tracking-tighter group-hover:text-purple-400 transition-colors">
                                                {String(item.value).padStart(2, '0')}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="max-w-2xl mb-12 p-8 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                                        <Timer className="text-white" />
                                    </div>
                                    <div className="text-xl font-bold text-white">Released! Available Now.</div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4">
                                {game.website && (
                                    <a
                                        href={game.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="h-14 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-purple-600/20"
                                    >
                                        Official Website <ExternalLink size={16} />
                                    </a>
                                )}

                            </div>
                        </motion.div>

                        {/* Description */}
                        <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-400 prose-headings:font-black prose-headings:uppercase prose-headings:text-white pl-4 border-l-2 border-purple-500/30">
                            <div dangerouslySetInnerHTML={{ __html: game.description || game.description_raw || '' }} />
                        </div>
                    </div>

                    {/* Media Sidebar */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Featured Trailer */}
                        {trailers.length > 0 && (
                            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 bg-black relative group cursor-pointer" onClick={() => setSelectedMedia(trailers[0].data[480])}>
                                <div className="aspect-video relative">
                                    <Image src={trailers[0].preview} alt="Trailer" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white pl-1 shadow-[0_0_30px_rgba(147,51,234,0.5)] group-hover:scale-110 transition-transform">
                                            <PlayCircle size={40} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 backdrop-blur">
                                    <h3 className="font-bold text-white mb-1 line-clamp-1">{trailers[0].name}</h3>
                                    <div className="text-xs text-purple-400 font-black uppercase tracking-widest">Watch Trailer</div>
                                </div>
                            </div>
                        )}

                        {/* Screenshot Grid */}
                        {screenshots.length > 0 && (
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <ImageIcon size={14} /> Gallery
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {screenshots.slice(0, 4).map((screen, i) => (
                                        <div
                                            key={screen.id}
                                            className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer border border-white/10"
                                            onClick={() => setSelectedMedia(screen.image)}
                                        >
                                            <Image src={screen.image} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Developer Info */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-4">Development</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Developer</div>
                                    <div className="font-bold text-white text-lg">{game.developers?.[0]?.name || 'Unknown'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">Publisher</div>
                                    <div className="font-bold text-white text-lg">{game.publishers?.[0]?.name || 'Unknown'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
                    onClick={() => setSelectedMedia(null)}
                >
                    <button className="absolute top-8 right-8 text-white hover:text-purple-400 transition-colors">
                        <ChevronLeft size={48} className="rotate-45" />
                    </button>
                    {selectedMedia.includes('mp4') ? (
                        <video src={selectedMedia} controls autoPlay className="max-w-full max-h-[85vh] rounded-xl shadow-[0_0_50px_rgba(147,51,234,0.3)] border border-purple-500/30" />
                    ) : (
                        <Image src={selectedMedia} alt="" width={1920} height={1080} className="max-w-full max-h-[85vh] rounded-xl shadow-[0_0_50px_rgba(147,51,234,0.3)] object-contain border border-purple-500/30" />
                    )}
                </div>
            )}
        </div>
    );
}
