'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/types';

interface RelatedArticlesProps {
    articles: Post[];
    currentSlug: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, currentSlug }) => {
    // Filter out current article and take top 3
    const related = articles.filter(a => a.slug !== currentSlug).slice(0, 3);

    if (related.length === 0) return null;

    return (
        <div className="mt-12 pt-12 border-t border-white/10">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full" />
                Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(article => (
                    <Link key={article.id} href={`/post/${article.slug}`} className="group block h-full">
                        <div className="bg-[#1a202c] border border-white/5 rounded-xl overflow-hidden h-full hover:border-white/10 transition-colors shadow-lg group-hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                            <div className="relative h-40 w-full overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized={article.image?.includes('localhost') || article.image?.includes('127.0.0.1')}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a202c] to-transparent opacity-60" />
                            </div>
                            <div className="p-4">
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2 block">
                                    {article.category}
                                </span>
                                <h4 className="font-bold text-white text-sm leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
