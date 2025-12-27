import { forumService } from '@/lib/forumService';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageSquare, Clock, Eye, Lock, Pin, ChevronLeft, Hash } from 'lucide-react';
import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const category = await forumService.getCategoryBySlug(slug);

    if (!category) return { title: 'Category Not Found' };

    return {
        title: category.name,
        description: category.description,
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const category = await forumService.getCategoryBySlug(slug);

    if (!category) notFound();

    const threads = await forumService.getThreads(category.id, 20);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            <section className="bg-[var(--bg-body)] border-b border-[var(--border-subtle)] py-8">
                <div className="container mx-auto px-4">
                    <Link href="/forum" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition">
                        <ChevronLeft className="w-4 h-4" /> Back to Forum
                    </Link>
                    <h1 className="text-3xl font-black text-white mb-2">{category.name}</h1>
                    <p className="text-gray-400">{category.description}</p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-8">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 bg-black/20">
                        <div className="col-span-12 md:col-span-7">Topic</div>
                        <div className="col-span-2 hidden md:block text-center">Replies</div>
                        <div className="col-span-3 hidden md:block text-right">Last Post</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {threads.length > 0 ? threads.map((thread) => (
                            <div key={thread.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition group items-center">
                                <div className="col-span-12 md:col-span-7">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 shrink-0">
                                            {thread.isPinned ? <Pin className="w-4 h-4 text-green-500" /> : <MessageSquare className="w-4 h-4 text-indigo-500" />}
                                        </div>
                                        <div>
                                            <Link href={`/forum/thread/${thread.id}`}>
                                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition mb-1 line-clamp-1">
                                                    {thread.title}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>by <span className="text-indigo-400">{thread.author?.username || 'Unknown'}</span></span>
                                                {thread.tags?.map(tag => (
                                                    <span key={tag} className="px-1.5 py-0.5 bg-white/5 rounded text-gray-400">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 hidden md:block text-center text-gray-400 text-sm">
                                    {thread.replies}
                                </div>
                                <div className="col-span-3 hidden md:block text-right text-gray-400 text-sm">
                                    <div className="flex items-center justify-end gap-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(thread.lastPost).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400">
                                No threads found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
