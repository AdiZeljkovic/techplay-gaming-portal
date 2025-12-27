'use client';

import React from 'react';
import { SectionHeading, Badge } from '@/components/UI';
import { Star, Check, XCircle, AlertTriangle, Medal, Monitor, BookOpen, Gamepad2, Sparkles, Scale, Heart, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/common/PageHero';

export default function HowWeRatePage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen text-gray-300">
            {/* Unified Cinematic Hero */}
            <PageHero
                icon={Star}
                iconColor="text-yellow-500"
                title="The TechPlay "
                titleAccent="Verdict"
                accentGradient="from-yellow-400 to-orange-500"
                description={<>Our reviews are promises of quality, independence, and exhaustive testing. <br className="hidden md:block" /> We play it so you don&apos;t have to guess.</>}
            />

            <div className="container mx-auto px-4 py-24 max-w-5xl">

                {/* The Scale */}
                <SectionHeading title="The 10-Point Scale" subtitle="We use the full spectrum. A 7 is good. A 5 is average." className="text-white mb-16" />

                <div className="space-y-6 mb-32">
                    {/* 10 - Masterpiece */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-tech-red/50 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-tech-red"></div>
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-24 h-24 shrink-0 flex items-center justify-center rounded-2xl font-black text-5xl text-white bg-tech-red shadow-[0_0_30px_rgba(220,38,38,0.4)] relative">
                                10
                                <Sparkles className="absolute -top-2 -right-2 text-yellow-300 fill-yellow-300 animate-pulse" size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-3xl text-white uppercase tracking-tight mb-2 flex items-center gap-3">Masterpiece <Badge color="yellow">Essential</Badge></h3>
                                <p className="text-gray-400 text-lg leading-relaxed">A genre-defining experience. Virtually flawless execution that pushes the medium forward. Essential playing for everyone, regardless of genre preference.</p>
                            </div>
                        </div>
                    </div>

                    {/* 9 - Amazing */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl font-black text-4xl text-white bg-red-500 shadow-glow">9</div>
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">Amazing</h3>
                                <p className="text-gray-400 leading-relaxed">Incredible execution with only minor nitpicks. A must-play title that delivers a memorable experience.</p>
                            </div>
                        </div>
                    </div>

                    {/* 8 - Great */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500"></div>
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl font-black text-4xl text-white bg-green-500">8</div>
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">Great</h3>
                                <p className="text-gray-400 leading-relaxed">An excellent game with some noticeable flaws that hold it back from greatness, but still highly recommended.</p>
                            </div>
                        </div>
                    </div>

                    {/* 7 - Good */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-green-600/50 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-600"></div>
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl font-black text-4xl text-white bg-green-600">7</div>
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">Good</h3>
                                <p className="text-gray-400 leading-relaxed">Solid, enjoyable, but lacks innovation or polish. Worth playing for fans of the genre, but wait for a sale if you&apos;re unsure.</p>
                            </div>
                        </div>
                    </div>

                    {/* 6-5 - Mediocre */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500"></div>
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="flex flex-col gap-2 shrink-0">
                                <div className="w-20 h-10 flex items-center justify-center rounded-t-xl font-black text-2xl text-black bg-yellow-500">6</div>
                                <div className="w-20 h-10 flex items-center justify-center rounded-b-xl font-black text-2xl text-black bg-yellow-600">5</div>
                            </div>
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">Mediocre / Okay</h3>
                                <p className="text-gray-400 leading-relaxed">Functional but forgettable. Might have decent ideas marred by poor execution, or just exists without soul.</p>
                            </div>
                        </div>
                    </div>

                    {/* 4-1 - Bad */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-gray-500/50 transition-colors opacity-75 hover:opacity-100">
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-600"></div>
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                            <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl font-black text-4xl text-white bg-gray-600">4-1</div>
                            <div>
                                <h3 className="font-black text-2xl text-white uppercase tracking-tight mb-2">Bad to Broken</h3>
                                <p className="text-gray-400 leading-relaxed">Significant technical issues, fundamental design flaws, or offensive content. Avoid at all costs.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Criteria */}
                <div className="mb-32">
                    <SectionHeading title="How We Test" subtitle="Every review is based on hours of hands-on experience." className="text-white mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-dark p-8 rounded-3xl border border-white/10">
                            <Gamepad2 className="text-blue-500 mb-4" size={32} />
                            <h4 className="font-black text-xl text-white mb-2">Gameplay Loop</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Is it fun? Are the controls responsive? Does the progression feel rewarding or predatory? We look for tight mechanics and satisfying feedback.</p>
                        </div>
                        <div className="glass-dark p-8 rounded-3xl border border-white/10">
                            <BookOpen className="text-purple-500 mb-4" size={32} />
                            <h4 className="font-black text-xl text-white mb-2">Narrative & Pacing</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Does the story engage? Is the writing believable? Does the game respect the player&apos;s time or pad it with filler?</p>
                        </div>
                        <div className="glass-dark p-8 rounded-3xl border border-white/10">
                            <Sparkles className="text-yellow-500 mb-4" size={32} />
                            <h4 className="font-black text-xl text-white mb-2">Art & Sound</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Art direction, graphical fidelity, sound design, and musical score. We judge based on artistic intent, not just raw polygon count.</p>
                        </div>
                        <div className="glass-dark p-8 rounded-3xl border border-white/10">
                            <Monitor className="text-green-500 mb-4" size={32} />
                            <h4 className="font-black text-xl text-white mb-2">Technical Performance</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Frame rate stability, bugs, crash frequency, and PC optimization. We test on a variety of hardware configurations.</p>
                        </div>
                    </div>
                </div>

                {/* Ethics Policy */}
                <div className="bg-[var(--bg-surface)] rounded-[2.5rem] p-12 border border-[var(--border-subtle)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                            <Scale className="text-white w-8 h-8" />
                            <h3 className="font-black text-3xl text-white">Ethics & Transparency</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500 mb-2"><Check size={24} /></div>
                                <h5 className="font-bold text-white text-lg">Review Copies</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">We accept review codes to ensure timely coverage. This never influences our score. If we purchased the game, we act as a normal consumer.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 mb-2"><ShieldAlert size={24} /></div>
                                <h5 className="font-bold text-white text-lg">Embargoes</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">We agree to embargoes only if they allow us to speak freely about the game&apos;s quality. We do not agree to copy approval.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 mb-2"><XCircle size={24} /></div>
                                <h5 className="font-bold text-white text-lg">No Paid Reviews</h5>
                                <p className="text-sm text-gray-400 leading-relaxed">We never accept money, travel, or gifts in exchange for coverage. Advertising teams have zero say in our editorial content.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Awards */}
                <div className="mt-24 text-center">
                    <h3 className="font-black text-sm mb-12 uppercase tracking-[0.3em] text-gray-500">The TechPlay Awards</h3>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                        <div className="flex flex-col items-center gap-6 group">
                            <div className="w-32 h-32 bg-tech-red rounded-full flex items-center justify-center border-[6px] border-double border-[#0b1120] shadow-[0_0_40px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform relative ring-4 ring-tech-red/30">
                                <Medal size={56} className="text-white fill-white" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 to-transparent"></div>
                            </div>
                            <span className="font-black text-xl text-white uppercase tracking-wide">Editor&apos;s Choice</span>
                        </div>

                        <div className="flex flex-col items-center gap-6 group">
                            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center border-[6px] border-double border-[#0b1120] shadow-[0_0_40px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform relative ring-4 ring-blue-600/30">
                                <Monitor size={56} className="text-white stroke-2" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 to-transparent"></div>
                            </div>
                            <span className="font-black text-xl text-white uppercase tracking-wide">Tech Excellence</span>
                        </div>

                        <div className="flex flex-col items-center gap-6 group">
                            <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center border-[6px] border-double border-[#0b1120] shadow-[0_0_40px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform relative ring-4 ring-yellow-500/30">
                                <Award size={56} className="text-white fill-white" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 to-transparent"></div>
                            </div>
                            <span className="font-black text-xl text-white uppercase tracking-wide">Gold Standard</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
