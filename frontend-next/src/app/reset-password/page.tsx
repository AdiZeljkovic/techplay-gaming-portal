'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/UI';
import api from '@/lib/api';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: emailParam || '',
        password: '',
        password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setServerError(null);

        try {
            await api.post('/reset-password', {
                token,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            });
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
                    <p className="text-gray-400 mb-4">This password reset link is invalid or has expired.</p>
                    <Link href="/forgot-password" className="text-tech-red hover:underline">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl p-8 relative z-10 shadow-2xl"
            >
                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Password Reset!</h2>
                        <p className="text-gray-400 mb-6">Your password has been successfully updated. Redirecting to login...</p>
                        <Link href="/">
                            <Button variant="primary" className="w-full">Login Now</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h1 className="text-3xl font-black text-white mb-2 font-manrope">Reset Password</h1>
                            <p className="text-gray-400 text-sm">Enter your new password below.</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            {serverError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                                    {serverError}
                                </div>
                            )}

                            <input type="hidden" value={token} name="token" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-3.5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        readOnly={!!emailParam}
                                        className={`w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm ${emailParam ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">New Password</label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full bg-tech-red hover:bg-red-600"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-tech-red animate-spin" />
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
