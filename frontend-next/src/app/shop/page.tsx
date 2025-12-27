'use client';

import { useState, useEffect } from 'react';
import { shopService } from '@/lib/shopService';
import ProductCard from '@/components/shop/ProductCard';
import { ShoppingBag, Shirt, Crown, Sparkles, ArrowRight, Heart, Star, Leaf, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/common/PageHero';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';

const categories = [
    { name: 'All', icon: ShoppingBag, color: 'bg-gray-500' },
    { name: 'Hoodies', icon: Shirt, color: 'bg-blue-500' },
    { name: 'T-Shirts', icon: Shirt, color: 'bg-green-500' },
    { name: 'Headwear', icon: Crown, color: 'bg-purple-500' },
];

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await shopService.getProducts(
                    activeCategory !== 'All' ? activeCategory : undefined
                );
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory]);

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* PageHero */}
            <PageHero
                icon={ShoppingBag}
                iconColor="text-pink-400"
                title="The "
                titleAccent="Shop"
                accentGradient="from-pink-400 to-orange-500"
                description="Premium gaming lifestyle apparel. Engineered for comfort, designed for the street."
            />

            {/* Category Buttons */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.name}
                            whileHover={{ y: -5 }}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`group flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all ${activeCategory === cat.name ? 'bg-pink-500 text-white border-pink-500 shadow-[0_5px_20px_-5px_rgba(236,72,153,0.4)]' : 'glass-dark text-white border-[var(--border-subtle)] hover:border-white/20'}`}
                        >
                            <div className={`w-8 h-8 ${cat.color} bg-opacity-20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <cat.icon size={16} className="text-white" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest">{cat.name}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Featured Drop (Only on All) */}
                {activeCategory === 'All' && (
                    <div className="glass-dark rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden mb-16 flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 relative h-80 lg:h-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"
                                alt="Featured Collection"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">Limited Edition</span>
                            </div>
                        </div>
                        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-[var(--bg-surface-secondary)] to-[var(--bg-body)]">
                            <div className="flex items-center gap-2 text-gray-400 font-black uppercase tracking-widest text-xs mb-4">
                                <Sparkles size={14} className="text-yellow-500" /> Season 01
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4">The &quot;RGB God&quot; Collection</h3>
                            <p className="text-gray-400 mb-8 text-lg leading-relaxed">Embrace the spectrum. Our new line features reactive prints and ultra-soft combed cotton designed for the marathon streamer.</p>
                            <button className="bg-[#ef4444] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all flex items-center gap-3 group transform hover:-translate-y-1 w-fit">
                                View Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                            {activeCategory === 'All' ? 'Trending Gear' : `${activeCategory} Collection`}
                        </h2>
                        <span className="text-sm font-bold text-gray-400">Showing {products.length} Items</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <Link href={`/shop/product/${product.id}`} key={product.id} className="group glass-dark rounded-xl border border-[var(--border-subtle)] overflow-hidden hover:shadow-[0_0_25px_rgba(220,38,38,0.2)] hover:border-red-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                    <div className="aspect-[4/5] relative overflow-hidden bg-[var(--bg-surface-secondary)]">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-opacity duration-500 group-hover:opacity-80 group-hover:scale-105"
                                        />
                                        {product.isNew && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-md">New</span>
                                            </div>
                                        )}
                                        {product.isSale && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">Sale</span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                                            <button className="flex-1 bg-[#ef4444] text-white font-bold py-2.5 rounded shadow-lg hover:bg-red-600 transition-colors text-[10px] uppercase tracking-widest">Add to Cart</button>
                                            <button className="bg-white p-2.5 rounded shadow-lg hover:text-red-500 transition-colors"><Heart size={16} className="text-black" /></button>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">{product.category}</div>
                                        <h3 className="font-bold text-white leading-tight mb-2 group-hover:text-red-500 transition-colors">{product.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="font-black text-lg text-white">${product.price.toFixed(2)}</span>
                                            <div className="flex text-yellow-400 text-xs gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-600"} />
                                                ))}
                                                <span className="ml-1 text-gray-500 font-medium">({product.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quality Promise Footer */}
                <div className="mt-24 border-t border-white/10 pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <Shirt size={48} className="text-red-500" />
                            </div>
                            <h4 className="font-black uppercase text-white mb-2">Premium Materials</h4>
                            <p className="text-sm text-gray-400 max-w-xs">400gsm fleece and combed cotton. Designed to last through infinite wash cycles.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <Leaf size={48} className="text-red-500" />
                            </div>
                            <h4 className="font-black uppercase text-white mb-2">Eco-Friendly Ink</h4>
                            <p className="text-sm text-gray-400 max-w-xs">Water-based prints that don&apos;t crack, peel, or feel like plastic on your chest.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <Globe size={48} className="text-red-500" />
                            </div>
                            <h4 className="font-black uppercase text-white mb-2">Global Shipping</h4>
                            <p className="text-sm text-gray-400 max-w-xs">From Berlin to Tokyo. Tracked shipping for every order, anywhere.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
