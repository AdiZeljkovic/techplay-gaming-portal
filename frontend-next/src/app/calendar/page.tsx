'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Button, Modal } from '@/components/UI';
import { ChevronDown, Loader2, Calendar as CalendarIcon, X } from 'lucide-react';
import { rawgService, RawgGame } from '@/lib/rawgService';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/components/common/PageHero';

export default function CalendarPage() {
    const [games, setGames] = useState<RawgGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('All');

    // State for Day Detail Modal
    const [selectedDayReleases, setSelectedDayReleases] = useState<{ date: string, games: RawgGame[] } | null>(null);

    // RAWG Parent Platform IDs
    const platforms = [
        { name: 'All', id: '', color: 'bg-gray-500' },
        { name: 'PC', id: '1', color: 'bg-blue-500' },
        { name: 'PlayStation', id: '2', color: 'bg-indigo-500' },
        { name: 'Xbox', id: '3', color: 'bg-green-500' },
        { name: 'Switch', id: '7', color: 'bg-red-500' },
    ];

    const months = [
        { name: 'JAN', value: 0 }, { name: 'FEB', value: 1 }, { name: 'MAR', value: 2 },
        { name: 'APR', value: 3 }, { name: 'MAY', value: 4 }, { name: 'JUN', value: 5 },
        { name: 'JUL', value: 6 }, { name: 'AUG', value: 7 }, { name: 'SEP', value: 8 },
        { name: 'OCT', value: 9 }, { name: 'NOV', value: 10 }, { name: 'DEC', value: 11 }
    ];

    // LOCKED TO CURRENT MONTH - Auto-updates when month changes
    const now = new Date();
    const activeMonth = now.getMonth();
    const activeYear = now.getFullYear();

    // Calendar Logic
    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(activeMonth, activeYear);
    const startOffset = getFirstDayOfMonth(activeMonth, activeYear);

    const days = Array.from({ length: daysInMonth + startOffset }, (_, i) => {
        if (i < startOffset) return null;
        return i - startOffset + 1;
    });

    // Fetch Games for Date Range
    useEffect(() => {
        const fetchReleases = async () => {
            setLoading(true);

            // Format Dates: YYYY-MM-DD
            const start = `${activeYear}-${String(activeMonth + 1).padStart(2, '0')}-01`;
            const end = `${activeYear}-${String(activeMonth + 1).padStart(2, '0')}-${daysInMonth}`;

            try {
                const data = await rawgService.getGames({
                    dates: `${start},${end}`,
                    page_size: 40,
                    ordering: '-added', // Show popular games first
                    parent_platforms: selectedPlatform === 'All' ? undefined : platforms.find(p => p.name === selectedPlatform)?.id
                });
                setGames(data.results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReleases();
    }, [activeMonth, activeYear, selectedPlatform]);

    // Featured Game (Highest Rating in Month)
    const featuredGame = games.length > 0 ? games.reduce((prev, current) => (prev.rating > current.rating) ? prev : current) : null;

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* Centered Hero - Unified Design */}
            <PageHero
                icon={CalendarIcon}
                iconColor="text-purple-400"
                title="The "
                titleAccent="Calendar"
                accentGradient="from-purple-400 to-pink-500"
                description="Track upcoming releases and never miss a launch."
            />

            {/* Platform Filter Buttons - Unified Design */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {platforms.map((p) => (
                        <motion.button
                            key={p.name}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedPlatform(p.name)}
                            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${selectedPlatform === p.name ? 'bg-purple-500 text-white border-purple-500 shadow-[0_5px_20px_-5px_rgba(168,85,247,0.4)]' : 'glass-dark text-white border-white/5 hover:border-white/20'}`}
                        >
                            <div className={`w-8 h-8 ${p.color} bg-opacity-20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <CalendarIcon size={16} className="text-white" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest">{p.name}</span>
                        </motion.button>
                    ))}
                </div>
                {/* Control Bar */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8 glass-dark p-4 rounded-xl border border-white/10 sticky top-32 z-20">
                    {/* Current Month Display (Read-Only) */}
                    <div className="flex items-center gap-4 w-full xl:w-auto">
                        <div className="flex items-center gap-2">
                            <CalendarIcon size={20} className="text-tech-red" />
                            <span className="text-xl font-black text-white uppercase tracking-wider">
                                {months[activeMonth].name} {activeYear}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Current Month Only</span>
                    </div>

                    {/* Platform Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 border-t xl:border-t-0 xl:border-l border-white/10 pt-4 xl:pt-0 xl:pl-4">
                        <span className="text-xs font-bold uppercase text-gray-500 mr-2 hidden md:block">Filter:</span>
                        {platforms.map(p => (
                            <button
                                key={p.name}
                                onClick={() => setSelectedPlatform(p.name)}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase border transition-colors whitespace-nowrap ${selectedPlatform === p.name ? 'bg-tech-red text-white border-tech-red shadow-glow' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={48} className="text-tech-red animate-spin" />
                    </div>
                ) : (
                    <div className="glass-dark rounded-xl border border-white/10 overflow-hidden">
                        {/* Week Headers */}
                        <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <div key={day} className="py-3 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:block">
                                    {day}
                                </div>
                            ))}
                            {/* Mobile Header */}
                            <div className="md:hidden py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest col-span-7">
                                Releases for {months[activeMonth].name} {activeYear}
                            </div>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-7 auto-rows-fr bg-white/5 gap-[1px]">
                            {days.map((day, i) => {
                                if (!day) return <div key={i} className="bg-[var(--bg-body)] h-32 md:h-48 hidden md:block opacity-50"></div>;

                                // Filter games released on this specific day
                                const dateStr = `${activeYear}-${String(activeMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const releases = games.filter(g => g.released === dateStr);
                                const displayReleases = releases.slice(0, 2);
                                const remaining = releases.length - 2;

                                return (
                                    <div key={i} className={`bg-[var(--bg-body)] min-h-[100px] md:h-48 p-2 relative group hover:bg-white/5 transition-colors ${releases.length > 0 ? '' : 'hidden md:block'}`}>
                                        <span className="text-xs font-bold text-gray-600 absolute top-2 right-3 z-10 group-hover:text-white transition-colors">{day}</span>
                                        {/* Mobile Day Label */}
                                        <span className="md:hidden text-xs font-bold text-tech-red mb-2 block">{day} {months[activeMonth].name}</span>

                                        <div className="h-full w-full pt-6 flex flex-col gap-1.5 overflow-hidden">
                                            {displayReleases.map((rel) => (
                                                <Link
                                                    key={rel.id}
                                                    href={`/calendar/${rel.slug}`}
                                                    className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all group/game"
                                                >
                                                    {rel.background_image ? (
                                                        <img src={rel.background_image} className="w-8 h-8 object-cover rounded shadow-sm" alt="" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-[8px] text-gray-500 font-bold">IMG</div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[10px] font-bold text-gray-300 truncate group-hover/game:text-tech-red transition-colors">{rel.name}</div>
                                                    </div>
                                                </Link>
                                            ))}

                                            {/* More Button */}
                                            {remaining > 0 && (
                                                <button
                                                    onClick={() => setSelectedDayReleases({ date: `${day} ${months[activeMonth].name}`, games: releases })}
                                                    className="mt-auto w-full py-1.5 bg-white/5 hover:bg-tech-red hover:text-white text-gray-400 text-[10px] font-black uppercase tracking-wider rounded transition-colors text-center"
                                                >
                                                    + {remaining} More
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Day Detail Modal */}
            <Modal
                isOpen={!!selectedDayReleases}
                onClose={() => setSelectedDayReleases(null)}
                size="lg"
            >
                <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                        <CalendarIcon className="text-tech-red" />
                        <span className="text-gray-500">Releases for</span>
                        <span className="text-white">{selectedDayReleases?.date}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedDayReleases?.games.map((game) => (
                            <Link href={`/calendar/${game.slug}`} key={game.id} className="flex gap-4 p-4 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-tech-red transition-all group">
                                <div className="w-24 h-32 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                                    {game.background_image ? (
                                        <img src={game.background_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={game.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase">No Image</div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {game.parent_platforms?.map((p: any) => (
                                            <span key={p.platform.id} className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-gray-400 uppercase">{p.platform.name}</span>
                                        ))}
                                    </div>
                                    <h4 className="text-lg font-black text-white mb-1 leading-tight group-hover:text-tech-red transition-colors line-clamp-2">{game.name}</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        {game.metacritic && (
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black text-black ${game.metacritic >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}>{game.metacritic}</span>
                                        )}
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{game.released}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
