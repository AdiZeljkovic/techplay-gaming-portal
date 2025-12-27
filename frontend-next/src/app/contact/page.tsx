'use client';

import React from 'react';
import { Button, SectionHeading } from '@/components/UI';
import { Mail, Briefcase, LifeBuoy, MapPin, Phone, MessageSquare, ArrowRight, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/common/PageHero';

export default function ContactPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen text-gray-300">
            {/* Unified Cinematic Hero */}
            <PageHero
                icon={Mail}
                iconColor="text-tech-red"
                title="How can "
                titleAccent="we help?"
                accentGradient="from-tech-red to-orange-500"
                description={<>Whether you have a hot news tip, a business proposal, <br className="hidden md:block" /> or just want to say hi, our team is ready to listen.</>}
            />

            <div className="container mx-auto px-4 py-24 max-w-7xl">

                {/* Department Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-dark p-10 rounded-3xl border border-white/10 shadow-premium hover:-translate-y-2 transition-transform group text-center hover:border-tech-red/50"
                    >
                        <div className="w-20 h-20 bg-tech-red/10 text-tech-red rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Editorial Team</h3>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">For news tips, press releases, and correction requests.</p>
                        <a href="mailto:editor@techplay.gg" className="text-white font-bold text-sm hover:text-tech-red transition-colors flex items-center justify-center gap-2 bg-white/5 py-3 rounded-lg border border-white/10 hover:bg-white/10">
                            <Send size={14} /> editor@techplay.gg
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass-dark p-10 rounded-3xl border border-white/10 shadow-premium hover:-translate-y-2 transition-transform group text-center hover:border-blue-500/50"
                    >
                        <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Advertising & Sales</h3>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">For partnership opportunities, media kits, and ad placements.</p>
                        <a href="mailto:partners@techplay.gg" className="text-white font-bold text-sm hover:text-blue-400 transition-colors flex items-center justify-center gap-2 bg-white/5 py-3 rounded-lg border border-white/10 hover:bg-white/10">
                            <Send size={14} /> partners@techplay.gg
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="glass-dark p-10 rounded-3xl border border-white/10 shadow-premium hover:-translate-y-2 transition-transform group text-center hover:border-green-500/50"
                    >
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <LifeBuoy size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Technical Support</h3>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">Account issues, bug reports, and subscription help.</p>
                        <a href="mailto:help@techplay.gg" className="text-white font-bold text-sm hover:text-green-400 transition-colors flex items-center justify-center gap-2 bg-white/5 py-3 rounded-lg border border-white/10 hover:bg-white/10">
                            <Send size={14} /> help@techplay.gg
                        </a>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Form */}
                    <div className="glass-dark p-10 rounded-3xl border border-white/10">
                        <SectionHeading title="Send us a Message" subtitle="We typically respond within 24 hours." className="text-white mb-8" />
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full p-4 bg-[var(--bg-surface)] border border-white/10 rounded-xl focus:outline-none focus:border-tech-red transition-all text-white placeholder-gray-600 focus:ring-1 focus:ring-tech-red" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full p-4 bg-[var(--bg-surface)] border border-white/10 rounded-xl focus:outline-none focus:border-tech-red transition-all text-white placeholder-gray-600 focus:ring-1 focus:ring-tech-red" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Department</label>
                                <div className="relative">
                                    <select className="w-full p-4 bg-[var(--bg-surface)] border border-white/10 rounded-xl focus:outline-none focus:border-tech-red transition-all text-white appearance-none cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Editorial / News Tip</option>
                                        <option>Advertising</option>
                                        <option>Report a Bug</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Message</label>
                                <textarea placeholder="How can we help you today?" rows={6} className="w-full p-4 bg-[var(--bg-surface)] border border-white/10 rounded-xl focus:outline-none focus:border-tech-red transition-all text-white placeholder-gray-600 focus:ring-1 focus:ring-tech-red resize-none"></textarea>
                            </div>

                            <Button variant="primary" className="w-full py-5 text-sm font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Location & FAQ */}
                    <div className="space-y-12">

                        {/* Location Card */}
                        <div className="bg-[var(--bg-surface)] text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden border border-[var(--border-subtle)]">
                            <div className="absolute top-0 right-0 opacity-5 p-8 text-white"><MapPin size={200} /></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>

                            <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-2"><MapPin size={20} className="text-tech-red" /> HQ Location</h3>
                            <address className="not-italic text-gray-300 space-y-2 mb-10 text-lg leading-relaxed font-manrope">
                                <strong className="text-white text-2xl block mb-2">TechPlay Media GmbH</strong>
                                Gaming Street 1337<br />
                                10115 Berlin, Germany
                            </address>
                            <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-tech-red border border-white/5 group-hover:bg-tech-red group-hover:text-white transition-all"><Phone size={20} /></div>
                                    <span className="font-bold text-lg group-hover:text-white transition-colors text-gray-300">+49 (0) 30 1234 5678</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-tech-red border border-white/5 group-hover:bg-tech-red group-hover:text-white transition-all"><MessageSquare size={20} /></div>
                                    <span className="font-bold text-lg group-hover:text-white transition-colors text-gray-300">@TechPlayGG</span>
                                </div>
                            </div>

                            {/* Mock Map Visual */}
                            <div className="mt-10 h-48 w-full bg-gray-800 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer border border-white/10 group">
                                <img src="https://images.unsplash.com/photo-1520960858461-ac67926048eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="Map" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-tech-red text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-glow group-hover:scale-110 transition-transform">View on Maps</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick FAQ */}
                        <div className="glass-dark p-8 rounded-3xl border border-white/10">
                            <h3 className="font-black text-white uppercase text-xs tracking-widest mb-6 border-b border-white/5 pb-4">Common Questions</h3>
                            <div className="space-y-4">
                                <div className="bg-white/5 p-5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <h4 className="font-bold text-white text-sm mb-2">Do you accept guest posts?</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">Currently, we are not accepting unsolicited guest submissions. We handle all content in-house to maintain quality standards.</p>
                                </div>
                                <div className="bg-white/5 p-5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <h4 className="font-bold text-white text-sm mb-2">How can I review games for TechPlay?</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">Check our Careers page or LinkedIn for freelance openings. We require at least 2 years of industry experience.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
