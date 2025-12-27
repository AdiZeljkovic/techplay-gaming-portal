import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, ChevronRight, Flame, Gamepad2, Radio, Monitor, Video, Briefcase, MessageCircle, Trophy, User, AlertCircle } from 'lucide-react';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';

export const metadata: Metadata = {
    title: 'The Newsroom | TechPlay',
    description: 'Breaking stories. Industry analysis. All the news that matters.',
};

// Force dynamic rendering - API calls at build time fail
export const dynamic = 'force-dynamic';

const categories = [
    { name: 'Gaming', path: '/news/gaming', icon: Gamepad2, color: 'text-blue-400' },
    { name: 'Console', path: '/news/consoles', icon: Radio, color: 'text-purple-400' },
    { name: 'PC', path: '/news/pc', icon: Monitor, color: 'text-green-400' },
    { name: 'Movies', path: '/news/movies', icon: Video, color: 'text-yellow-400' },
    { name: 'Industry', path: '/news/industry', icon: Briefcase, color: 'text-gray-400' },
    { name: 'Esports', path: '/news/esports', icon: Flame, color: 'text-red-500' },
    { name: 'Opinions', path: '/news/opinions', icon: MessageCircle, color: 'text-indigo-400' },
];

async function getNewsData() {
    try {
        const articles = await articleService.getArticles({ section: 'news', limit: 20 });
        return articles;
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return [];
    }
}

function HeroCard({ post }: { post: Post }) {
    return (
        <div className="relative group cursor-pointer rounded-3xl overflow-hidden h-[400px] shadow-2xl border border-white/10">
            <Link href={`/post/${post.slug}`} className="block w-full h-full">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mb-3 inline-block shadow-lg shadow-red-900/20">
                        {post.category || 'Breaking'}
                    </span>
                    <h2 className="text-3xl font-black text-white leading-tight mb-2 font-manrope group-hover:text-red-500 transition-colors">
                        {post.title}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-300 font-bold">
                        <span>{post.author.username}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>{post.date}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

function NewsCard({ post }: { post: Post }) {
    return (
        <Link href={`/post/${post.slug}`} className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-red-500/30 transition-all hover:-translate-y-1 shadow-lg">
            <div className="h-48 overflow-hidden relative">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                />
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{post.category || 'News'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors mt-auto">
                    Read Article <ChevronRight size={12} className="text-red-500" />
                </div>
            </div>
        </Link>
    );
}

export default async function NewsHubPage() {
    const articles = await getNewsData();
    const heroArticles = articles.slice(0, 2);
    const gridArticles = articles.slice(2);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* PageHero */}
            <PageHero
                iconName="Flame"
                iconColor="text-red-500"
                title="The "
                titleAccent="Newsroom"
                accentGradient="from-red-500 to-orange-500"
                description="Breaking stories. Industry analysis. All the news that matters."
            />

            {/* Category Navigation Bar */}
            <div className="container mx-auto px-4 -mt-8 mb-12 relative z-20">
                <div className="flex flex-wrap justify-center gap-3 bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-subtle)] shadow-2xl max-w-5xl mx-auto backdrop-blur-md">
                    {categories.map((cat) => (
                        <Link href={cat.path} key={cat.name} className="flex-1 min-w-[120px]">
                            <div className="group flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                <cat.icon size={18} className={`${cat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wider group-hover:text-white transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-[1400px]">
                {/* Top Featured Grid - Two Hero Cards */}
                {heroArticles.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {heroArticles.map((post) => (
                            <HeroCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Remaining News Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-red-500 rounded-full" />
                            Latest Headlines
                        </h2>
                    </div>

                    {gridArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gridArticles.map(post => (
                                <NewsCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-full p-12 text-center text-gray-500 glass-dark rounded-2xl border border-white/5">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2">No news yet</h3>
                            <p>Check back later for the latest stories.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
