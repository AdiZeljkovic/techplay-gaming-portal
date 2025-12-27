import { forumService } from '@/lib/forumService';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MessageSquare, Share2, Flag, Reply } from 'lucide-react';
import Image from 'next/image';
import { ReplyBox } from '@/components/forum/ReplyBox';
import { PostItem } from '@/components/forum/PostItem';
import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const { thread } = await forumService.getThread(id);

    if (!thread) return { title: 'Thread Not Found' };

    return {
        title: thread.title,
    };
}

export default async function ThreadPage({ params }: PageProps) {
    const { id } = await params;
    const { thread, posts } = await forumService.getThread(id);

    if (!thread) notFound();

    const opPost = posts[0];
    const replies = posts.slice(1);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            <section className="bg-[var(--bg-body)] border-b border-[var(--border-subtle)] py-8">
                <div className="container mx-auto px-4">
                    <Link href="/forum" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition">
                        <ChevronLeft className="w-4 h-4" /> Back to Forum
                    </Link>
                    <div className="flex items-start gap-4">
                        <h1 className="text-3xl font-black text-white mb-2 flex-1">{thread.title}</h1>
                        {thread.isPinned && <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase rounded-full border border-indigo-500/30">Pinned</span>}
                        {thread.isLocked && <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold uppercase rounded-full border border-red-500/30">Locked</span>}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Started by <span className="text-indigo-400 font-bold">{thread.author.username}</span></span>
                        <span>•</span>
                        <span>{new Date(thread.lastPost).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{thread.views} views</span>
                        <span>•</span>
                        <span>{thread.replies} replies</span>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col gap-8">
                    {/* OP Post */}
                    {opPost && (
                        <PostItem post={opPost} index={0} isOp={true} />
                    )}

                    {/* Replies */}
                    {replies.length > 0 ? (
                        replies.map((post, index) => (
                            <PostItem key={post.id} post={post} index={index} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-12 border-t border-white/5">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No replies yet. Be the first to reply!</p>
                        </div>
                    )}

                    {/* Reply Box */}
                    <ReplyBox threadId={id} />
                </div>
            </section>
        </div>
    );
}
