'use client';

import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/providers/CartProvider';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

import Link from 'next/link';

export default function CartSidebar() {
    const { items, removeFromCart, updateQuantity, total, isOpen, toggleCart, clearCart } = useCart();
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                toggleCart();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, toggleCart]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" /> Your Cart ({items.length})
                            </h2>
                            <button onClick={toggleCart} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <button onClick={toggleCart} className="mt-4 text-red-400 hover:text-red-300 font-bold">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                                        <div className="w-20 h-20 bg-white/5 rounded-lg shrink-0 overflow-hidden relative">
                                            <Image src={item.image} alt={item.name} fill className="object-cover p-2" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white line-clamp-1">{item.name}</h3>
                                            <div className="text-sm text-gray-400 mb-2">
                                                {item.selectedSize && <span className="mr-2">Size: {item.selectedSize}</span>}
                                                {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-white">${item.price}</div>
                                                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-red-400 transition"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-green-400 transition"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-500 hover:text-red-500 self-start p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/20">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-2xl font-black text-white">${total.toFixed(2)}</span>
                                </div>
                                <Link href="/checkout" onClick={toggleCart} className="block w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-600/20 mb-3 text-center">
                                    Checkout
                                </Link>
                                <button onClick={clearCart} className="w-full py-2 text-gray-500 text-sm hover:text-white transition">
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
