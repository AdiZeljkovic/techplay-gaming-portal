'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search, User, ChevronDown, Gamepad2, Flame,
    Monitor, Video, ArrowRight, Menu, Radio, Briefcase, MessageCircle, Star, Medal, Crown, Layers, Zap, BarChart2, PenTool, Mail, Lock, Globe, MessageSquare, ShoppingCart, X, Ghost
} from 'lucide-react';
import { Button } from '../UI';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';
import { GlobalSearch } from '../common/GlobalSearch';
import CartSidebar from '@/components/shop/CartSidebar';

// Custom SVG Icons for social platforms
const XIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const InstagramIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);
const TikTokIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);
const YouTubeIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);
const FacebookIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);
const LinkedInIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);


export const Header = () => {
    const { openLogin } = useAuthModal();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { itemCount, toggleCart } = useCart();
    const { user, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };



    const navLinks = [
        {
            name: 'News',
            path: '/category/news',
            hasMega: true,
            subCategories: [
                { name: 'Gaming', path: '/news/gaming', icon: Gamepad2, color: 'text-blue-400' },
                { name: 'Console', path: '/news/consoles', icon: Radio, color: 'text-purple-400' },
                { name: 'PC', path: '/news/pc', icon: Monitor, color: 'text-green-400' },
                { name: 'Movies & TV', path: '/news/movies', icon: Video, color: 'text-yellow-400' },
                { name: 'Industry', path: '/news/industry', icon: Briefcase, color: 'text-gray-400' },
                { name: 'E-sport', path: '/news/esports', icon: Flame, color: 'text-red-500' },
                { name: 'Opinions', path: '/news/opinions', icon: MessageCircle, color: 'text-indigo-400' }
            ]
        },
        {
            name: 'Reviews',
            path: '/category/reviews',
            hasMega: true,
            subCategories: [
                { name: 'Latest', path: '/reviews/latest', icon: Star, color: 'text-yellow-500' },
                { name: "Editor's Choice", path: '/reviews/editors-choice', icon: Medal, color: 'text-red-500' },
                { name: 'AAA Titles', path: '/reviews/aaa', icon: Crown, color: 'text-purple-500' },
                { name: 'Indie Gems', path: '/reviews/indie', icon: Layers, color: 'text-green-500' },
                { name: 'Retro', path: '/reviews/retro', icon: Ghost, color: 'text-red-500' }
            ]
        },
        {
            name: 'Tech',
            path: '/tech',
            hasMega: true,
            subCategories: [
                { name: 'News', path: '/tech/news', icon: Zap, color: 'text-yellow-400' },
                { name: 'Reviews', path: '/tech/reviews', icon: BarChart2, color: 'text-blue-500' },
                { name: 'Guides', path: '/tech/guides', icon: PenTool, color: 'text-green-500' }
            ]
        },
        { name: 'Video', path: '/video' },
        { name: 'Guides', path: '/guides' },
        { name: 'Calendar', path: '/calendar' },
        { name: 'Database', path: '/games' },
        { name: 'Forum', path: '/forum' },
        { name: 'Shop', path: '/shop' },
    ];

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-[50] font-manrope transition-all duration-300 ${scrolled ? 'glass-dark shadow-premium border-b border-[var(--border-subtle)] py-0' : 'bg-transparent py-2'}`}>

                {/* 1. Top Utility Bar */}
                <motion.div
                    className="bg-[var(--bg-body)] text-white border-b border-[var(--border-subtle)] relative z-[51] overflow-hidden"
                    initial={false}
                    animate={{ height: scrolled ? 0 : 40, opacity: scrolled ? 0 : 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className="container mx-auto px-4 h-full flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex gap-6 text-gray-400">
                            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
                            <Link href="/marketing" className="hover:text-white transition-colors text-tech-red">Marketing</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                            <Link href="/how-we-rate" className="hover:text-white transition-colors">Our Rating System</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <a href="#" className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-black hover:text-white text-gray-400 rounded transition-all duration-300" title="X (Twitter)"><XIcon size={12} /></a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-[#1877F2] hover:text-white text-gray-400 rounded transition-all duration-300" title="Facebook"><FacebookIcon size={12} /></a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white text-gray-400 rounded transition-all duration-300" title="Instagram"><InstagramIcon size={12} /></a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-[#FF0000] hover:text-white text-gray-400 rounded transition-all duration-300" title="YouTube"><YouTubeIcon size={12} /></a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-black hover:text-white text-gray-400 rounded transition-all duration-300" title="TikTok"><TikTokIcon size={12} /></a>
                                <a href="#" className="w-6 h-6 flex items-center justify-center bg-white/5 hover:bg-[#0A66C2] hover:text-white text-gray-400 rounded transition-all duration-300" title="LinkedIn"><LinkedInIcon size={12} /></a>
                            </div>
                            <div className="w-px h-3 bg-white/10"></div>



                            <button onClick={toggleCart} className="relative flex items-center gap-1 hover:text-tech-red transition-colors">
                                <ShoppingCart size={12} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-tech-red text-white text-[8px] font-black rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Login/Register - show different UI based on auth state */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Link href="/profile" className="flex items-center gap-2 hover:text-tech-red transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-tech-red flex items-center justify-center">
                                            <User size={10} className="text-white" />
                                        </div>
                                        <span className="text-gray-300">{user?.name?.split(' ')[0] || 'Profile'}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-tech-red transition-colors text-[10px] font-bold uppercase"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button onClick={openLogin} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-tech-red/20 border border-white/10 hover:border-tech-red/50 rounded transition-all">
                                    <User size={12} /> <span>Sign In / Register</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* 2. Main Navbar */}
                <div className={`relative transition-all duration-500 z-[50] ${scrolled ? 'bg-[var(--bg-surface)]/80 backdrop-blur-md py-3 border-b border-[var(--border-subtle)]' : 'bg-[var(--bg-surface)] py-5'}`}>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex items-center justify-between gap-8">

                            {/* Logo - Clean red square */}
                            <Link href="/" className="flex items-center gap-3 group shrink-0">
                                <div className={`bg-[#dc2626] flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform duration-300 ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`}>
                                    <Gamepad2 className="text-white" size={scrolled ? 18 : 22} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className={`font-black tracking-tighter leading-none text-white transition-all ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                                        TECH<span className="text-[#ef4444]">PLAY</span>
                                    </span>
                                    <span className={`text-[9px] font-bold tracking-[0.25em] text-gray-500 uppercase group-hover:text-gray-300 transition-colors leading-none mt-0.5 ${scrolled ? 'hidden' : 'block'}`}>
                                        Gaming Portal
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden xl:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <div
                                        key={link.name}
                                        className="relative group h-full"
                                        onMouseEnter={() => setHoveredNav(link.name)}
                                        onMouseLeave={() => setHoveredNav(null)}
                                    >
                                        <Link
                                            href={link.path}
                                            prefetch={true}
                                            className={`px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 border border-transparent
                                ${pathname?.includes(link.path) ? 'text-white bg-white/10 border-[var(--border-subtle)] shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                             `}
                                        >
                                            {link.name}
                                            {link.hasMega && <ChevronDown size={10} className="opacity-50 group-hover:rotate-180 transition-transform duration-300" />}
                                        </Link>

                                        {/* Mega Menu Dropdown */}
                                        <AnimatePresence>
                                            {link.hasMega && hoveredNav === link.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15, rotateX: -10 }}
                                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                    exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[280px] z-[60] perspective-1000"
                                                >
                                                    <div className="bg-[var(--bg-surface)]/95 backdrop-blur-xl rounded-xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden p-1 relative ring-1 ring-black/50">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                                        <div className="flex relative z-10 bg-[#0b1120] rounded-lg overflow-hidden">
                                                            {/* Categories List */}
                                                            <div className="w-full py-2 bg-[#080d1a]">
                                                                {link.subCategories?.map((sub: any, i) => {
                                                                    const Icon = sub.icon as any;
                                                                    return (
                                                                        <Link key={i} href={sub.path || link.path} className="flex items-center gap-3 px-6 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 hover:border-l-2 hover:border-tech-red transition-all group/item">
                                                                            <Icon size={14} className={`${sub.color || 'text-gray-500'} group-hover/item:text-white transition-colors`} />
                                                                            {sub.name}
                                                                        </Link>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </nav>

                            {/* Right Side: Search & CTA */}
                            <div className="flex items-center gap-4">
                                {/* Search Bar */}
                                <GlobalSearch />

                                {/* Support Button - Clean red, no shadow */}
                                <Link href="/support" className="hidden md:block">
                                    <button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                                        Support Us
                                    </button>
                                </Link>

                                {/* Mobile Menu Toggle */}
                                <button className="xl:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <Menu size={24} />
                                </button>
                            </div>
                        </div>
                    </div >
                </div >
            </header >

            <CartSidebar />

            {/* Spacer */}
            <div className="h-[124px] bg-[var(--bg-body)]"></div>


        </>
    );
};
