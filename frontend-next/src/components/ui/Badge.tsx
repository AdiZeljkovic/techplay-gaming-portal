'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface BadgeProps {
    children: React.ReactNode;
    color?: string;
    variant?: 'solid' | 'outline' | 'glow';
    className?: string;
    animated?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    color = 'red',
    variant = 'solid',
    className = '',
    animated = false
}) => {
    const colorClasses: Record<string, string> = {
        red: variant === 'solid'
            ? "bg-red-600 text-white"
            : variant === 'glow'
                ? "bg-red-600/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                : "border border-red-600 text-red-400 bg-transparent",
        blue: variant === 'solid'
            ? "bg-blue-600 text-white"
            : variant === 'glow'
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "border border-blue-600 text-blue-400 bg-transparent",
        gray: "bg-gray-700 text-gray-300",
        dark: "bg-gray-900 text-white",
        purple: variant === 'solid'
            ? "bg-purple-600 text-white"
            : "bg-purple-600/20 text-purple-400 border border-purple-500/50",
        yellow: "bg-yellow-500 text-black",
        green: variant === 'glow'
            ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            : "bg-green-500 text-white",
        cyan: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50",
        outline: "border border-white/20 text-white bg-white/5 backdrop-blur-sm"
    };

    const selectedColor = colorClasses[color] || colorClasses.red;

    return (
        <motion.span
            initial={animated ? { scale: 0.8, opacity: 0 } : false}
            animate={animated ? { scale: 1, opacity: 1 } : false}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${selectedColor} ${animated ? 'animate-pulse' : ''} ${className}`}
        >
            {children}
        </motion.span>
    );
};
