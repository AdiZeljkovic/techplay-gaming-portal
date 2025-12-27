'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/UI';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setServerError(null);
        try {
            await api.post('/forgot-password', { email });
            setIsSent(true);
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/90 to-transparent pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl p-8 relative z-10 shadow-2xl"
            >
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 text-sm transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <div className="mb-6">
                    <h1 className="text-3xl font-black text-white mb-2 font-manrope">Forgot Password?</h1>
                    <p className="text-gray-400 text-sm">Enter your email address and we&apos;ll send you instructions to reset your password.</p>
                </div>

                {isSent ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center"
                    >
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-500" size={24} />
                        </div>
                        <h3 className="text-white font-bold mb-2">Check your email</h3>
                        <p className="text-gray-400 text-sm mb-4">We have sent a password reset link to your email address.</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsSent(false)}
                        >
                            Send another link
                        </Button>
                    </motion.div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        {serverError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                                {serverError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full bg-tech-red hover:bg-red-600"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
