'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/lib/api';

interface SearchResult {
    id: string;
    type: string;
    title: string;
    slug: string;
    image?: string;
    link: string;
}

export function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.length < 2) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const [articles, products] = await Promise.all([
                    api.get('/articles', { params: { search: query, limit: 3 } }).catch(() => ({ data: { data: [] } })),
                    api.get('/products', { params: { search: query, limit: 3 } }).catch(() => ({ data: { data: [] } }))
                ]);

                const formattedArticles = (articles.data?.data || []).map((a: any) => ({
                    id: `article-${a.id}`,
                    type: 'Article',
                    title: a.title,
                    slug: a.slug,
                    image: a.image,
                    link: `/post/${a.slug}`
                }));

                const formattedProducts = (products.data?.data || []).map((p: any) => ({
                    id: `product-${p.id}`,
                    type: 'Product',
                    title: p.name,
                    slug: p.slug || p.id,
                    image: p.image || p.gallery?.[0],
                    link: `/shop/product/${p.id}`
                }));

                setResults([...formattedArticles, ...formattedProducts]);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    return (
        <div className={`relative transition-all duration-300 ${isFocused ? 'w-64 md:w-80' : 'w-48 md:w-64'}`}>
            <div className={`flex items-center bg-white/5 border transition-all duration-300 rounded-full overflow-hidden ${isFocused ? 'border-red-600 bg-white/10 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'border-white/10 hover:border-white/20'}`}>
                <Search className={`ml-4 w-4 h-4 ${isFocused ? 'text-red-500' : 'text-gray-500'}`} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent text-white py-2.5 px-3 text-xs font-bold focus:outline-none placeholder-gray-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                {loading && <Loader2 className="mr-3 h-4 w-4 animate-spin text-red-500" />}
            </div>

            <AnimatePresence>
                {isFocused && query.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full right-0 w-[350px] bg-[#1a202c] border border-white/10 rounded-xl shadow-2xl mt-4 overflow-hidden z-[200]"
                    >
                        <div className="p-2">
                            <h5 className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">Results</h5>
                            {results.length === 0 && !loading && (
                                <div className="px-4 py-2 text-sm text-gray-400">No results found.</div>
                            )}
                            {results.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.link}
                                    className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group/item"
                                >
                                    {item.image && (
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden shadow-sm shrink-0">
                                            <Image src={item.image} alt="" fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-xs text-white truncate group-hover/item:text-red-500">{item.title}</h4>
                                        <span className="text-xs text-gray-500">{item.type}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
