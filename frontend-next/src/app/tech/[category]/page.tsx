import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Zap, BarChart2, PenTool, AlertCircle, ChevronLeft } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';
import { notFound } from 'next/navigation';

const categoryConfig: Record<string, {
    name: string;
    iconName: string;
    color: string;
    description: string;
    gradient: string;
    tag: string
}> = {
    news: {
        name: 'Tech News',
        iconName: 'Zap',
        color: 'text-yellow-400',
        description: 'Breaking hardware updates and industry rumors.',
        gradient: 'from-yellow-400 to-orange-400',
        tag: 'News'
    },
    reviews: {
        name: 'Tech Reviews',
        iconName: 'BarChart2',
        color: 'text-blue-400',
        description: 'In-depth benchmarks and performance analysis.',
        gradient: 'from-blue-400 to-cyan-400',
        tag: 'Review'
    },
    guides: {
        name: 'Tech Guides',
        iconName: 'PenTool',
        color: 'text-green-400',
        description: 'Build guides, optimization tips, and how-tos.',
        gradient: 'from-green-400 to-emerald-400',
        tag: 'Guide'
    },
};

interface PageProps {
    params: Promise<{ category: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category } = await params;
    const config = categoryConfig[category];
    return config ? { title: config.name, description: config.description } : { title: 'Not Found' };
}

export function generateStaticParams() {
    return Object.keys(categoryConfig).map((category) => ({ category }));
}

async function getTechArticles(tag: string) {
    try {
        return await articleService.getArticles({ section: 'tech', tag: tag, limit: 20 });
    } catch { return []; }
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
                    <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full mb-3 inline-block shadow-lg shadow-cyan-900/20">
                        {post.subcategory || 'Tech'}
                    </span>
                    <h2 className="text-3xl font-black text-white leading-tight mb-2 font-manrope group-hover:text-cyan-400 transition-colors">
                        {post.title}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-300 font-bold">
                        <span>{post.author.username}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

function TechCard({ post, color }: { post: Post; color: string }) {
    return (
        <Link href={`/post/${post.slug}`} className="group flex flex-col bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-lg h-full">
            <div className="h-48 overflow-hidden relative">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                />
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold ${color} uppercase tracking-wider`}>{post.subcategory || 'Tech'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors mt-auto">
                    Read Article <ChevronRight size={12} className="text-cyan-500" />
                </div>
            </div>
        </Link>
    );
}

export default async function TechCategoryPage({ params }: PageProps) {
    const { category } = await params;
    const config = categoryConfig[category];
    if (!config) notFound();

    const articles = await getTechArticles(config.tag);
    const heroArticles = articles.slice(0, 2);
    const gridArticles = articles.slice(2);

    return (
        <div className="min-h-screen bg-[var(--bg-body)]">
            <PageHero
                iconName={config.iconName}
                iconColor={config.color}
                title={config.name}
                titleAccent=""
                accentGradient={config.gradient}
                description={config.description}
            />

            <section className="container mx-auto px-4 py-12 max-w-[1400px]">
                {/* Back to Tech */}
                <Link href="/tech" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-8 py-2 px-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40">
                    <ChevronLeft size={14} /> Back to Tech Hub
                </Link>

                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span className={`w-2 h-8 ${config.color.replace('text-', 'bg-')} rounded-full`} />
                        {config.name}
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
                        {gridArticles.map((post) => (
                            <TechCard key={post.id} post={post} color={config.color} />
                        ))}
                    </div>
                ) : articles.length === 0 && (
                    <EmptyState
                        icon={<AlertCircle className="w-8 h-8 text-white" />}
                        title={`No ${config.name} Found`}
                        description={`Check back later for ${config.name.toLowerCase()}.`}
                        action={{ label: "View All Tech", href: "/tech" }}
                    />
                )}
            </section>
        </div>
    );
}
