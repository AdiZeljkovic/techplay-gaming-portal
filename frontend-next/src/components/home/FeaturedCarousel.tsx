'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Post } from '@/lib/types';

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

    if (slides.length === 0) return null;

    const activeSlide = slides[currentIndex];

    const cardVariants = {
        active: { scale: 1.1, opacity: 1, zIndex: 10, y: -10 },
        inactive: { scale: 0.95, opacity: 0.5, zIndex: 1, y: 0 }
    };

    return (
        <div
            className="relative h-[700px] w-full overflow-hidden bg-[#0b1120] flex flex-col justify-center group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Dynamic Background Layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={activeSlide.image}
                        alt=""
                        fill
                        className="object-cover blur-2xl scale-125 opacity-30 saturate-150"
                        priority
                        unoptimized={activeSlide.image?.includes('localhost') || activeSlide.image?.includes('127.0.0.1')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/40 to-[#0b1120]/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-[#0b1120]/60 to-transparent" />
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Background Pattern */}
            <div className="absolute inset-0 z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10 flex flex-col h-full justify-center md:justify-end pb-12 md:pb-20 pt-32">
                {/* Active Slide Info */}
                <div className="mb-12 max-w-4xl pl-2">
                    <motion.div
                        key={activeSlide.id + "-text"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Link href={`/post/${activeSlide.slug}`} className="block group/title">
                            <h1 className="text-4xl md:text-6xl font-black text-white font-manrope leading-[1.1] mb-6 group-hover/title:text-transparent group-hover/title:bg-clip-text group-hover/title:bg-gradient-to-r group-hover/title:from-white group-hover/title:to-gray-400 transition-all duration-300 drop-shadow-2xl line-clamp-3">
                                {activeSlide.title}
                            </h1>
                        </Link>

                        <p className="text-gray-300 text-lg md:text-xl line-clamp-2 max-w-2xl mb-8 font-medium leading-relaxed drop-shadow-lg">
                            {activeSlide.excerpt}
                        </p>

                        <div className="flex items-center gap-6">
                            <Link
                                href={`/post/${activeSlide.slug}`}
                                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-lg text-sm hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-red-500/50 hover:scale-105"
                            >
                                Read Article <ChevronRight size={16} strokeWidth={3} />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Carousel Cards */}
                <div className="relative w-full pl-2">
                    {/* Navigation Buttons */}
                    <div className="absolute -top-16 right-0 flex gap-2">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Cards Row */}
                    <div className="flex gap-4 overflow-visible pb-4 pt-4">
                        {slides.map((slide, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <motion.div
                                    key={slide.id}
                                    layout
                                    onClick={() => setCurrentIndex(index)}
                                    variants={cardVariants}
                                    animate={isActive ? 'active' : 'inactive'}
                                    className={`relative flex-shrink-0 w-[160px] md:w-[200px] aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-2xl relative ${isActive ? 'ring-2 ring-red-500/50 shadow-red-500/20' : ''}`}
                                >
                                    <Link href={`/post/${slide.slug}`} className="block w-full h-full">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover"
                                            unoptimized={slide.image?.includes('localhost') || slide.image?.includes('127.0.0.1')}
                                        />
                                    </Link>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                                    {/* Card Content */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full pointer-events-none">
                                        {isActive && (
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 6, ease: "linear", repeat: 0 }}
                                                key={currentIndex}
                                                className="h-0.5 w-full bg-red-500 mb-3 shadow-[0_0_10px_#ef4444]"
                                            />
                                        )}
                                        <p className={`font-bold leading-tight text-sm line-clamp-3 ${isActive ? 'text-white' : 'text-gray-400'}`}>
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
