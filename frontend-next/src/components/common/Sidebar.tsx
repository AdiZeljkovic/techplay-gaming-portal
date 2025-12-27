'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Flame, TrendingUp, Users, Zap, ChevronRight } from 'lucide-react';
import { Post, ForumThread } from '@/lib/types';

interface SidebarProps {
    latestNews: Post[];
    mostRead: Post[];
    forumThreads: ForumThread[];
}

export default function Sidebar({ latestNews, mostRead, forumThreads }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

    const displayPosts = activeTab === 'latest' ? latestNews : mostRead;

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <aside className="w-full lg:w-[340px] space-y-6 sticky top-24 h-fit flex-shrink-0">
            {/* 1. Widget: Tabbed News - Glass Effect */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                {/* Tab Header */}
                <div className="flex border-b border-white/10 relative">
                    {(['latest', 'popular'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all relative flex items-center justify-center gap-2 ${activeTab === tab ? 'text-red-500 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab === 'latest' ? <Zap size={12} /> : <TrendingUp size={12} />}
                            {tab === 'latest' ? 'Quick News' : 'Most Read'}
                        </button>
                    ))}
                    {/* Indicator */}
                    <motion.div
                        className="absolute bottom-0 h-[2px] bg-gradient-to-r from-red-600 to-orange-500"
                        animate={{
                            width: '50%',
                            left: activeTab === 'latest' ? '0%' : '50%'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                <div className="divide-y divide-white/5 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'latest' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === 'latest' ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {displayPosts.slice(0, 5).map((post, i) => (
                                <Link
                                    href={`/post/${post.slug}`}
                                    key={post.id || i}
                                    className="flex gap-4 p-4 group hover:bg-white/5 transition-all duration-300"
                                >
                                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow border border-white/10">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                                        />
                                        {/* Rank badge for Most Read */}
                                        {activeTab === 'popular' && (
                                            <div className="absolute top-0 left-0 bg-black/60 backdrop-blur w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white z-10 rounded-br-lg">
                                                {i + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-red-500 uppercase mb-1 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-500 rounded-full" />
                                            {post.category}
                                        </span>
                                        <h5 className="text-sm font-bold leading-tight text-gray-200 group-hover:text-red-400 transition-colors line-clamp-2">{post.title}</h5>
                                        {activeTab === 'popular' && (
                                            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                                <TrendingUp size={10} /> {post.views} views
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <Link
                    href="/category/news"
                    className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 border-t border-white/10 transition-colors group"
                >
                    View All News
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* 2. Widget: Discord */}
            <a
                href="#"
                className="block rounded-2xl overflow-hidden group relative bg-[#5865F2] hover:bg-[#4752C4] transition-colors shadow-lg transform hover:-translate-y-1 duration-300"
            >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                <div className="absolute -bottom-6 -right-6 text-black/10 transform rotate-12">
                    <MessageSquare size={120} />
                </div>

                <div className="p-6 relative z-10 text-center">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <MessageSquare className="text-white fill-white" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Join the Squad</h3>
                    <p className="text-white/80 text-xs font-bold mb-6 px-4 leading-relaxed">
                        Exclusive giveaways, LFG channels, and tech support.
                    </p>

                    <div className="bg-white text-[#5865F2] py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 group-hover:shadow-lg transition-all">
                        <Users size={14} /> Connect Discord
                    </div>
                </div>
            </a>

            {/* 3. Widget: Forum Activity */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                                <MessageSquare size={16} className="text-red-500" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Forum Activity</h3>
                        </div>
                        <span className="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Live
                        </span>
                    </div>

                    <div className="space-y-4">
                        {forumThreads.length > 0 ? (
                            forumThreads.slice(0, 5).map((thread, idx) => (
                                <motion.div
                                    key={thread.id || idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={`/forum/thread/${thread.id}`}
                                        className="block group border-l-2 border-white/10 pl-4 hover:border-red-500 transition-colors py-1"
                                    >
                                        <h5 className="text-sm font-bold text-gray-200 group-hover:text-red-500 transition-colors truncate">{thread.title}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">General</span>
                                            <span className="text-[10px] text-gray-600">•</span>
                                            <span className="text-[10px] text-gray-500">
                                                New
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-xs italic text-center py-4">No recent activity</div>
                        )}
                    </div>
                </div>

                <Link
                    href="/forum"
                    className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 border-t border-white/10 transition-colors group bg-white/5"
                >
                    Join Discussion
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </aside>
    );
}
