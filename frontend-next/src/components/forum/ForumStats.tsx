'use client';

import { useEffect, useState } from 'react';
import { forumService } from '@/lib/forumService';
import { Loader2 } from 'lucide-react';

export function ForumStats() {
    const [stats, setStats] = useState<{ threads: number; members: number; online: number } | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await forumService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats');
            }
        };

        fetchStats();

        // Refresh every minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!stats) {
        // Loading state (skeleton or spinner)
        return (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-dark px-8 py-4 rounded-2xl border border-[var(--border-subtle)] text-center min-w-[140px] h-[84px] animate-pulse bg-white/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="glass-dark px-8 py-4 rounded-2xl border border-[var(--border-subtle)] text-center min-w-[140px]">
                <div className="text-red-500 text-3xl font-black mb-1">
                    {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(stats.threads)}
                </div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Threads</div>
            </div>
            <div className="glass-dark px-8 py-4 rounded-2xl border border-[var(--border-subtle)] text-center min-w-[140px]">
                <div className="text-indigo-400 text-3xl font-black mb-1 animate-pulse">
                    {new Intl.NumberFormat('en-US').format(stats.online)}
                </div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Online</div>
            </div>
            <div className="glass-dark px-8 py-4 rounded-2xl border border-[var(--border-subtle)] text-center min-w-[140px]">
                <div className="text-green-400 text-3xl font-black mb-1">
                    {new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(stats.members)}
                </div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Members</div>
            </div>
        </div>
    );
}
