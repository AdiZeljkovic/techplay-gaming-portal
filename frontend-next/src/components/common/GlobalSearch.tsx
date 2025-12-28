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

        <motion.div
            className="relative z-50"
            initial={false}
            animate={{ width: isFocused ? 320 : 220 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div
                className={`flex items-center transition-all duration-300 rounded-full overflow-hidden border ${isFocused
                    ? 'bg-black/80 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
            >
                <Search className={`ml-4 w-4 h-4 transition-colors duration-300 ${isFocused ? 'text-red-500' : 'text-gray-400'}`} />
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
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 w-[400px] bg-[#0f1219]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl mt-4 overflow-hidden"
                    >
                        <div className="p-2">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 mb-2">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Results</h5>
                                <span className="text-[9px] text-gray-600 font-mono">{results.length} found</span>
                            </div>

                            {results.length === 0 && !loading && (
                                <div className="px-4 py-8 text-center">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <Search className="text-gray-600 opacity-50" size={20} />
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">No results found</p>
                                    <p className="text-xs text-gray-600 mt-1">Try searching for something else</p>
                                </div>
                            )}

                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-1">
                                {results.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.link}
                                        className="flex items-center gap-3 p-2 hover:bg-white/5 hover:border-l-2 hover:border-red-500 border-l-2 border-transparent transition-all group/item rounded-r-lg"
                                    >
                                        {item.image ? (
                                            <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border border-white/10 group-hover/item:border-red-500/30 transition-colors">
                                                <Image src={item.image} alt="" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-gray-700 group-hover/item:bg-red-500 transition-colors" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xs text-gray-200 truncate group-hover/item:text-red-400 transition-colors">{item.title}</h4>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{item.type}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
