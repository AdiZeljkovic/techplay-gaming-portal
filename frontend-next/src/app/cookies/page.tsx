'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart2, ShoppingBag, Check, X, Cookie, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/UI';
import { PageHero } from '@/components/common/PageHero';

const CookieCard = ({
    title,
    description,
    type,
    icon: Icon,
    cookies,
    isMandatory = false,
    isEnabled,
    onToggle
}: {
    title: string,
    description: string,
    type: string,
    icon: any,
    cookies: string[],
    isMandatory?: boolean,
    isEnabled: boolean,
    onToggle: () => void
}) => (
    <div className="glass-dark p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-white/10 transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6">
            {isMandatory ? (
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                    <Shield size={10} /> Mandatory
                </div>
            ) : (
                <button
                    onClick={onToggle}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isEnabled ? 'bg-tech-red' : 'bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            )}
        </div>

        <div className="flex gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${type === 'essential' ? 'bg-green-500/10 text-green-500' :
                type === 'analytics' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-purple-500/10 text-purple-500'
                }`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 min-h-[40px]">{description}</p>

                <div className="bg-black/20 rounded-lg p-3 border border-[var(--border-subtle)]">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cookies Used</div>
                    <div className="flex flex-wrap gap-2">
                        {cookies.map(cookie => (
                            <span key={cookie} className="text-xs font-mono text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/5">
                                {cookie}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function CookiesPage() {
    const [preferences, setPreferences] = useState({
        analytics: true,
        marketing: false
    });

    return (
        <div className="bg-[var(--bg-body)] min-h-screen pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 bg-blue-900/20 w-full h-[600px] blur-[100px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">

                <PageHero
                    icon={Cookie}
                    iconColor="text-tech-red"
                    title=""
                    titleAccent="Cookie Policy"
                    accentGradient="from-tech-red to-orange-500"
                    description="We use cookies to enhance your gaming experience. Transparency is our policy."
                />

                {/* Consent Status Banner */}
                <div className="bg-gradient-to-r from-tech-red/10 to-purple-600/10 border border-tech-red/20 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-tech-red/20 flex items-center justify-center text-tech-red">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Current Status</h3>
                            <p className="text-sm text-gray-400">You last updated your preferences on <span className="text-gray-300">Dec 14, 2025</span></p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/10">
                            Reset All
                        </button>
                    </div>
                </div>

                {/* Cookie Sections */}
                <div className="space-y-6">
                    <CookieCard
                        title="Strictly Necessary"
                        description="Essential for the website to function properly. You cannot disable these."
                        type="essential"
                        icon={Shield}
                        cookies={['techplay_session', 'csrf_token', 'consent_status']}
                        isMandatory={true}
                        isEnabled={true}
                        onToggle={() => { }}
                    />

                    <CookieCard
                        title="Performance & Analytics"
                        description="Help us improve our website by collecting and reporting information on how you use it."
                        type="analytics"
                        icon={BarChart2}
                        cookies={['_ga', '_gid', '_gat', 'cl_f']}
                        isEnabled={preferences.analytics}
                        onToggle={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                    />

                    <CookieCard
                        title="Marketing & Targeting"
                        description="Used to track visitors across websites to display relevant ads."
                        type="marketing"
                        icon={ShoppingBag}
                        cookies={['ads_preference', 'doubleclick', 'fbp']}
                        isEnabled={preferences.marketing}
                        onToggle={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                    />
                </div>

                {/* Actions */}
                <div className="mt-12 flex justify-end gap-4 border-t border-white/10 pt-8">
                    <button className="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors">
                        Cancel
                    </button>
                    <Button variant="primary" className="px-8" onClick={() => alert('Preferences Saved')}>
                        Save Preferences
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-20 text-center text-gray-500 text-sm">
                    <p>
                        For more detailed information, please read our <Link href="/privacy" className="text-tech-red hover:underline">Privacy Policy</Link>.
                    </p>
                </div>

            </div>
        </div>
    );
}
