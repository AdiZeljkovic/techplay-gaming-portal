'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, Crown, Heart } from 'lucide-react';
import { Button } from '@/components/UI';

const PlanCard = ({
    title,
    price,
    icon: Icon,
    features,
    recommended = false,
    accentColor
}: {
    title: string,
    price: string,
    icon: any,
    features: string[],
    recommended?: boolean,
    accentColor: string
}) => {
    const isRed = accentColor === 'red';
    const borderColor = isRed ? 'border-tech-red' : 'border-white/10';
    const glowColor = isRed ? 'shadow-[0_0_40px_rgba(220,38,38,0.3)]' : '';

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-2xl ${recommended ? 'bg-[#1a202c]' : 'glass-dark'} border ${borderColor} ${glowColor} flex flex-col`}
        >
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tech-red text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${isRed ? 'bg-tech-red/10 text-tech-red' : 'bg-white/5 text-gray-400'}`}>
                <Icon size={28} />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">{price}</span>
                <span className="text-sm text-gray-500 font-bold uppercase">/ month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                        <Check size={16} className={`shrink-0 mt-0.5 ${isRed ? 'text-tech-red' : 'text-green-500'}`} />
                        {feature}
                    </li>
                ))}
            </ul>

            <Button
                variant={recommended ? 'primary' : 'outline'}
                className="w-full justify-center py-4"
            >
                Join Now
            </Button>
        </motion.div>
    );
};

export default function SupportPage() {
    return (
        <div className="bg-[var(--bg-body)] min-h-screen pt-24 pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 bg-tech-red/10 w-full h-[600px] blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-tech-red to-orange-500 mb-8 shadow-glow"
                    >
                        <Heart size={32} className="text-white fill-white" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white font-manrope mb-6">Support Independent Media</h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        We refuse corporate buyouts to keep our reviews 100% honest.
                        Join the resistance and help us keep the servers running.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <PlanCard
                        title="Supporter"
                        price="$5"
                        icon={Shield}
                        accentColor="gray"
                        features={[
                            "Ad-Free Browsing Experience",
                            "Supporter Badge on Profile",
                            "Access to Monthly Newsletter"
                        ]}
                    />
                    <PlanCard
                        title="Legend"
                        price="$10"
                        icon={Zap}
                        accentColor="red"
                        recommended={true}
                        features={[
                            "Everything in Supporter",
                            "Monthly Merch Store Discount (15%)",
                            "Private Discord Channel Access",
                            "Vote on Next Review Topic"
                        ]}
                    />
                    <PlanCard
                        title="Founder"
                        price="$25"
                        icon={Crown}
                        accentColor="purple"
                        features={[
                            "Everything in Legend",
                            "Name in Article Credits",
                            "Quarterly Limited Edition Swag Box",
                            "Direct Chat with Editorial Team"
                        ]}
                    />
                </div>

                {/* FAQ / Trust Signal */}
                <div className="text-center border-t border-white/10 pt-16">
                    <h2 className="text-2xl font-black text-white mb-8">Why Support TechPlay?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                        <div>
                            <div className="text-tech-red font-black text-4xl mb-2">0%</div>
                            <div className="text-gray-400 font-bold uppercase text-sm tracking-widest">Sponsored Reviews</div>
                        </div>
                        <div>
                            <div className="text-tech-red font-black text-4xl mb-2">100%</div>
                            <div className="text-gray-400 font-bold uppercase text-sm tracking-widest">Reader Funded</div>
                        </div>
                        <div>
                            <div className="text-tech-red font-black text-4xl mb-2">24/7</div>
                            <div className="text-gray-400 font-bold uppercase text-sm tracking-widest">Honest Coverage</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
