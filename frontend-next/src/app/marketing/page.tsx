'use client';

import React from 'react';
import { Badge, Button, SectionHeading } from '@/components/UI';
import { TrendingUp, Users, Monitor, Globe, Zap, Layout, PieChart, CheckCircle, BarChart3, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketingPage() {
    return (
        <div className="bg-[var(--bg-body)] text-gray-300 min-h-screen font-sans">
            {/* Unified Cinematic Hero */}
            <div className="relative pt-32 pb-20 border-b border-[var(--border-subtle)] overflow-hidden">
                <div className="absolute inset-0 bg-[var(--bg-body)]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tech-red/5 rounded-full blur-[120px]"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-6 rounded-full mb-6 glass-dark shadow-glow glow-red"
                    >
                        <TrendingUp className="w-16 h-16 text-tech-red drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-black mb-6 font-manrope leading-tight text-white tracking-tighter">
                        Connect With The <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-red to-orange-500">Core Gamer</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
                        We don&apos;t just reach gamers; we influence the enthusiasts <br className="hidden md:block" /> who build PCs, pre-order collectors&apos; editions, and shape the industry.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-tech-red hover:bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2 justify-center">
                            <span className="fill-current">Download Media Kit</span> <span className="opacity-50">2025</span>
                        </button>
                        <button className="glass-dark border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Stats Strip */}
            <div className="border-b border-white/5 bg-[var(--bg-body)]/50 backdrop-blur-md relative z-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                        {[
                            { val: "2.5M+", label: "Monthly Uniques" },
                            { val: "8.2M", label: "Pageviews" },
                            { val: "12m", label: "Avg. Session" },
                            { val: "85%", label: "PC Enthusiasts" }
                        ].map((stat, i) => (
                            <div key={i} className="pl-8 first:pl-0">
                                <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">{stat.val}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-tech-red">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Audience Demographics */}
            <div className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-manrope mb-4 text-white">The TechPlay Audience</h2>
                    <p className="text-gray-400 text-lg">Affluent, technical, and highly engaged.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Age Breakdown */}
                    <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-premium">
                        <h3 className="font-black text-xl mb-8 flex items-center gap-3 text-white"><Users className="text-blue-500" /> Age Distribution</h3>
                        <div className="space-y-6">
                            {[
                                { label: "18-24", val: "25%" },
                                { label: "25-34", val: "45%", active: true },
                                { label: "35-44", val: "20%" },
                                { label: "45+", val: "10%" }
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide text-gray-400"><span>{item.label}</span> <span className="text-white">{item.val}</span></div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.active ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} style={{ width: item.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hardware Ownership */}
                    <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-premium">
                        <h3 className="font-black text-xl mb-8 flex items-center gap-3 text-white"><Monitor className="text-green-500" /> Tech Specs</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Own a Desktop PC", val: "92%" },
                                { label: "Plan to update GPU", val: "64%" },
                                { label: "Own a Console", val: "78%" },
                                { label: "Monthly Game Spend", val: "$60+" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-[var(--border-subtle)] hover:border-white/10 transition-colors">
                                    <span className="text-sm font-bold text-gray-300">{item.label}</span>
                                    <span className="font-black text-green-400">{item.val}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Geo Location */}
                    <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-premium">
                        <h3 className="font-black text-xl mb-8 flex items-center gap-3 text-white"><Globe className="text-purple-500" /> Global Reach</h3>
                        <div className="flex items-center justify-center py-6 relative">
                            <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full"></div>
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                                    <circle cx="16" cy="16" r="16" className="fill-purple-900/30" />
                                    <circle cx="16" cy="16" r="10" className="fill-[#0b1120]" />
                                    <path d="M16 16 L32 16 A16 16 0 0 1 16 32 z" className="fill-purple-500" />
                                    <path d="M16 16 L16 32 A16 16 0 0 1 0 16 z" className="fill-purple-600" />
                                    <path d="M16 16 L0 16 A16 16 0 0 1 16 0 z" className="fill-purple-400" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-3xl font-black text-white">Global</span>
                                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Reach</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-wider mt-6">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-400 rounded-full"></div> North America</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Europe</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-600 rounded-full"></div> UK</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-900 rounded-full"></div> Asia Pacific</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted Partners Marquee */}
            <div className="py-16 border-y border-[var(--border-subtle)] bg-black/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-transparent to-[#0b1120] z-10 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-8">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Trusted by Industry Leaders</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                        {["NVIDIA", "ASUS ROG", "CORSAIR", "CD PROJEKT", "SAMSUNG", "LOGITECH"].map(brand => (
                            <span key={brand} className="text-3xl font-black font-manrope text-white hover:text-tech-red transition-colors cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ad Products */}
            <div className="py-24 container mx-auto px-4">
                <SectionHeading title="Advertising Solutions" subtitle="High-impact formats that respect the player experience." className="text-white" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                    <div className="group glass-dark rounded-3xl overflow-hidden border border-white/10 hover:border-tech-red/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="h-72 bg-gray-900/50 relative flex items-center justify-center border-b border-[var(--border-subtle)]">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-tech-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-4/5 h-4/5 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center text-gray-500 font-mono text-xs flex-col gap-2 relative z-10 bg-[var(--bg-body)]/80 backdrop-blur-sm">
                                <Layout size={32} className="mb-2 text-gray-400 group-hover:text-tech-red transition-colors" />
                                <span className="font-bold tracking-widest">SITE SKIN / TAKEOVER</span>
                            </div>
                        </div>
                        <div className="p-10">
                            <h3 className="text-3xl font-black mb-4 text-white">Homepage Takeover</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">Own the entire viewport. Includes background skin, billboard header, and interstitial video. The ultimate brand statement.</p>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-tech-red" /> <span className="font-medium">100% Share of Voice (SOV)</span></li>
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-tech-red" /> <span className="font-medium">Highest CTR Format (3.5% avg)</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="group glass-dark rounded-3xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="h-72 bg-gray-900/50 relative flex items-center justify-center border-b border-[var(--border-subtle)]">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex gap-6 relative z-10">
                                <div className="w-24 h-32 border-2 border-dashed border-gray-700 rounded-xl bg-[var(--bg-body)]/80 backdrop-blur-sm"></div>
                                <div className="w-48 h-32 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-500 font-mono text-xs bg-[var(--bg-body)] shadow-2xl scale-110 border-green-500/30">
                                    <span className="font-bold tracking-widest group-hover:text-green-400 transition-colors">NATIVE</span>
                                </div>
                                <div className="w-24 h-32 border-2 border-dashed border-gray-700 rounded-xl bg-[var(--bg-body)]/80 backdrop-blur-sm"></div>
                            </div>
                        </div>
                        <div className="p-10">
                            <h3 className="text-3xl font-black mb-4 text-white">Sponsored Content</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">Editorial-style articles written by our team or yours. Seamlessly integrated into the news feed for maximum authenticity.</p>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-green-500" /> <span className="font-medium">Permanent SEO Value</span></li>
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-green-500" /> <span className="font-medium">Native Look & Feel</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Specs Table */}
                <div className="mt-24 glass-dark rounded-3xl p-10 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
                    <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 text-white flex items-center gap-3">
                        <Target className="text-tech-red" /> Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm z-10 relative">
                        <div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-4">Standard Display</h4>
                            <ul className="space-y-3 text-gray-400 font-mono border-l-2 border-white/10 pl-4">
                                <li>970x250 (Billboard)</li>
                                <li>300x250 (Medium Rect)</li>
                                <li>300x600 (Half Page)</li>
                                <li>728x90 (Leaderboard)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-4">Rich Media</h4>
                            <ul className="space-y-3 text-gray-400 font-mono border-l-2 border-white/10 pl-4">
                                <li>HTML5 / Canvas</li>
                                <li>Video (VAST/VPAID)</li>
                                <li>Max file: 250KB initial</li>
                                <li>Polite Load: to 2.2MB</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-4">Submission</h4>
                            <ul className="space-y-3 text-gray-400 font-mono border-l-2 border-white/10 pl-4">
                                <li>Lead time: 3 Business Days</li>
                                <li>Reporting: 3rd party tracked</li>
                                <li>Creative Review: 24hrs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-tech-red/90 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black mb-8 text-white font-manrope tracking-tighter">Ready to start your campaign?</h2>
                    <p className="text-white/90 text-xl max-w-2xl mx-auto mb-10 font-medium">Our ad ops team is standing by to build a custom package that hits your KPIs.</p>
                    <button className="bg-white text-tech-red px-12 py-5 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-2xl flex items-center gap-2 mx-auto">
                        <Zap size={20} className="fill-current" /> Contact Sales Team
                    </button>
                </div>
            </div>
        </div>
    );
}
