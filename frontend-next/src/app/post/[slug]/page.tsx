import { articleService } from '@/lib/articleService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, User, Tag, ChevronLeft, Share2 } from 'lucide-react';
import { Metadata } from 'next';
import { CommentsSection } from '@/components/article/CommentsSection';
import Sidebar from '@/components/common/Sidebar';
import { RelatedArticles } from '@/components/common/RelatedArticles';
import { BookmarkButton } from '@/components/BookmarkButton';
import { SocialShare } from '@/components/common/SocialShare';

export const revalidate = 60;

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const article = await articleService.getBySlug(slug);
        return {
            title: article.title,
            description: article.excerpt,
            openGraph: {
                title: article.title,
                description: article.excerpt,
                images: [article.image],
                type: 'article',
                authors: [article.author.username],
                publishedTime: article.date,
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.excerpt,
                images: [article.image],
            },
        };
    } catch {
        return {
            title: 'Article Not Found',
        };
    }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;

    let article;
    try {
        article = await articleService.getBySlug(slug);
    } catch {
        notFound();
    }

    if (!article) {
        notFound();
    }

    // Fetch Sidebar Data and Related components
    const [latest, mostRead, threads, relatedArticles] = await Promise.all([
        articleService.getLatest(),
        articleService.getMostRead(),
        Promise.resolve([
            { id: '1', title: 'Best GPU for 2025?', replies: 12 },
            { id: '2', title: 'Cyberpunk 2077 Mods', replies: 45 },
            { id: '3', title: 'Elden Ring DLC Hype', replies: 89 }
        ] as any[]),
        articleService.getArticles({ category: article.category || 'News', limit: 4 })
    ]);

    return (
        <article className="min-h-screen bg-[#0f0b15]">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={article.image?.includes('localhost') || article.image?.includes('127.0.0.1')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-black/50 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-8 left-0 right-0 container mx-auto px-4 z-20">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>

                {/* Hero Content (Title overlaid on big hero) */}
                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto z-20">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-full">
                                {article.category}
                            </span>
                            {article.tags?.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-black/40 backdrop-blur-md text-gray-300 text-sm rounded-full border border-white/10"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center border border-white/20">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">{article.author.username}</div>
                                    <div className="text-xs opacity-75">Author</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {new Date(article.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {article.views.toLocaleString()} views
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content & Sidebar Layout */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Main Content Column */}
                    <div className="flex-1 min-w-0">

                        {/* Score Badge (if review) */}
                        {article.rating != null && article.rating > 0 && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-red-600/10 to-orange-500/10 border border-red-500/20 rounded-2xl flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-lg shadow-red-500/20">
                                    {article.rating}
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white mb-1">TechPlay Score</div>
                                    <div className="text-gray-400">Our verdict on this title.</div>
                                </div>
                            </div>
                        )}

                        {/* Excerpt */}
                        {article.excerpt && (
                            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8 font-manrope font-medium border-l-4 border-red-500 pl-6">
                                {article.excerpt}
                            </p>
                        )}

                        {/* Article Body */}
                        <div
                            className="prose prose-lg prose-invert max-w-none
                            prose-headings:font-black prose-headings:text-white prose-headings:font-manrope
                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-strong:font-bold
                            prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
                            prose-blockquote:border-red-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-300
                            "
                            dangerouslySetInnerHTML={{ __html: article.content || '' }}
                        />

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-2 text-gray-400 mb-4">
                                    <Tag className="w-4 h-4" />
                                    <span className="font-bold text-sm uppercase tracking-wide">Related Topics</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition cursor-pointer border border-[var(--border-subtle)] hover:border-white/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share & Actions */}
                        <div className="mt-8 flex items-center justify-between p-4 bg-white/5 rounded-xl border border-[var(--border-subtle)]">
                            <span className="text-white font-bold">Enjoyed this article?</span>
                            <div className="flex gap-4 items-center">
                                <BookmarkButton slug={article.slug} title={article.title} />
                                <SocialShare
                                    url={`https://techplay.gg/post/${article.slug}`}
                                    title={article.title}
                                    className="!gap-1"
                                    compact
                                />
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="mt-8 p-8 bg-[#1a1f2e] rounded-2xl border border-white/5 flex gap-6 items-start">
                            <div className="shrink-0 relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500/30">
                                    <Image
                                        src={article.author.avatar}
                                        alt={article.author.username}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-900/80 backdrop-blur border border-green-500/30 text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                    {article.author.role || 'Author'}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                    {article.author.username}
                                    {article.author.level && (
                                        <span className="text-xs font-normal text-gray-500 bg-black/30 px-2 py-0.5 rounded">Lvl {article.author.level}</span>
                                    )}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {article.author.bio || `Tech enthusiast and content creator at TechPlay. Passionate about ${article.category?.toLowerCase() || 'gaming'} and sharing knowledge with the community.`}
                                </p>
                                <div className="flex gap-4">
                                    <button className="text-xs font-bold text-green-400 hover:text-green-300 uppercase tracking-widest transition-colors">
                                        View Profile
                                    </button>
                                    <button className="text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                                        All Articles
                                    </button>
                                </div>
                            </div>
                        </div>

                        <RelatedArticles articles={relatedArticles} currentSlug={article.slug} />

                        <CommentsSection postId={article.id} />
                    </div>

                    {/* Sidebar Column */}
                    <Sidebar latestNews={latest} mostRead={mostRead} forumThreads={threads} />

                </div>
            </div>

            {/* Spacing at bottom */}
            <div className="h-24" />
        </article>
    );

}
