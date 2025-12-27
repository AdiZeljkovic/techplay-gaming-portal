'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { commentService } from '@/lib/commentService';
import { Comment } from '@/lib/types';
import { MessageSquare, ThumbsUp, Reply, MoreVertical, Send } from 'lucide-react';
import Image from 'next/image';

interface CommentsSectionProps {
    postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
    const { isAuthenticated, user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<number | null>(null);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        try {
            const data = await commentService.getComments(postId);
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, parentId: number | null = null) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const comment = await commentService.createComment(postId, newComment, parentId);
            if (parentId) {
                // Find parent and add reply
                setComments(prev => prev.map(c => {
                    if (c.id === parentId) {
                        return { ...c, replies: [...(c.replies || []), comment] };
                    }
                    return c;
                }));
                setReplyTo(null);
            } else {
                setComments(prev => [comment, ...prev]);
            }
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : 'mb-6'}`}>
            <div className={`relative shrink-0 ${isReply ? 'w-8 h-8' : 'w-10 h-10'}`}>
                <Image
                    src={comment.user.avatar || 'https://ui-avatars.com/api/?name=User'}
                    alt={comment.user.username}
                    fill
                    className="rounded-full object-cover border border-white/10"
                />
            </div>
            <div className="flex-1">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{comment.user.username}</span>
                            {comment.user.role !== 'User' && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 uppercase font-bold">
                                    {comment.user.role}
                                </span>
                            )}
                            <span className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{comment.body}</p>
                </div>

                <div className="flex items-center gap-4 mt-2 pl-2">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                        Like
                    </button>
                    {!isReply && (
                        <button
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id as number)}
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition"
                        >
                            <Reply className="w-3.5 h-3.5" /> Reply
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {replyTo === comment.id && (
                    <form onSubmit={(e) => handleSubmit(e, comment.id as number)} className="mt-4 flex gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-white/5 overflow-hidden relative">
                            {user?.avatar && <Image src={user.avatar} alt="You" fill className="object-cover" />}
                        </div>
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-red-500"
                                autoFocus
                            />
                            <button
                                disabled={isSubmitting || !newComment.trim()}
                                className="p-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4">
                        {comment.replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <section className="mt-12 pt-12 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-red-500" />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {isAuthenticated ? (
                <div className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 shrink-0 overflow-hidden relative border border-white/10">
                            {user?.avatar ? (
                                <Image src={user.avatar} alt={user.username} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="What are your thoughts?"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm min-h-[100px] mb-3"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newComment.trim()}
                                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-10 p-8 rounded-xl bg-gradient-to-r from-red-600/10 to-orange-500/10 border border-red-500/20 text-center">
                    <p className="text-gray-300 mb-4">You must be logged in to join the discussion.</p>
                    {/* Links could go here */}
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading discussion...</div>
            ) : comments.length > 0 ? (
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 italic">
                    No comments yet. Be the first to share your thoughts!
                </div>
            )}
        </section>
    );
}
