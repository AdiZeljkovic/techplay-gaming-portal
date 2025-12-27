'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forumService } from '@/lib/forumService';
import { Loader2, Send } from 'lucide-react';

interface ReplyBoxProps {
    threadId: string;
}

export function ReplyBox({ threadId }: ReplyBoxProps) {
    const router = useRouter();
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;

        setLoading(true);
        setError('');

        try {
            await forumService.replyToThread(threadId, body);
            setBody('');
            router.refresh(); // Refresh server component to show new post
        } catch (err: any) {
            setError('Failed to post reply. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 mt-8">
            <h3 className="text-white font-bold mb-4">Post a Reply</h3>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] mb-4"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !body.trim()}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Post Reply
                    </button>
                </div>
            </form>
        </div>
    );
}
