'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Settings } from 'lucide-react';
import Link from 'next/link';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('techplay_cookie_consent');
        if (!consent) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('techplay_cookie_consent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('techplay_cookie_consent', 'false');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-4 left-4 right-4 md:left-8 md:bottom-8 md:right-auto md:max-w-md z-[999]"
                >
                    <div className="bg-[#1a202c]/95 backdrop-blur-xl border-l-4 border-red-600 p-6 rounded-r-lg shadow-2xl text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center border border-red-600/50">
                                    <Cookie size={16} />
                                </div>
                                <h4 className="font-black uppercase tracking-wider text-sm">Cookie Settings</h4>
                            </div>

                            <p className="text-sm text-gray-300 leading-relaxed mb-6">
                                We use cookies to personalize content, analyze traffic, and ensure you get the best gaming experience.
                                By continuing, you agree to our use of cookies.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 glow-red"
                                >
                                    <ShieldCheck size={14} /> Accept All
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                                    >
                                        Necessary Only
                                    </button>
                                    <Link href="/cookies" className="bg-white/5 hover:bg-white/10 text-gray-300 p-3 border border-white/10 flex items-center justify-center">
                                        <Settings size={16} />
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 text-[10px] text-gray-500 text-center">
                                Read our <Link href="/cookies" className="text-gray-400 hover:text-white underline">Cookie Policy</Link> and <Link href="/privacy" className="text-gray-400 hover:text-white underline">Privacy Policy</Link>.
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
