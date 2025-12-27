import { articleService } from '@/lib/articleService';
import { categoryService } from '@/lib/categoryService';
import Link from 'next/link';
import Image from 'next/image';
import { PenTool, ChevronRight, BookOpen, Layers, Search, X } from 'lucide-react';
import { Post } from '@/lib/types';
import { Metadata } from 'next';
import { PageHero } from '@/components/common/PageHero';

export const metadata: Metadata = {
    title: 'Guides & Walkthroughs',
    description: 'Expert guides, tips, and walkthroughs for your favorite games.',
};

async function getGuides(categorySlug?: string) {
    try {
        const guides = await articleService.getArticles({
            section: 'guides',
            limit: 12,
            category: categorySlug
        });
        return guides;
    } catch { return []; }
}

async function getCategories() {
    try {
        return await categoryService.getBySection('guides');
    } catch { return []; }
}

function GuideCard({ post }: { post: Post }) {
    return (
        <Link href={`/post/${post.slug}`} className="group glass-dark rounded-2xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] flex flex-col h-full">
            <div className="relative aspect-video overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-green-600/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">Guide</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 font-medium leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center text-green-400 text-xs font-black uppercase tracking-widest mt-auto group/btn">
                    Read Guide <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}

export default async function GuidesPage({ searchParams }: { searchParams: { category?: string } }) {
    const categorySlug = searchParams.category;
    const [guides, categories] = await Promise.all([
        getGuides(categorySlug),
        getCategories()
    ]);

    const activeCategory = categories.find(c => c.slug === categorySlug);

    return (
        <div className="min-h-screen bg-[#0f0b15]">
            <PageHero
                iconName="PenTool"
                iconColor="text-green-400"
                title="Guides & "
                titleAccent="Walkthroughs"
                accentGradient="from-green-400 to-emerald-600"
                description="Everything you need to know to master your favorite games."
            />

            {/* Featured Categories (Dynamic) */}
            <section className="container mx-auto px-4 -mt-8 relative z-10 mb-16">
                {categories.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {categories.slice(0, 3).map((cat, i) => (
                            <Link
                                key={cat.id}
                                href={categorySlug === cat.slug ? '/guides' : `/guides?category=${cat.slug}`}
                                className={`glass-dark border p-6 rounded-2xl transition-all cursor-pointer group hover:-translate-y-1 shadow-xl ${categorySlug === cat.slug ? 'border-green-500 bg-green-500/10' : 'border-white/10 hover:border-green-500/50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${i === 0 ? 'bg-green-500/20 text-green-400' : i === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'} group-hover:bg-green-500 group-hover:text-white`}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className={`text-xl font-black uppercase tracking-tight ${categorySlug === cat.slug ? 'text-green-400' : 'text-white'}`}>{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="glass-dark border border-white/10 p-6 rounded-2xl text-center text-gray-400">
                        No specific categories found.
                    </div>
                )}
            </section>

            {/* Guides Grid */}
            <section className="container mx-auto px-4 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Layers className="w-6 h-6 text-green-500" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                            {activeCategory ? `${activeCategory.name} Guides` : 'Latest Guides'}
                        </h2>
                        {activeCategory && (
                            <Link href="/guides" className="ml-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                                Clear Filter <X size={12} />
                            </Link>
                        )}
                    </div>
                    {/* Search Bar - Visual Only for now */}
                    <div className="relative hidden md:block w-64">
                        <input
                            type="text"
                            placeholder="Search guides..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-green-500/50 transition-colors"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-500 w-4 h-4" />
                    </div>
                </div>

                {guides.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {guides.map((post) => (
                            <GuideCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <PenTool className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-bold text-lg mb-2">No Guides Found</h3>
                        <p className="text-gray-500">
                            {categorySlug ? `No guides found in ${activeCategory?.name || 'this category'}.` : 'Check back later for new content.'}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
