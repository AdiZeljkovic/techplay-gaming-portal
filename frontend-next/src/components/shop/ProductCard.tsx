'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/providers/CartProvider';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-red-500/50 transition flex flex-col h-full">
            <Link href={`/shop/product/${product.id}`} className="relative aspect-square block bg-white/5">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover p-4 transition-transform duration-500 group-hover:scale-110"
                />
                {product.isNew && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">NEW</span>
                )}
                {product.isSale && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">SALE</span>
                )}
            </Link>

            <div className="p-4 flex-1 flex flex-col">
                <div className="text-sm text-gray-400 mb-1">{product.category}</div>
                <Link href={`/shop/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition line-clamp-2">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="text-xl font-black text-white">${product.price}</div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="p-2 bg-white/10 text-white rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
