import { articleService } from '@/lib/articleService';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Cpu, Zap, BarChart2, PenTool } from 'lucide-react';
import { Post } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tech',
    description: 'Hardware reviews, benchmarks, and tech guides for gamers.',
};

const subcategories = [
    { name: 'News', path: '/tech/news', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { name: 'Reviews', path: '/tech/reviews', icon: BarChart2, color: 'from-blue-500 to-cyan-500' },
    { name: 'Guides', path: '/tech/guides', icon: PenTool, color: 'from-green-500 to-emerald-500' },
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

function TechCard({ post, large = false }: { post: Post; large?: boolean }) {
    return (
        <Link
            href={`/post/${post.slug}`}
            className={`group relative block overflow-hidden rounded-xl ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="inline-block px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full mb-3">
                    {post.subcategory || 'Tech'}
                </span>
                <h3 className={`font-bold text-white leading-tight group-hover:text-cyan-400 transition ${large ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                    {post.title}
                </h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default async function TechHubPage() {
    const articles = await getTechData();
    const heroArticles = articles.slice(0, 2);
    const gridArticles = articles.slice(2);

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-500 rounded-xl flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Tech</h1>
                        <p className="text-gray-400">Hardware reviews, benchmarks & guides</p>
                    </div>
                </div>

                {/* Subcategory Navigation */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {subcategories.map((cat) => (
                        <Link
                            key={cat.path}
                            href={cat.path}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition"
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Hero Section - 2 Cards Side by Side */}
            <section className="container mx-auto px-4 pb-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {heroArticles.map((post) => (
                        <TechCard key={post.id} post={post} large />
                    ))}
                </div>
            </section>

            {/* Grid Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gridArticles.map((post) => (
                        <TechCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
}
