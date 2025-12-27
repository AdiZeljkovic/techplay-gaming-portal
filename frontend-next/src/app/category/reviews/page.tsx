import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Medal, Crown, Layers, Ghost, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';

export const metadata: Metadata = {
    title: 'The Verdict | Reviews | TechPlay',
    description: 'Definitive scores. Unbiased analysis. The reviews that matter.',
};

// Force dynamic rendering - API calls at build time fail
export const dynamic = 'force-dynamic';

const categories = [
    { name: 'Latest', icon: Star, path: '/reviews/latest', color: 'bg-blue-500' },
    { name: 'Editor Choice', icon: Medal, path: '/reviews/editors-choice', color: 'bg-yellow-500' },
    { name: 'AAA Titles', icon: Crown, path: '/reviews/aaa', color: 'bg-purple-500' },
    { name: 'Indie Gems', icon: Layers, path: '/reviews/indie', color: 'bg-green-500' },
    { name: 'Retro', icon: Ghost, path: '/reviews/retro', color: 'bg-red-500' },
];

async function getReviewsData() {
    try {
        const articles = await articleService.getArticles({ section: 'reviews', limit: 20 });
        return articles;
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
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
                        {post.tags?.[0] || 'Review'}
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

function ReviewCard({ post }: { post: Post }) {
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
                    <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">{post.tags?.[0] || 'Review'}</span>
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

export default async function ReviewsHubPage() {
    const articles = await getReviewsData();
    const heroArticles = articles.slice(0, 2);
    const gridArticles = articles.slice(2);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* PageHero */}
            <PageHero
                iconName="Star"
                iconColor="text-yellow-400"
                title="The "
                titleAccent="Verdict"
                accentGradient="from-yellow-400 to-orange-500"
                description="Definitive scores. Unbiased analysis. The reviews that matter."
            />

            {/* Category Navigation Bar */}
            <div className="container mx-auto px-4 -mt-8 mb-12 relative z-20">
                <div className="flex flex-wrap justify-center gap-3 bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-subtle)] shadow-2xl max-w-5xl mx-auto backdrop-blur-md">
                    {categories.map((cat) => (
                        <Link href={cat.path} key={cat.name} className="flex-1 min-w-[120px]">
                            <div className="group flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                <cat.icon size={18} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wider group-hover:text-white transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-[1400px]">
                {/* Top Featured Grid */}
                {heroArticles.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {heroArticles.map((post) => (
                            <HeroCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Reviews Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-yellow-500 rounded-full" />
                            Recent Verdicts
                        </h2>
                    </div>

                    {gridArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gridArticles.map(post => (
                                <ReviewCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<AlertCircle className="w-8 h-8 text-gray-400" />}
                            title="No reviews found"
                            description="Check back later for the latest reviews."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
