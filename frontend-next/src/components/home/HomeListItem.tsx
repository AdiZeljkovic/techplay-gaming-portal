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

    return (
        <SpotlightCard
            className={`flex flex-col ${compact ? 'md:flex-row' : 'md:flex-row'} gap-6 group p-4 border-white/5 hover:border-white/10 transition-all mb-6`}
            spotlightColor={accentColor === 'text-red-500' ? 'rgba(220, 38, 38, 0.15)' : accentColor === 'text-blue-400' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.1)'}
        >
            {/* Image Section */}
            <div className={`w-full ${compact ? 'md:w-[240px]' : 'md:w-[280px] lg:w-[320px]'} aspect-video ${compact ? 'md:aspect-video' : 'md:aspect-[16/10]'} shrink-0 relative rounded-xl overflow-hidden`}>
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
                    <div className={`absolute bottom-2 right-2 w-8 h-8 ${Number(post.rating) >= 9 ? 'bg-yellow-500' : 'bg-green-500'} text-black rounded-md flex items-center justify-center font-black text-xs shadow-lg border border-white/20`}>
                        {post.rating}
                    </div>
                )}

                {/* Video Badge */}
                {post.category === 'Video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                        </div>
                    </div>
                )}

                {/* Comment Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-black text-[10px] font-black px-2 py-1 rounded shadow-lg flex items-center gap-1 z-10">
                    <MessageCircle size={10} className="fill-current" />
                    {post.views % 20}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col pt-1 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <span className={`${getBadgeColor()} text-white text-[10px] py-0.5 px-2 rounded-full font-bold uppercase`}>
                            {post.category?.toUpperCase() || 'NEWS'}
                        </span>
                        {post.subcategory && (
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">• {post.subcategory}</span>
                        )}
                    </div>
                </div>

                <Link href={`/post/${post.slug}`}>
                    <h2 className={`${compact ? 'text-lg' : 'text-xl lg:text-2xl'} font-black text-white mb-2 leading-tight group-hover:text-red-500 transition-colors font-manrope line-clamp-2`}>
                        {post.title}
                    </h2>
                </Link>

                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
                    <span className={`${accentColor} flex items-center gap-1`}>
                        <User size={12} /> {post.author.username}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.date}
                    </span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 md:w-11/12">
                    {post.excerpt}
                </p>

                {/* Mobile Read More */}
                <div className="md:hidden mt-4 pt-4 border-t border-white/5">
                    <Link href={`/post/${post.slug}`} className={`text-xs font-black uppercase tracking-widest ${accentColor} hover:underline flex items-center gap-1`}>
                        Read More <ChevronRight size={12} />
                    </Link>
                </div>
            </div>
        </SpotlightCard>
    );
}
