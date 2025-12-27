'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/types';

interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, size?: string, color?: string) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    isOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, size?: string, color?: string) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id && item.selectedSize === size && item.selectedColor === color
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
        });
        setIsOpen(true);
    };

    const removeFromCart = (productId: number) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setItems((currentItems) =>
            currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                isOpen,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
