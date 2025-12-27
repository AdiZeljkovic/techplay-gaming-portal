import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Gamepad2, Headphones, Monitor, Cpu, Armchair, Glasses, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
    latest: {
        title: 'Latest Reviews',
        iconName: 'Star',
        color: 'text-blue-500',
        description: 'Our newest takes on the hottest releases.',
        gradient: 'from-blue-500 to-indigo-500',
        filter: 'latest'
    },
    'editors-choice': {
        title: "Editor's Choice",
        iconName: 'Medal',
        color: 'text-yellow-400',
        description: 'The absolute best games we\'ve ever played. 9.0+ Only.',
        gradient: 'from-yellow-400 to-orange-400',
        filter: 'editors-choice'
    },
    aaa: {
        title: 'AAA Blockbusters',
        iconName: 'Crown',
        color: 'text-purple-500',
        description: 'High budget, high stakes.',
        gradient: 'from-purple-500 to-fuchsia-500',
        filter: 'aaa-titles'
    },
    indie: {
        title: 'Indie Gems',
        iconName: 'Layers',
        color: 'text-green-500',
        description: 'Small teams, big hearts.',
        gradient: 'from-green-500 to-emerald-500',
        filter: 'indie-gems'
    },
    retro: {
        title: 'Retro Corner',
        iconName: 'Ghost',
        color: 'text-red-500',
        description: 'Classic games and nostalgia trips.',
        gradient: 'from-red-500 to-orange-600',
        filter: 'retro'
    },
};

// Force dynamic rendering for these pages
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const config = categoryConfig[category];

    if (!config) {
        return { title: 'Reviews Category' };
    }

    return {
        title: `${config.title} | TechPlay`,
        description: config.description,
    };
}

async function getCategoryReviews(categoryFilter: string) {
    try {
        const articles = await articleService.getArticles({
            section: 'reviews',
            category: categoryFilter,
            limit: 20
        });
        return articles;
    } catch (error) {
        console.error('Failed to fetch category reviews:', error);
        return [];
    }
}

function HeroCard({ post }: { post: Post }) {
    const getRatingColor = (rating: number | undefined) => {
        if (!rating) return 'bg-blue-500';
        if (rating >= 9) return 'bg-yellow-500';
        if (rating >= 7) return 'bg-green-500';
        return 'bg-blue-500';
    };

    return (
        <div className="relative group cursor-pointer rounded-3xl overflow-hidden h-[400px] shadow-2xl border border-white/10">
            <Link href={`/ post / ${post.slug} `} className="block w-full h-full">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/20 to-transparent" />
                <div className="absolute top-4 right-4 z-20">
                    <div className={`w - 12 h - 12 rounded - xl ${getRatingColor(post.rating)} flex items - center justify - center font - black text - black text - xl shadow - lg border border - white / 20`}>
                        {post.rating || '-'}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                    <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full mb-3 inline-block shadow-lg">
                        {post.category || 'Review'}
                    </span>
                    <h2 className="text-3xl font-black text-white leading-tight mb-2 font-manrope group-hover:text-yellow-400 transition-colors">
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

function ReviewCard({ post, color }: { post: Post; color: string }) {
    const getRatingColor = (rating: number | undefined) => {
        if (!rating) return 'bg-blue-500';
        if (rating >= 9) return 'bg-yellow-500';
        if (rating >= 7) return 'bg-green-500';
        return 'bg-blue-500';
    };

    return (
        <Link href={`/ post / ${post.slug} `} className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-all hover:-translate-y-1 shadow-lg">
            <div className="h-48 overflow-hidden relative">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                />
                <div className="absolute top-3 right-3">
                    {post.rating && (
                        <div className={`w - 8 h - 8 rounded - lg ${getRatingColor(post.rating)} flex items - center justify - center font - black text - black text - sm shadow - md`}>
                            {post.rating}
                        </div>
                    )}
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text - xs font - bold ${color} uppercase tracking - wider`}>{post.category || 'Review'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors mt-auto">
                    Read Review <ChevronRight size={12} className="text-yellow-500" />
                </div>
            </div>
        </Link>
    );
}

export default async function ReviewsCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const config = categoryConfig[category];

    if (!config) {
        notFound();
    }

    const articles = await getCategoryReviews(config.filter);
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
                {/* Back to Reviews */}
                <Link href="/category/reviews" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-8 py-2 px-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40">
                    <ChevronLeft size={14} /> Back to Reviews
                </Link>

                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span className={`w - 2 h - 8 ${config.color.replace('text-', 'bg-')} rounded - full`} />
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
                            <ReviewCard key={post.id} post={post} color={config.color} />
                        ))}
                    </div>
                ) : articles.length === 0 && (
                    <EmptyState
                        icon={<AlertCircle className="w-8 h-8 text-white" />}
                        title="No reviews found"
                        description={`Check back later for ${config.title}.`}
                        action={{ label: "View All Reviews", href: "/reviews" }}
                    />
                )}
            </div>
        </div>
    );
}
