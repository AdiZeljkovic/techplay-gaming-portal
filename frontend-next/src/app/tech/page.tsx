import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Cpu, Monitor, BarChart2, PenTool, AlertCircle, Zap } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';

export const metadata: Metadata = {
    title: 'Tech Hub | TechPlay',
    description: 'Hardware reviews, benchmarks, and the latest in PC technology.',
};

export const dynamic = 'force-dynamic';

const categories = [
    { name: 'News', icon: Zap, path: '/tech/news', color: 'bg-yellow-500' },
    { name: 'Reviews', icon: BarChart2, path: '/tech/reviews', color: 'bg-blue-500' },
    { name: 'Guides', icon: PenTool, path: '/tech/guides', color: 'bg-green-500' },
];

async function getTechData() {
    try {
        const articles = await articleService.getArticles({ section: 'tech', limit: 20 });
        return articles;
    } catch (error) {
        console.error('Failed to fetch tech articles:', error);
        return [];
    }
}

function TechCard({ post }: { post: Post }) {
    return (
        <Link href={`/ post / ${post.slug} `} className="group flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-lg">
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
                    <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">{post.category || 'Tech'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-xs text-gray-500">{post.date}</span>
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

export default async function TechHubPage() {
    const articles = await getTechData();

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            <PageHero
                iconName="Cpu"
                iconColor="text-cyan-400"
                title="Tech "
                titleAccent="Hub"
                accentGradient="from-cyan-400 to-blue-500"
                description="Hardware reviews, benchmarks, and the latest in PC technology."
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
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-2 h-8 bg-cyan-500 rounded-full" />
                            Latest Tech Articles
                        </h2>
                    </div>

                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map(post => (
                                <TechCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<AlertCircle className="w-8 h-8 text-white" />}
                            title="No tech articles yet"
                            description="Check back later for hardware reviews and benchmarks."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
