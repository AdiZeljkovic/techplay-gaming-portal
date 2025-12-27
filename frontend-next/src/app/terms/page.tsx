'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeading, Badge } from '@/components/UI';
import { ScrollText, Users, AlertTriangle, Scale, Copyright, Gavel, Ban } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';

export default function TermsPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* Hero Section */}
            <PageHero
                icon={ScrollText}
                iconColor="text-blue-500"
                title="Terms of "
                titleAccent="Service"
                accentGradient="from-blue-500 to-cyan-600"
                description="Please read these terms carefully before using TechPlay.gg. By accessing our site, you agree to be bound by these terms."
            />

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sticky Sidebar */}
                <aside className="hidden lg:block col-span-1">
                    <div className="sticky top-32 glass-dark p-6 rounded-xl border border-white/10">
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-4">Contents</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-400">
                            <li><a href="#agreement" className="hover:text-tech-red transition-colors">1. Agreement to Terms</a></li>
                            <li><a href="#accounts" className="hover:text-tech-red transition-colors">2. Accounts & Security</a></li>
                            <li><a href="#conduct" className="hover:text-tech-red transition-colors">3. User Conduct</a></li>
                            <li><a href="#content" className="hover:text-tech-red transition-colors">4. User Generated Content</a></li>
                            <li><a href="#ip" className="hover:text-tech-red transition-colors">5. Intellectual Property</a></li>
                            <li><a href="#liability" className="hover:text-tech-red transition-colors">6. Limitation of Liability</a></li>
                            <li><a href="#termination" className="hover:text-tech-red transition-colors">7. Termination</a></li>
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">

                    <section id="agreement" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <ScrollText className="text-blue-600" /> 1. Agreement to Terms
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and TechPlay Media GmbH (&quot;we,&quot; &quot;us&quot; or &quot;our&quot;), concerning your access to and use of the TechPlay.gg website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &quot;Site&quot;).
                        </p>
                    </section>

                    <section id="conduct" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Users className="text-green-600" /> 3. User Conduct
                        </h2>
                        <p className="text-gray-400 mb-6">You may not access or use the Site for any purpose other than that for which we make the Site available. As a user of the Site, you agree NOT to:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex gap-3">
                                <Ban className="text-red-500 shrink-0 mt-1" size={20} />
                                <p className="text-sm text-red-400 font-medium">Harass, annoy, intimidate, or threaten any of our employees or other users.</p>
                            </div>
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex gap-3">
                                <Ban className="text-red-500 shrink-0 mt-1" size={20} />
                                <p className="text-sm text-red-400 font-medium">Use the Site to advertise or offer to sell goods and services (spam).</p>
                            </div>
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex gap-3">
                                <Ban className="text-red-500 shrink-0 mt-1" size={20} />
                                <p className="text-sm text-red-400 font-medium">Upload or transmit viruses, Trojan horses, or other harmful material.</p>
                            </div>
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex gap-3">
                                <Ban className="text-red-500 shrink-0 mt-1" size={20} />
                                <p className="text-sm text-red-400 font-medium">Attempt to impersonate another user or person.</p>
                            </div>
                        </div>
                    </section>

                    <section id="ip" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <Copyright className="text-purple-600" /> 5. Intellectual Property Rights
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            The Content and the Marks are provided on the Site &quot;AS IS&quot; for your information and personal use only.
                        </p>
                    </section>

                    <section id="liability" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="text-orange-500" /> 6. Limitation of Liability
                        </h2>
                        <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/20">
                            <p className="text-orange-400 text-sm font-bold leading-relaxed">
                                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE.
                            </p>
                        </div>
                    </section>

                    <section id="termination" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <Gavel className="text-white" /> 7. Termination
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
