'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Home, Globe, Cpu, Gamepad2, Users, ShoppingBag,
    ChevronRight, ExternalLink, Map, Scale
} from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';

interface SitemapSectionProps {
    title: string;
    icon: any;
    links: { name: string; path: string }[];
}

const SitemapSection: React.FC<SitemapSectionProps> = ({ title, icon: Icon, links }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-dark p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-white/10 transition-colors"
    >
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-tech-red">
                <Icon size={20} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">{title}</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((link) => (
                <li key={link.path}>
                    <Link
                        href={link.path}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronRight size={14} className="text-gray-600 group-hover:text-tech-red transition-colors" />
                        <span className="font-bold text-sm">{link.name}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </motion.div>
);

export default function SitemapPage() {
    const sections = [
        {
            title: "Main Content",
            icon: Globe,
            links: [
                { name: "Home", path: "/" },
                { name: "News Room", path: "/category/news" },
                { name: "Reviews", path: "/category/reviews" },
                { name: "Hardware Lab", path: "/category/tech" },
                { name: "Videos", path: "/video" },
                { name: "Guides", path: "/guides" },
                { name: "Games Database", path: "/games" },
                { name: "Release Calendar", path: "/calendar" }
            ]
        },
        {
            title: "Community",
            icon: Users,
            links: [
                { name: "Forums", path: "/forum" },
                { name: "User Profile", path: "/profile" },
                { name: "Search", path: "/search" },
                { name: "Our Team", path: "/about#team" }
            ]
        },
        {
            title: "Shop & Services",
            icon: ShoppingBag,
            links: [
                { name: "Merch Store", path: "/shop" },
                { name: "Cart", path: "/cart" },
                { name: "Support Us", path: "/support" }
            ]
        },
        {
            title: "Legal & Corporate",
            icon: Scale,
            links: [
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Impressum", path: "/impressum" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Cookie Policy", path: "/cookies" },
                { name: "Accessibility", path: "/accessibility" },
                { name: "Advertising / Media Kit", path: "/marketing" },
                { name: "Review Scale", path: "/how-we-rate" }
            ]
        }
    ];

    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            <PageHero
                icon={Map}
                iconColor="text-purple-400"
                title=""
                titleAccent="Sitemap"
                accentGradient="from-purple-500 to-pink-500"
                description="Overview of all pages on TechPlay.gg"
            />


            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-tech-red/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">


                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {sections.map((section) => (
                        <SitemapSection key={section.title} {...section} />
                    ))}
                </div>

                {/* Footer Link */}
                <div className="mt-20 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest">
                        <Home size={14} /> Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
