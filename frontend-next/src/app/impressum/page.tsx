'use client';

import React from 'react';
import { SectionHeading, Badge } from '@/components/UI';
import { Scale, Building2, User, FileText, AlertTriangle, Scale as ScaleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/common/PageHero';

export default function ImpressumPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen text-gray-300">
            {/* Unified Cinematic Hero */}
            <PageHero
                icon={ScaleIcon}
                iconColor="text-blue-500"
                title=""
                titleAccent="Impressum"
                accentGradient="from-blue-500 to-indigo-500"
                description="Legal Disclosure according to § 5 TMG"
            />

            <div className="container mx-auto px-4 py-20 max-w-5xl">
                <div className="grid grid-cols-1 gap-8">

                    {/* Service Provider Card */}
                    <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-premium hover:border-blue-500/30 transition-all">
                        <div className="bg-white/5 px-8 py-6 border-b border-[var(--border-subtle)] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <Building2 size={20} />
                            </div>
                            <h2 className="text-white font-black uppercase tracking-wide text-sm">Service Provider</h2>
                        </div>
                        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Company Name</h4>
                                <p className="text-2xl font-black text-white mb-6">TechPlay Media GmbH</p>

                                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Headquarters</h4>
                                <p className="text-gray-300 leading-relaxed font-mono text-sm">
                                    Gaming Street 1337<br />
                                    10115 Berlin<br />
                                    Germany
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Contact</h4>
                                    <div className="text-gray-300 space-y-1 font-mono text-sm">
                                        <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
                                            <span>Phone:</span> <span className="text-white">+49 (0) 30 1234 5678</span>
                                        </div>
                                        <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
                                            <span>Email:</span> <span className="text-white">contact@techplay.gg</span>
                                        </div>
                                        <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
                                            <span>Web:</span> <span className="text-white">www.techplay.gg</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Registration</h4>
                                    <div className="text-gray-300 text-sm">
                                        <span className="block mb-1">Amtsgericht Berlin-Charlottenburg</span>
                                        <span className="bg-white/5 px-2 py-1 rounded text-white font-mono text-xs">HRB 123456</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 pt-6 border-t border-[var(--border-subtle)]">
                                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Tax ID (USt-IdNr.)</h4>
                                <p className="text-gray-400 text-sm mb-2">Sales tax identification number according to § 27 a sales tax law:</p>
                                <span className="font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded text-sm">DE 123 456 789</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Representatives */}
                        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-premium hover:border-white/20 transition-all">
                            <div className="bg-white/5 px-8 py-6 border-b border-[var(--border-subtle)] flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <h2 className="text-white font-black uppercase tracking-wide text-sm">Representatives</h2>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-500 text-xs uppercase font-bold mb-4">Management Board</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-white font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Alexander Vance (CEO)
                                    </li>
                                    <li className="flex items-center gap-3 text-white font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Sarah Jenkins (CTO)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Editorial Responsibility */}
                        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-premium hover:border-white/20 transition-all">
                            <div className="bg-white/5 px-8 py-6 border-b border-[var(--border-subtle)] flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-white font-black uppercase tracking-wide text-sm">Editorial</h2>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-500 text-xs uppercase font-bold mb-4">Resp. acc. to § 55 Abs. 2 RStV</p>
                                <p className="font-black text-white text-xl mb-1">Alex Vance</p>
                                <p className="text-gray-400 text-sm font-mono">Gaming Street 1337<br />10115 Berlin</p>
                            </div>
                        </div>
                    </div>

                    {/* Dispute Resolution */}
                    <div className="glass-dark rounded-3xl border border-white/10 p-8 flex items-start gap-4">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-white font-bold mb-2">Dispute Resolution</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                The European Commission provides a platform for online dispute resolution (OS):
                                <a href="https://ec.europa.eu/consumers/odr" className="text-blue-400 hover:text-blue-300 ml-1 underline">orders.europa.eu</a>.
                            </p>
                            <p className="text-xs text-gray-500 uppercase font-bold">
                                We are not willing or obliged to participate in dispute settlement proceedings before a consumer arbitration board.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
