'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeading, Badge } from '@/components/UI';
import { Shield, Lock, Eye, Server, Globe, Mail, FileText, Clock } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';

export default function PrivacyPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen">
            {/* Hero Section */}
            <PageHero
                icon={Shield}
                iconColor="text-blue-500"
                title=""
                titleAccent="Privacy Policy"
                accentGradient="from-blue-400 to-indigo-500"
                description={
                    <div className="flex items-center justify-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-widest mt-4">
                        <span className="flex items-center gap-2"><Clock size={16} /> Last Updated: November 2024</span>
                        <span className="flex items-center gap-2"><Shield size={16} /> GDPR Compliant</span>
                    </div>
                }
            />

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sticky Sidebar */}
                <aside className="hidden lg:block col-span-1">
                    <div className="sticky top-32 glass-dark p-6 rounded-xl border border-white/10">
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-4">Table of Contents</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-400">
                            <li><a href="#intro" className="hover:text-tech-red transition-colors">1. Introduction</a></li>
                            <li><a href="#controller" className="hover:text-tech-red transition-colors">2. Data Controller</a></li>
                            <li><a href="#collection" className="hover:text-tech-red transition-colors">3. Data Collection</a></li>
                            <li><a href="#usage" className="hover:text-tech-red transition-colors">4. How We Use Data</a></li>
                            <li><a href="#sharing" className="hover:text-tech-red transition-colors">5. Data Sharing</a></li>
                            <li><a href="#security" className="hover:text-tech-red transition-colors">6. Security</a></li>
                            <li><a href="#rights" className="hover:text-tech-red transition-colors">7. Your Rights</a></li>
                            <li><a href="#contact" className="hover:text-tech-red transition-colors">8. Contact Us</a></li>
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">

                    <section id="intro" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <FileText className="text-tech-red" /> 1. Introduction
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            At TechPlay.gg (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            This website is not intended for children and we do not knowingly collect data relating to children.
                        </p>
                    </section>

                    <section id="controller" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <Server className="text-blue-600" /> 2. Data Controller
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            TechPlay Media GmbH is the controller and responsible for your personal data. We have appointed a data privacy manager who is responsible for overseeing questions in relation to this privacy policy.
                        </p>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h4 className="font-bold text-white mb-2">Contact Details</h4>
                            <p className="text-sm text-gray-400">
                                <strong>Legal Entity:</strong> TechPlay Media GmbH<br />
                                <strong>Address:</strong> Gaming Street 1337, 10115 Berlin, Germany<br />
                                <strong>Email:</strong> privacy@techplay.gg
                            </p>
                        </div>
                    </section>

                    <section id="collection" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Eye className="text-green-600" /> 3. Data We Collect
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                                <h4 className="font-bold text-white mb-2">Identity Data</h4>
                                <p className="text-sm text-gray-400">Username, first name, last name, date of birth, and gender (if provided in profile).</p>
                            </div>
                            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                                <h4 className="font-bold text-white mb-2">Contact Data</h4>
                                <p className="text-sm text-gray-400">Email address and delivery address (for Shop orders).</p>
                            </div>
                            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                                <h4 className="font-bold text-white mb-2">Technical Data</h4>
                                <p className="text-sm text-gray-400">IP address, browser type and version, time zone setting, and OS.</p>
                            </div>
                            <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                                <h4 className="font-bold text-white mb-2">Profile Data</h4>
                                <p className="text-sm text-gray-400">Your interests, preferences, feedback, forum posts, and survey responses.</p>
                            </div>
                        </div>
                    </section>

                    <section id="usage" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <Globe className="text-purple-600" /> 4. How We Use Your Data
                        </h2>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                                <p>To register you as a new customer and manage our relationship with you.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                                <p>To process and deliver your orders including management of payments, fees, and charges.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                                <p>To enable you to partake in our forums, leave comments, and participate in competitions.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">4</div>
                                <p>To administer and protect our business and this website (including troubleshooting, data analysis, testing).</p>
                            </li>
                        </ul>
                    </section>

                    <section id="rights" className="glass-dark p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <Shield className="text-tech-red" /> 7. Your Rights (GDPR)
                        </h2>
                        <p className="text-gray-400 mb-6">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
                        <div className="space-y-3">
                            {['Request access to your personal data', 'Request correction of your personal data', 'Request erasure of your personal data', 'Object to processing of your personal data', 'Request restriction of processing', 'Request transfer of your personal data', 'Right to withdraw consent'].map((right, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                    <div className="w-2 h-2 bg-tech-red rounded-full"></div>
                                    <span className="text-sm font-bold text-white">{right}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="contact" className="glass-dark text-white p-8 rounded-2xl relative overflow-hidden border border-white/10">
                        <div className="relative z-10 text-center">
                            <Mail size={48} className="mx-auto mb-4 text-tech-red" />
                            <h3 className="text-2xl font-black mb-2">Have Questions?</h3>
                            <p className="text-gray-400 mb-6">If you wish to exercise any of the rights set out above, please contact us.</p>
                            <button className="bg-tech-red hover:bg-red-600 text-white px-8 py-3 rounded-lg font-black uppercase tracking-widest transition-colors">
                                Contact Privacy Team
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
