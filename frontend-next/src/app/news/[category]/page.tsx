import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Gamepad2, Radio, Monitor, Video, Briefcase, Flame, MessageCircle, Trophy, AlertCircle, ChevronLeft, Zap, Globe } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';
import { notFound } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

// Category configuration
const categoryConfig: Record<string, {
    title: string;
    iconName: string;
    color: string;
    description: string;
    gradient: string;
    filter: string;
}> = {
    gaming: {
        title: 'Gaming News',
        iconName: 'Gamepad2',
        color: 'text-blue-400',
        description: 'The latest stories from the world of interactive entertainment.',
        gradient: 'from-blue-400 to-cyan-400',
        filter: 'gaming'
    },
    consoles: {
        title: 'Console News',
        iconName: 'Radio',
        color: 'text-purple-400',
        description: 'Updates for PlayStation, Xbox, and Nintendo.',
        gradient: 'from-purple-400 to-pink-400',
        filter: 'consoles'
    },
    pc: {
        title: 'PC Gaming',
        iconName: 'Monitor',
        color: 'text-green-400',
        description: 'Steam sales, driver updates, and modding community.',
        gradient: 'from-green-400 to-emerald-400',
        filter: 'pc'
    },
    movies: {
        title: 'Movies & TV',
        iconName: 'Video',
        color: 'text-yellow-400',
        description: 'Adaptations, anime, and geek culture.',
        gradient: 'from-yellow-400 to-orange-400',
        filter: 'movies'
    },
    industry: {
        title: 'Industry',
        iconName: 'Briefcase',
        color: 'text-gray-400',
        description: 'Mergers, acquisitions, and market trends.',
        gradient: 'from-gray-400 to-slate-400',
        filter: 'industry'
    },
    esports: {
        title: 'Esports',
        iconName: 'Trophy',
        color: 'text-red-500',
        description: 'Tournament results, roster changes, and meta analysis.',
        gradient: 'from-red-500 to-rose-500',
        filter: 'esports'
    },
    opinions: {
        title: 'Opinions',
        iconName: 'MessageCircle',
        color: 'text-indigo-400',
        description: 'Hot takes, deep dives, and expert analysis.',
        gradient: 'from-indigo-400 to-purple-400',
        filter: 'opinions'
    },
};

// Force dynamic rendering for these pages
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const config = categoryConfig[category];

    if (!config) {
        return { title: 'News Category' };
    }

    return {
        title: `${config.title} | TechPlay`,
        description: config.description,
    };
}

async function getCategoryNews(categoryFilter: string) {
    try {
        const articles = await articleService.getArticles({
            section: 'news',
            category: categoryFilter,
            limit: 20
        });
        return articles;
    } catch (error) {
        console.error('Failed to fetch category news:', error);
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
                        {post.category || 'News'}
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

function NewsCard({ post, color }: { post: Post; color: string }) {
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
                    <span className={`text-xs font-bold ${color} uppercase tracking-wider`}>{post.category || 'News'}</span>
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

export default async function NewsCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const config = categoryConfig[category];

    if (!config) {
        notFound();
    }

    const articles = await getCategoryNews(config.filter);
    const heroArticles = articles.slice(0, 2);
    const gridArticles = articles.slice(2);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            <PageHero
                iconName={config.iconName}
                iconColor={config.color}
                title={config.title}
                titleAccent=""
                accentGradient={config.gradient}
                description={config.description}
            />

            <div className="container mx-auto px-4 py-12 max-w-[1400px]">
                {/* Back to News */}
                <Link href="/category/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-8 py-2 px-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40">
                    <ChevronLeft size={14} /> Back to Newsroom
                </Link>

                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span className={`w-2 h-8 ${config.color.replace('text-', 'bg-')} rounded-full`} />
                        {config.title}
                    </h2>
                </div>

                {/* Hero Grid */}
                {heroArticles.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {heroArticles.map((post) => (
                            <HeroCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Remaining Grid */}
                {gridArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridArticles.map(post => (
                            <NewsCard key={post.id} post={post} color={config.color} />
                        ))}
                    </div>
                ) : articles.length === 0 && (
                    <EmptyState
                        icon={<AlertCircle className="w-8 h-8 text-white" />}
                        title="No updates yet"
                        description={`Check back later for the latest stories in ${config.title}.`}
                        action={{ label: "View All News", href: "/news" }}
                    />
                )}
            </div>
        </div>
    );
}
