'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Button } from '@/components/UI';
import { useAuth } from '@/providers/AuthProvider';
import { Gamepad2, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthModalContextType {
    openLogin: () => void;
    openRegister: () => void;
    closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const router = useRouter();

    // Reset when opening
    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', email: '', password: '', password_confirmation: '' });
            setError('');
        }
    }, [isOpen]);

    const openLogin = () => {
        setAuthMode('login');
        setIsOpen(true);
    };

    const openRegister = () => {
        setAuthMode('register');
        setIsOpen(true);
    };

    const closeAuthModal = () => setIsOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (authMode === 'login') {
                await login(formData.email, formData.password);
            } else {
                if (formData.password !== formData.password_confirmation) {
                    setError('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                });
            }
            setIsOpen(false);
            router.push('/profile');
        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Authentication failed. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthModalContext.Provider value={{ openLogin, openRegister, closeAuthModal }}>
            {children}

            {/* Global Auth Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="flex border-b border-white/10 bg-black/20">
                    <button onClick={() => setAuthMode('login')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors relative ${authMode === 'login' ? 'text-white bg-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                        Sign In
                        {authMode === 'login' && <motion.div layoutId="authTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-red" />}
                    </button>
                    <button onClick={() => setAuthMode('register')} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors relative ${authMode === 'register' ? 'text-white bg-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                        Register
                        {authMode === 'register' && <motion.div layoutId="authTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-red" />}
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-tech-red mx-auto flex items-center justify-center rounded shadow-glow mb-4">
                            <Gamepad2 className="text-white" size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white font-manrope uppercase">{authMode === 'login' ? 'Welcome Back' : 'Join the Squad'}</h3>
                        <p className="text-gray-400 text-xs mt-2 font-medium">
                            {authMode === 'login' ? 'Enter your credentials to access your account' : 'Create an account to join the discussion and track stats'}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded text-center">
                                {error}
                            </div>
                        )}

                        {authMode === 'register' && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Username</label>
                                <div className="relative group">
                                    <User size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm placeholder-gray-600"
                                        placeholder="GamerTag123"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm placeholder-gray-600"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm placeholder-gray-600"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        {authMode === 'register' && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Confirm Password</label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-tech-red transition-colors" />
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full bg-[var(--bg-surface)] border border-gray-700 text-white rounded-xl p-3 pl-10 focus:outline-none focus:border-tech-red focus:ring-1 focus:ring-tech-red transition-all font-semibold text-sm placeholder-gray-600"
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>
                        )}

                        <Button type="submit" variant="primary" className="w-full py-4 shadow-2xl shadow-tech-red/20 mt-6 rounded-xl text-sm" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
                                </span>
                            ) : (
                                authMode === 'login' ? 'Login' : 'Create Account'
                            )}
                        </Button>
                    </form>
                </div>
            </Modal>
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}
