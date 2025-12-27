'use client';

import { motion } from 'framer-motion';
import {
    Star, Medal, Crown, Layers, Ghost, MessageSquare, Cpu, Bell,
    MessageCircle, Gamepad2, MonitorPlay, BookOpen, ShoppingBag,
    Calendar, Database, HelpCircle, Mail, Info, FileText, Shield,
    Accessibility, Cookie, Scale, Heart, LucideIcon, Flame, Radio,
    Monitor, Video, Briefcase, Trophy, PenTool
} from 'lucide-react';

// Icon mapping to avoid passing functions from Server to Client components
const iconMap: Record<string, LucideIcon> = {
    Star, Medal, Crown, Layers, Ghost, MessageSquare, Cpu, Bell,
    MessageCircle, Gamepad2, MonitorPlay, BookOpen, ShoppingBag,
    Calendar, Database, HelpCircle, Mail, Info, FileText, Shield,
    Accessibility, Cookie, Scale, Heart, Flame, Radio, Monitor,
    Video, Briefcase, Trophy, PenTool
};

interface PageHeroProps {
    iconName?: string;
    icon?: LucideIcon; // Keep for backward compatibility
    iconColor?: string;
    title: string;
    titleAccent?: string;
    accentGradient?: string;
    description: string | React.ReactNode;
}

export function PageHero({
    iconName,
    icon: IconProp,
    iconColor = 'text-yellow-400',
    title,
    titleAccent,
    accentGradient = 'from-yellow-400 to-orange-500',
    description
}: PageHeroProps) {
    // Use iconName lookup or fall back to direct icon prop
    const Icon = iconName ? iconMap[iconName] : IconProp;

    return (
        <div className="relative py-24 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Icon */}
                {Icon && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center justify-center mb-8"
                    >
                        <div className="relative">
                            <div className={`absolute inset-0 ${iconColor.replace('text-', 'bg-').split(' ')[0]}/20 blur-xl rounded-full`} />
                            <Icon className={`w-16 h-16 ${iconColor} drop-shadow-lg relative z-10`} />
                        </div>
                    </motion.div>
                )}

                {/* Title */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6 font-manrope tracking-tight leading-tight"
                >
                    {title}
                    {titleAccent && (
                        <span className={`${iconColor} inline-block decoration-clone`}>
                            {titleAccent}
                        </span>
                    )}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light"
                >
                    {description}
                </motion.p>
            </div>
        </div>
    );
}
