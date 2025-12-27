'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ForumPost } from '@/lib/types';
import { Reply, Flag, MoreVertical, Edit2, Trash2, Save, X } from 'lucide-react';
import { forumService } from '@/lib/forumService'; // We might need an edit service method later

interface PostItemProps {
    post: ForumPost;
    index: number;
    isOp?: boolean;
}

export function PostItem({ post, index, isOp = false }: PostItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(post.content);
    // In a real app, we check currentUser.id === post.user.id
    // For now, let's assume if we are editing, we are authorized (backend will enforce anyway)

    // We can simulate "can edit" by checking if we are logged in? 
    // Since we don't have global auth state in this component easily without context, 
    // we'll rely on the fact that if this is a "real" implementation, we'd wrap this.
    // Ideally we pass `canEdit` prop from parent.

    const handleSave = async () => {
        try {
            await forumService.updatePost(post.id, content);
            setIsEditing(false);
            // In a real app with SWR/React Query this would auto-update. 
            // Here we rely on local state update which is already done via 'content' mapping, 
            // but we should probably trigger a refresh or update parent.
            // For now, simpler: local content is displayed if we switch view mode? 
            // Actually 'content' state is the draft. We should probably update the prop or refresh.
            // Let's reload the page for consistency for now, or assume local update.
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert('Failed to update post');
        }
    };

    return (
        <div className="flex gap-4 group">
            {/* Author Side */}
            <div className="hidden md:block w-48 shrink-0">
                <div className={`bg-white/5 border border-white/10 rounded-xl p-4 text-center ${isOp ? 'sticky top-24' : ''}`}>
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gray-700 overflow-hidden mb-3 ${isOp ? 'w-20 h-20 ring-4 ring-white/5' : ''}`}>
                        {post.user.avatar ? (
                            <Image src={post.user.avatar} alt={post.user.username} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                                {post.user.username[0]}
                            </div>
                        )}
                    </div>
                    <div className="font-bold text-white text-sm truncate">{post.user.username}</div>
                    <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">{post.user.role}</div>
                    <div className="text-[10px] text-gray-500">Level {post.user.level || 1}</div>
                </div>
            </div>

            {/* Content Side */}
            <div className="flex-1">
                <div className={`bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 relative ${isOp ? 'md:p-8' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-3">
                        <span className="text-xs text-gray-600 font-mono">#{isOp ? '1' : index + 2}</span>
                        <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-white transition">
                            <Edit2 size={14} />
                        </button>
                    </div>

                    {isEditing ? (
                        <div className="mb-6">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-4 text-white min-h-[200px]"
                            />
                            <div className="flex gap-2 mt-2 justify-end">
                                <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs font-bold text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={handleSave} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-gray-300 mb-6 whitespace-pre-wrap text-sm">
                            {post.content}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-xs text-gray-500">
                            Posted on {new Date(post.date).toLocaleString()}
                        </div>
                        <div className="flex gap-3">
                            {!isOp && (
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white transition">
                                    <Reply className="w-3 h-3" /> Reply
                                </button>
                            )}
                            {isOp && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm text-white font-bold transition">
                                    <Reply className="w-4 h-4" /> Reply
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
