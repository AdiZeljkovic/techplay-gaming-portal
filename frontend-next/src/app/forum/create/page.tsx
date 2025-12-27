'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { forumService } from '@/lib/forumService';
import { PageHero } from '@/components/common/PageHero';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateThreadPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        category_id: '',
        body: '',
        tags: ''
    });

    useEffect(() => {
        // Fetch categories for the dropdown
        async function fetchCats() {
            try {
                const cats = await forumService.getCategories();
                // Flatten categories if needed, or just show main/sub
                // For simplified UX, let's just show all available categories
                // A recursive function might be needed if nesting is deep, but let's assume 2 levels max as per seeder
                const flattened: any[] = [];
                cats.forEach(c => {
                    flattened.push(c);
                    if (c.children) {
                        c.children.forEach(child => flattened.push({ ...child, name: `-- ${child.name}` }));
                    }
                });
                setCategories(flattened);
            } catch (e) {
                console.error("Failed to load categories", e);
            }
        }
        fetchCats();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const thread = await forumService.createThread({
                title: formData.title,
                category_id: formData.category_id,
                body: formData.body,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            });
            router.push(`/forum/thread/${thread.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create thread');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            <PageHero
                iconName="Plus"
                title="Create "
                titleAccent="Thread"
                description="Start a new discussion with the community."
            />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Link href="/forum" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition">
                    <ChevronLeft className="w-4 h-4" /> Back to Forum
                </Link>

                <div className="glass-dark border border-[var(--border-subtle)] rounded-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Topic Title
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                                placeholder="What's on your mind?"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Category
                            </label>
                            <select
                                required
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition appearance-none"
                            >
                                <option value="">Select a Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Content
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                                placeholder="Write your post here..."
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Tags (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                                placeholder="Comma separated (e.g., rpg, pc, help)"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-xl transition shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Creating...' : 'Post Thread'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
