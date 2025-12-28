'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
    light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, icon, action, className = '', light = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-10 group ${className}`}
    >
        <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-4">
                {/* Animated accent bar */}
                <div className="relative">
                    <div className="h-10 w-1.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:h-12 transition-all duration-300" />
                    <div className="absolute inset-0 h-10 w-1.5 bg-red-600 rounded-full blur-sm opacity-50 group-hover:h-12 transition-all duration-300" />
                </div>

                <div className="flex items-center gap-3">
                    {icon && <span className="text-red-500">{icon}</span>}
                    <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-red-500 transition-colors ${light ? 'text-gray-900' : 'text-white'}`}>
                        {title}
                    </h2>
                </div>
            </div>

            {action && <div>{action}</div>}
        </div>

        {subtitle && (
            <p className="text-gray-500 text-base font-medium pl-6 mb-4">{subtitle}</p>
        )}

        {/* Animated line */}
        <div className={`h-[2px] ${light ? 'bg-gray-200' : 'bg-white/10'} relative overflow-hidden rounded-full`}>
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600/50 via-red-600 to-red-600/50"
            />
        </div>
    </motion.div>
);
