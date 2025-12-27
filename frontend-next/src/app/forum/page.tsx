import { forumService } from '@/lib/forumService';
import Link from 'next/link';
import { MessageCircle, Bell, Cpu, Star, MessageSquare, Clock, Eye, Hash, Search, Plus, Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';
import { ForumSidebar } from '@/components/forum/ForumSidebar';
import { ForumStats } from '@/components/forum/ForumStats';

export const metadata: Metadata = {
    title: 'The Forum | TechPlay Community',
    description: 'Join the discussion. Share your build, debate the GOTY, or find a squad.',
};

// Force dynamic rendering - API calls at build time fail
export const dynamic = 'force-dynamic';

const iconMap: Record<string, any> = {
    MessageCircle, Bell, Cpu, Star, MessageSquare
};

export default async function ForumPage() {
    const categories = await forumService.getCategories();
    const recentThreads = await forumService.getRecentThreads(5);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* PageHero */}
            <PageHero
                iconName="MessageSquare"
                iconColor="text-indigo-400"
                title="The "
                titleAccent="Forum"
                accentGradient="from-indigo-400 to-purple-500"
                description="Join the discussion. Share your build, debate the GOTY, or find a squad."
            />

            {/* Stats & Search Toolbar */}
            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <ForumStats />

                {/* Search & New Topic */}
                <div className="relative z-20 mt-8">
                    <div className="glass-dark p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 items-center border border-white/10">
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search topics..."
                                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-500"
                            />
                        </div>
                        <Link href="/forum/create">
                            <button className="py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] bg-indigo-500 hover:bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all">
                                <Plus size={18} /> New Topic
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                {/* Categories */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-6">
                        <span className="w-2 h-8 bg-indigo-500 rounded-full" />
                        Categories
                    </h2>
                    {categories.map((category) => {
                        const Icon = iconMap[category.icon || 'MessageCircle'] || MessageCircle;
                        return (
                            <Link
                                key={category.id}
                                href={`/forum/category/${category.slug}`}
                                className="block bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 hover:bg-white/5 hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 group-hover:border-white/20 group-hover:scale-105 transition-all ${category.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">{category.name}</h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{category.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {category.threadCount} threads</span>
                                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {category.replies} posts</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Sidebar */}
                <ForumSidebar />
            </section>
        </div>
    );
}
