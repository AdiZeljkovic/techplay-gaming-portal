'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Post } from '@/lib/types';
import { Button } from '../UI';

interface FeaturedCarouselProps {
    items: Post[];
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = items.slice(0, 7);

    useEffect(() => {
        if (isPaused || slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length, isPaused]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

    if (slides.length === 0) {
        return (
            <div className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-[#0b1120] flex items-center justify-center">
                <div className="relative z-10 text-center p-8 glass-dark rounded-2xl border border-white/10 shadow-2xl mx-4">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-200 mb-2">No Featured Content</h1>
                    <p className="text-gray-500">Check back later for top stories.</p>
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            </div>
        );
    }

    const activeSlide = slides[currentIndex];

    // Card animation variants
    const cardVariants = {
        active: { scale: 1.05, opacity: 1, y: 0, boxShadow: "0 20px 50px -10px rgba(0,0,0,0.5)" },
        inactive: { scale: 0.95, opacity: 0.5, y: 10, boxShadow: "none" }
    };

    return (
        <div
            className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-[#0b1120] flex flex-col justify-center group/carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* 1. Cinematic Background Layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={activeSlide.image}
                        alt=""
                        fill
                        className="object-cover blur-2xl opacity-40 saturate-150"
                        priority
                        unoptimized={activeSlide.image?.includes('localhost') || activeSlide.image?.includes('127.0.0.1')}
                    />
                    {/* complex gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/60 to-transparent" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                </motion.div>
            </AnimatePresence>

            {/* Background Noise Texture */}
            <div className="absolute inset-0 z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

            {/* 2. Main Content Container */}
            <div className="container mx-auto px-4 relative z-10 flex flex-col h-full justify-center md:justify-end pb-12 md:pb-20 pt-24">

                {/* Text Content */}
                <div className="mb-0 md:mb-12 max-w-4xl pl-2 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSlide.id + "-text"}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-r from-transparent via-black/10 to-transparent md:bg-none p-4 md:p-0 rounded-xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none"
                        >
                            <Link href={`/post/${activeSlide.slug}`} className="block group/title">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white font-manrope leading-[1.1] mb-4 md:mb-8 group-hover/title:text-transparent group-hover/title:bg-clip-text group-hover/title:bg-gradient-to-r group-hover/title:from-white group-hover/title:to-gray-400 transition-all duration-300 drop-shadow-2xl md:line-clamp-3 line-clamp-4 tracking-tight">
                                    {activeSlide.title}
                                </h1>
                            </Link>

                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                <Link href={`/post/${activeSlide.slug}`}>
                                    <Button variant="primary" size="lg" className="shadow-2xl shadow-red-600/20 group-hover/carousel:shadow-red-600/40 px-8 min-w-max">
                                        <span className="flex items-center gap-2 whitespace-nowrap">
                                            Read Article <ChevronRight size={18} strokeWidth={3} />
                                        </span>
                                    </Button>
                                </Link>

                                {/* Progress Bar / Timer Indicator */}
                                {!isPaused && (
                                    <div className="h-1 bg-white/10 w-24 rounded-full overflow-hidden">
                                        <motion.div
                                            key={currentIndex}
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 6, ease: "linear" }}
                                            className="h-full bg-white/50"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 3. Carousel Cards / Thumbnails */}
                <div className="relative w-full pl-2 mt-8 md:mt-0 hidden md:block">

                    {/* Thumbnails Row */}
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-4 scrollbar-hide mask-fade-right">
                        {slides.map((slide, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <motion.div
                                    key={slide.id}
                                    layout
                                    onClick={() => setCurrentIndex(index)}
                                    variants={cardVariants}
                                    animate={isActive ? 'active' : 'inactive'}
                                    whileHover={{ y: -5, opacity: 1 }}
                                    className={`relative flex-shrink-0 w-[160px] md:w-[200px] aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-xl border border-white/5 transition-colors duration-300 ${isActive ? 'ring-2 ring-red-500/80' : 'hover:border-white/20'}`}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 160px, 200px"
                                        unoptimized={slide.image?.includes('localhost') || slide.image?.includes('127.0.0.1')}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                                    {/* Card Content */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full pointer-events-none">
                                        <p className={`font-bold leading-tight text-sm line-clamp-3 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                            {slide.title}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
