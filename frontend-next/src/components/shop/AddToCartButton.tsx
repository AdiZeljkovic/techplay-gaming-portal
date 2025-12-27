'use client';

import { Product } from '@/lib/types';
import { useCart } from '@/providers/CartProvider';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();

    // Ensure sizes and colors are arrays
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];

    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    return (
        <div className="space-y-6">
            {/* Options */}
            <div className="grid md:grid-cols-2 gap-6">
                {sizes.length > 0 && (
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Select Size</label>
                        <div className="flex gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`min-w-[48px] h-12 px-3 rounded-lg border font-medium transition ${selectedSize === size
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-gray-400 border-white/20 hover:border-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {colors.length > 0 && (
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Select Color</label>
                        <div className="flex gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`h-12 px-4 rounded-lg border font-medium transition ${selectedColor === color
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-gray-400 border-white/20 hover:border-white'
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => addToCart(product, selectedSize, selectedColor)}
                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                </button>
                <button className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-gray-400 hover:text-red-500">
                    <Heart className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
