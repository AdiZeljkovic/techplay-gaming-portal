'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Accessibility, Check, Mail, Phone, Layers, Keyboard, Eye, Monitor, Type } from 'lucide-react';
import { Button } from '@/components/UI';
import { PageHero } from '@/components/common/PageHero';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="glass-dark p-6 rounded-xl border border-white/5 hover:border-tech-red/30 transition-all duration-300 group">
        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-tech-red/20 group-hover:text-tech-red transition-colors text-gray-400">
            <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
);

export default function AccessibilityPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 bg-green-900/10 w-full h-[600px] blur-[100px] -z-10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">

                <PageHero
                    icon={Accessibility}
                    iconColor="text-green-400"
                    title=""
                    titleAccent="Accessibility Statement"
                    accentGradient="from-green-400 to-teal-500"
                    description="Gaming is for everyone. TechPlay.gg is committed to ensuring digital accessibility for people with disabilities."
                />

                {/* WCAG Commitment */}
                <div className="mb-20">
                    <div className="glass-dark p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-white mb-4">Our Commitment</h2>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    We rely on the Web Content Accessibility Guidelines (WCAG) 2.1 to ensure our content is accessible to a wide range of people with disabilities, including blindness and low vision, deafness and hearing loss, learning disabilities, cognitive limitations, limited movement, speech disabilities, photosensitivity, and combinations of these.
                                </p>
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-bold text-sm">
                                    <Check size={16} />
                                    Targeting WCAG 2.1 Level AA conformance
                                </div>
                            </div>
                            <div className="w-full md:w-1/3">
                                {/* Visual Score/Chart or Graphic */}
                                <div className="aspect-square rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-white mb-2">98%</div>
                                        <div className="text-xs font-bold uppercase text-gray-500 tracking-widest">Lighthouse Score</div>
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-4">
                                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#333" strokeWidth="8" />
                                        <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="283" strokeDashoffset="10" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-20">
                    <h2 className="text-2xl font-black text-white mb-8 border-l-4 border-green-500 pl-4 uppercase">Implemented Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Keyboard}
                            title="Keyboard Navigation"
                            description="Full keyboard support for all interactive elements, ensuring users can navigate without a mouse."
                        />
                        <FeatureCard
                            icon={Eye}
                            title="High Contrast"
                            description="Text and UI elements meet recognized contrast ratios to assist users with low vision."
                        />
                        <FeatureCard
                            icon={Monitor}
                            title="Responsive Layout"
                            description="Content reflows and adapts to different screen sizes and zoom levels up to 200%."
                        />
                        <FeatureCard
                            icon={Layers}
                            title="Semantic HTML"
                            description="Proper heading hierarchy and ARIA landmarks to assist screen readers in understanding structure."
                        />
                        <FeatureCard
                            icon={Type}
                            title="Legible Typography"
                            description="Use of clear, sans-serif fonts with adequate spacing and line height for readability."
                        />
                        <FeatureCard
                            icon={Monitor}
                            title="Reduced Motion"
                            description="Respects system preferences for reduced motion to prevent vestibular disorders."
                        />
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="glass-dark p-8 md:p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-black text-white mb-4">Feedback & Assistance</h2>
                        <p className="text-gray-400 mb-8">
                            We welcome your feedback on the accessibility of TechPlay.gg. Please let us know if you encounter accessibility barriers on our site.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="mailto:accessibility@techplay.gg" className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group">
                                <Mail size={20} className="text-gray-400 group-hover:text-white" />
                                <span className="font-bold text-white">accessibility@techplay.gg</span>
                            </a>
                            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                <Phone size={20} className="text-gray-400" />
                                <span className="font-bold text-white">+49 30 1234 5678</span>
                            </div>
                        </div>
                        <p className="mt-8 text-xs text-gray-500 font-bold uppercase tracking-widest">
                            Response time: Within 2 business days
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
