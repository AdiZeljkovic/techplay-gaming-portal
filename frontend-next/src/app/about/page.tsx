'use client';

import React from 'react';
import { SectionHeading, Badge } from '@/components/UI';
import { Users, Target, Shield, Zap, Globe, Award, CheckCircle2, Info, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/common/PageHero';

// Static team data (doesn't require API)
const TEAM_MEMBERS = [
    { name: 'Marcus Steiner', role: 'Editor-in-Chief', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', bio: 'A 20-year veteran of gaming journalism, Marcus has penned over 3,000 reviews and invented our legendary 10-point rating scale.' },
    { name: 'Elena Vasquez', role: 'Performance Lead', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', bio: 'Our resident hardware whisperer. If it runs at less than 144fps, Elena will find out why and make it cry.' },
    { name: 'Kenji Nakamura', role: 'Video Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', bio: 'An award-winning cinematographer who pivoted to gaming content. His video reviews have garnered over 200M cumulative views.' }
];


export default function AboutPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen text-gray-300">
            {/* Unified Cinematic Hero */}
            <PageHero
                icon={Users}
                iconColor="text-tech-red"
                title="We Are "
                titleAccent="TechPlay"
                accentGradient="from-tech-red to-orange-500"
                description={<>The world&apos;s paramount destination for hardcore gaming culture, <br className="hidden md:block" /> precision hardware analysis, and unfiltered journalism.</>}
            />

            {/* Mission Manifesto */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { icon: Shield, title: "Unbiased Integrity", desc: "No paid scores. No sponsored opinions. Our editorial independence is absolute and non-negotiable." },
                        { icon: Zap, title: "Technical Obsession", desc: "We don't just review games; we benchmark the soul out of them. Every frame time, every thermal degree counts." },
                        { icon: Globe, title: "Global Community", desc: "From Berlin to Tokyo, we unite gamers through deep, meaningful discourse and shared passion." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-dark p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:-translate-y-2 group"
                        >
                            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-white group-hover:text-tech-red transition-colors">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 font-manrope">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* The Story - Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
                    <div>
                        <SectionHeading title="Our Odyssey" className="text-white mb-8" />
                        <h2 className="text-4xl font-black text-white mb-6 font-manrope leading-tight">
                            From a garage LAN party to a <span className="text-tech-red">global media powerhouse.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            TechPlay began as a revolt against surface-level gaming journalism. We wanted deeper dives, harsher critiques, and significantly more RGB.
                            What started as three friends arguing about frame rates has evolved into the authority on gaming performance.
                        </p>

                        <div className="space-y-8 pl-8 border-l-2 border-white/10 relative">
                            {[
                                { year: '2021', title: 'The Launch', desc: 'TechPlay.gg goes live. First review (Cyberpunk 2077) crashes the server due to traffic.' },
                                { year: '2022', title: 'The Lab', desc: 'Opened our dedicated Hardware Testing Facility in Berlin for standardized GPU benchmarking.' },
                                { year: '2024', title: 'Expansion', desc: 'Reached 5M monthly unique visitors. Launched TechPlay+ Premium membership.' }
                            ].map((event, i) => (
                                <motion.div
                                    key={i}
                                    className="relative"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-[var(--bg-body)] rounded-full border-4 border-tech-red shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                                    <span className="text-sm font-black text-tech-red uppercase tracking-widest mb-1 block">{event.year}</span>
                                    <h4 className="text-xl font-bold text-white mb-1">{event.title}</h4>
                                    <p className="text-sm text-gray-500">{event.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-tech-red to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                        <div className="relative glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/40 p-6 rounded-2xl text-center">
                                    <div className="text-4xl font-black text-white mb-2">5M+</div>
                                    <div className="text-xs font-bold uppercase text-gray-500 tracking-widest">Monthly Readers</div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-2xl text-center">
                                    <div className="text-4xl font-black text-white mb-2">12k+</div>
                                    <div className="text-xs font-bold uppercase text-gray-500 tracking-widest">Articles Published</div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-2xl text-center">
                                    <div className="text-4xl font-black text-white mb-2">85</div>
                                    <div className="text-xs font-bold uppercase text-gray-500 tracking-widest">Team Members</div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-2xl text-center">
                                    <div className="text-4xl font-black text-white mb-2">3</div>
                                    <div className="text-xs font-bold uppercase text-gray-500 tracking-widest">Continents</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leadership */}
                <SectionHeading title="Editorial Leadership" className="text-white mb-12 text-center" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {TEAM_MEMBERS.map((m, i) => (
                        <motion.div
                            key={m.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group glass-dark rounded-2xl overflow-hidden shadow-premium border border-white/5 hover:border-tech-red/50 transition-all duration-500"
                        >
                            <div className="h-72 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] to-transparent z-10 opacity-80"></div>
                                <img src={m.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" alt={m.name} />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <Badge color="red" className="mb-2 shadow-glow">{m.role}</Badge>
                                    <h4 className="font-black text-2xl text-white">{m.name}</h4>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">{m.bio}</p>
                                <div className="flex gap-3">
                                    {['Twitter/X', 'LinkedIn', 'Steam'].map(social => (
                                        <button key={social} className="text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors border border-white/10 px-3 py-1 rounded hover:bg-white/5">
                                            {social}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Join Us CTA */}
                <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center">
                    <div className="absolute inset-0 bg-tech-red/10"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <Rocket size={48} className="mx-auto text-tech-red mb-6 drop-shadow-glow" />
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6 font-manrope">Join the Vanguard</h3>
                        <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                            We are always scouting for elite wordsmiths, video wizards, and backend sorcerers.
                            Think you have the APM to keep up?
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="bg-tech-red hover:bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                View Careers
                            </button>
                            <button className="glass-dark border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all">
                                Culture Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
