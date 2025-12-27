'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Comment } from '@/lib/types';
import { commentService } from '@/lib/commentService';
import { Avatar } from '@/components/UI'; // Assuming we exported Avatar from UI.tsx
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, MoreHorizontal, Reply, Trash2, Edit2, Send, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentsSectionProps {
    postId: string; // or number depending on backend
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<string | number | null>(null); // Parent comment ID
    const [replyBody, setReplyBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await commentService.getComments(postId);
            setComments(data);
        } catch (err) {
            console.error('Failed to load comments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return; // Should prompt login
        if (!newComment.trim()) return;

        try {
            const added = await commentService.createComment(postId, newComment);
            setComments(prev => [added, ...prev]);
            setNewComment('');
        } catch (err) {
            setError('Failed to post comment.');
        }
    };

    const handleReply = async (parentId: string | number) => {
        if (!user || !replyBody.trim()) return;

        try {
            const added = await commentService.createComment(postId, replyBody, parentId as number);
            // Ideally we re-fetch or insert recursively. Re-fetching for simplicity or flat list logic.
            // If API returns nested structure, we might need to find parent and push to replies.
            // Assuming flat list or reload.
            loadComments();
            setReplyTo(null);
            setReplyBody('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (commentId: string | number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            if (commentService.deleteComment) {
                await commentService.deleteComment(commentId);
                // Remove from state
                setComments(prev => removeCommentFromState(prev, commentId));
            }
        } catch (err) {
            console.error('Failed to delete comment', err);
            alert('Failed to delete comment');
        }
    };

    // Helper to remove comment recursively
    const removeCommentFromState = (list: Comment[], id: string | number): Comment[] => {
        return list.filter(c => {
            if (c.id === id) return false;
            if (c.replies) {
                c.replies = removeCommentFromState(c.replies, id);
            }
            return true;
        });
    };

    // Recursive render for threaded comments
    const renderComment = (comment: Comment, depth = 0) => {
        const isEditing = false; // Add edit logic later

        return (
            <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 ${depth > 0 ? 'ml-8 md:ml-12 border-l-2 border-white/5 pl-4' : ''}`}
            >
                <div className="flex gap-4">
                    <div className="shrink-0">
                        <Avatar src={comment.user.avatar} alt={comment.user.username} size="md" />
                    </div>
                    <div className="flex-1">
                        <div className="bg-[#1a202c] border border-white/5 rounded-xl p-4 relative group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-sm">{comment.user.name || comment.user.username}</span>
                                    <span className="text-[10px] text-gray-500">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                                </div>
                                {(user?.id === comment.user.id || user?.role === 'Admin') && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => handleDelete(comment.id)} className="text-gray-500 hover:text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.body}</p>

                            {/* Actions */}
                            <div className="mt-3 flex items-center gap-4 border-t border-white/5 pt-2">
                                <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">
                                    <Heart size={14} />
                                    {comment.likes_count > 0 && comment.likes_count} Like
                                </button>
                                <button
                                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-400 transition-colors"
                                >
                                    <MessageCircle size={14} /> Reply
                                </button>
                            </div>
                        </div>

                        {/* Reply Form */}
                        <AnimatePresence>
                            {replyTo === comment.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-3 overflow-hidden"
                                >
                                    <div className="flex gap-3">
                                        <div className="shrink-0 text-gray-500">
                                            <CornerDownRight size={16} />
                                        </div>
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={replyBody}
                                                onChange={(e) => setReplyBody(e.target.value)}
                                                placeholder="Write your reply..."
                                                className="flex-1 bg-[#0F1623] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleReply(comment.id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Render nested replies if any */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4">
                        {comment.replies.map(reply => renderComment(reply, depth + 1))}
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div id="comments" className="mt-12 pt-12 border-t border-white/10">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full" />
                Discussion <span className="text-gray-500">({comments.length})</span>
            </h3>

            {/* Main Input */}
            {user ? (
                <div className="flex gap-4 mb-10">
                    <div className="shrink-0">
                        <Avatar src={user.avatar} size="md" />
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1">
                        <div className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What are your thoughts?"
                                className="w-full bg-[#1a202c] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px] resize-y"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute bottom-3 right-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-[#1a202c] border border-white/10 rounded-xl p-6 text-center mb-10">
                    <p className="text-gray-400 mb-4">Please log in to join the discussion.</p>
                    <a href="/login" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Log In</a>
                </div>
            )}

            {loading ? (
                <div className="text-center py-10">
                    <div className="inline-block w-8 h-8 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-2">
                    {comments.map(comment => renderComment(comment))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    Be the first to share your thoughts!
                </div>
            )}
        </div>
    );
};
