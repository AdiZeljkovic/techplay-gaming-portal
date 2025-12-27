'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, Send, ArrowRight, Mail, Sparkles, Heart, CheckCircle } from 'lucide-react';
import { ActiveUsersCounter } from '../ActiveUsersCounter';
import api from '@/lib/api';

// Custom Social Icons matching Header
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

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await api.post('/newsletter', { email });
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <footer className="bg-[var(--bg-surface)] text-white pt-20 pb-10 mt-0 border-t border-[var(--border-subtle)] relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-surface)] via-[var(--bg-body)] to-[var(--bg-surface)] pointer-events-none" />

            {/* Decorative gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-tech-red/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Top gradient line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-tech-red/50 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Newsletter Hero Section - Premium */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl p-8 md:p-12 mb-20 overflow-hidden group"
                >
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-tech-red via-purple-600 to-tech-red rounded-3xl animate-gradient bg-[length:200%_100%]" />

                    {/* Inner content */}
                    <div className="relative m-[2px] bg-[var(--bg-surface)] rounded-[22px] p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Glow effect */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-tech-red/10 rounded-full blur-[100px] group-hover:bg-tech-red/20 transition-colors duration-1000" />

                        <div className="relative z-10 max-w-lg">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tech-red/10 border border-tech-red/30 text-tech-red rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                <Sparkles size={12} className="animate-pulse" />
                                Weekly Newsletter
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black font-manrope mb-3">Don&apos;t Miss a Beat</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">Get the top stories, exclusive reviews, and hardware deals delivered to your inbox every Friday. No spam, just pure gaming content.</p>
                        </div>

                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center w-full lg:w-auto p-8 bg-green-500/10 rounded-2xl border border-green-500/20 text-center relative z-10">
                                <CheckCircle size={48} className="text-green-500 mb-4" />
                                <h4 className="text-xl font-bold text-white mb-2">You&apos;re on the list!</h4>
                                <p className="text-green-400 text-sm">Thanks for subscribing. Keep an eye on your inbox.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 relative z-10">
                                <div className="relative flex-1">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email..."
                                        className="w-full sm:w-80 bg-white/5 border border-white/10 text-white pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:border-tech-red focus:bg-white/10 transition-all font-medium placeholder-gray-500"
                                        required
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === 'loading'}
                                    className={`bg-tech-red hover:bg-[#b91c1c] text-white font-black uppercase tracking-wider px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {status === 'loading' ? 'Joining...' : 'Subscribe'}
                                    {status !== 'loading' && <ArrowRight size={16} />}
                                </motion.button>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-11 h-11 bg-tech-red flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform duration-300">
                                <Gamepad2 className="text-white" size={22} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-2xl font-black tracking-tighter leading-none text-white">
                                    TECH<span className="text-tech-red">PLAY</span>
                                </span>
                                <span className="text-[9px] font-bold tracking-[0.25em] text-gray-500 uppercase group-hover:text-gray-300 transition-colors leading-none mt-0.5">
                                    Gaming Portal
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium mb-8 max-w-sm">
                            The world&apos;s premier destination for gaming news, reviews, and culture.
                            Built by obsessive gamers for obsessive gamers.
                            We dissect the pixels so you don&apos;t have to.
                        </p>
                        <div className="flex gap-2">
                            <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-black hover:text-white text-gray-400 rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent" title="X (Twitter)"><XIcon size={14} /></a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-[#1877F2] hover:text-white text-gray-400 rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent" title="Facebook"><FacebookIcon size={14} /></a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white text-gray-400 rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent" title="Instagram"><InstagramIcon size={14} /></a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-[#FF0000] hover:text-white text-gray-400 rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent" title="YouTube"><YouTubeIcon size={14} /></a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-black hover:text-white text-gray-400 rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent" title="TikTok"><TikTokIcon size={14} /></a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-[#0A66C2] hover:text-white text-gray-400 rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent" title="LinkedIn"><LinkedInIcon size={14} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-manrope font-extrabold uppercase tracking-widest mb-6 text-xs text-gray-500">Explore</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-bold">
                            {['News', 'Reviews', 'Hardware', 'Videos', 'Guides'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-tech-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-manrope font-extrabold uppercase tracking-widest mb-6 text-xs text-gray-500">Community</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-bold">
                            {['Forums', 'Merch Store', 'Support Us', 'Advertise'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-tech-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-manrope font-extrabold uppercase tracking-widest mb-6 text-xs text-gray-500">Legal</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-bold">
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact', href: '/contact' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Terms of Service', href: '/terms' },
                                { name: 'Impressum', href: '/impressum' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-tech-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wide">
                    <div className="flex items-center gap-6">
                        <p className="flex items-center gap-1 normal-case tracking-normal font-medium">
                            Made with <Heart size={12} className="text-tech-red fill-tech-red mx-0.5 animate-pulse" /> by
                            <a href="https://www.luminor.solutions" target="_blank" rel="noreferrer" className="text-white hover:text-tech-red transition-colors font-bold ml-1">Luminor.solutions</a>
                            <span className="ml-1 opacity-60">© 2025</span>
                        </p>
                        <div className="hidden md:flex items-center gap-2 ml-4 border-l border-white/10 pl-4">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                            <span className="text-green-400 text-[10px]">All Systems Operational</span>
                        </div>
                        <div className="hidden md:flex ml-4 border-l border-white/10 pl-4">
                            <ActiveUsersCounter />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                        <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
                        <Link href="/admin" className="text-gray-600 hover:text-tech-red transition-colors">Staff Area</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
