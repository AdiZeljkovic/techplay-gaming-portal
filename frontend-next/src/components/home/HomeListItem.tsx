'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, MessageCircle, Play, ChevronRight } from 'lucide-react';
import { Post } from '@/lib/types';
import { SpotlightCard } from '@/components/UI';


interface HomeListItemProps {
    post: Post;
    accentColor?: string;
    showRating?: boolean;
    compact?: boolean;
    priority?: boolean;
}

export function HomeListItem({ post, accentColor = 'text-red-500', showRating = false, compact = false, priority = false }: HomeListItemProps) {
    const getBadgeColor = () => {
        if (post.tags?.includes('Review')) return 'bg-yellow-500';
        if (post.category === 'Tech') return 'bg-cyan-500';
        return 'bg-red-600';
    };

    const accentBorder = accentColor.replace('text-', 'border-');
    const badgeBg = getBadgeColor();

    return (
        <SpotlightCard
            className={`flex flex-col md:flex-row gap-0 md:gap-6 group bg-[var(--bg-card)] border border-white/5 hover:border-white/10 transition-all rounded-xl overflow-hidden mb-6`}
            spotlightColor={accentColor === 'text-red-500' ? 'rgba(220, 38, 38, 0.15)' : accentColor === 'text-blue-400' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.1)'}
        >
            {/* Image Section - Left Side */}
            <div className="w-full md:w-[280px] lg:w-[320px] aspect-video md:aspect-[16/10] shrink-0 relative overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority={priority}
                    unoptimized={post.image?.includes('localhost') || post.image?.includes('127.0.0.1')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                {/* Rating Badge */}
                {showRating && post.rating !== undefined && (
                    <div className={`absolute bottom-2 right-2 w-8 h-8 ${Number(post.rating) >= 9 ? 'bg-yellow-500' : 'bg-green-500'} text-black rounded-md flex items-center justify-center font-black text-xs shadow-lg border border-white/20 z-10`}>
                        {post.rating}
                    </div>
                )}

                {/* Category Badge (Mobile Only) */}
                <div className="absolute top-2 right-2 md:hidden z-10">
                    <span className={`${badgeBg} text-white text-[10px] py-1 px-2 rounded font-bold uppercase`}>
                        {post.category?.toUpperCase()}
                    </span>
                </div>

                {/* Comment Badge */}
                <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-extrabold px-2 py-1 rounded shadow-lg flex items-center gap-1 z-10">
                    <MessageCircle size={10} className="fill-black" />
                    {post.comments_count || 0}
                </div>

                {/* Video Icon Overlay */}
                {post.category === 'Video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-1 flex flex-col justify-center py-4 px-4 md:px-0 md:pr-6 relative z-10">
                {/* Title & Accent Bar */}
                <div className={`border-l-[4px] ${accentBorder} pl-4 mb-3`}>
                    <Link href={`/post/${post.slug}`}>
                        <h2 className={`text-lg md:text-xl lg:text-2xl font-black text-white leading-tight group-hover:${accentColor} transition-colors font-manrope line-clamp-2`}>
                            {post.title}
                        </h2>
                    </Link>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 pl-5 text-xs mb-3 font-medium">
                    <Link href={`/profile/${post.author.username}`} className={`${accentColor} font-bold uppercase tracking-wide flex items-center gap-1 hover:underline`}>
                        <User size={12} /> {post.author.username}
                    </Link>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 flex items-center gap-1 uppercase tracking-wide">
                        {post.date}
                    </span>
                </div>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 pl-5 md:w-11/12">
                    {post.excerpt}
                </p>
            </div>
        </SpotlightCard>
    );
}
