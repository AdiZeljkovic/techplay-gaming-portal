'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Plus, Minus, Cookie, ShieldCheck, Settings } from 'lucide-react';
import Link from 'next/link';

// ============================================
// BUTTON COMPONENT
// ============================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    loading = false,
    disabled,
    ...props
}) => {
    const baseStyle = "relative overflow-hidden font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded-lg transform disabled:opacity-50 disabled:cursor-not-allowed btn-gaming";

    const sizes = {
        sm: "px-4 py-2 text-[10px]",
        md: "px-6 py-3 text-xs",
        lg: "px-8 py-4 text-sm"
    };

    const variants = {
        primary: "bg-red-600 text-white shadow-[0_10px_20px_-5px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(220,38,38,0.6)] hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        outline: "border-2 border-white/20 text-white hover:bg-white/10 hover:-translate-y-0.5",
        ghost: "text-white hover:bg-white/10 hover:text-red-400",
        white: "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        gradient: "bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_100%] text-white shadow-[0_10px_30px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_20px_40px_-5px_rgba(220,38,38,0.6)] hover:-translate-y-1 animate-gradient"
    };

    return (
        <motion.button
            type={type}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...(props as any)}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-inherit">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
        </motion.button>
    );
};

// ============================================
// BADGE COMPONENT
// ============================================
export interface BadgeProps {
    children: React.ReactNode;
    color?: string;
    variant?: 'solid' | 'outline' | 'glow';
    className?: string;
    animated?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    color = 'red',
    variant = 'solid',
    className = '',
    animated = false
}) => {
    const colorClasses: Record<string, string> = {
        red: variant === 'solid'
            ? "bg-red-600 text-white"
            : variant === 'glow'
                ? "bg-red-600/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                : "border border-red-600 text-red-400 bg-transparent",
        blue: variant === 'solid'
            ? "bg-blue-600 text-white"
            : variant === 'glow'
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "border border-blue-600 text-blue-400 bg-transparent",
        gray: "bg-gray-700 text-gray-300",
        dark: "bg-gray-900 text-white",
        purple: variant === 'solid'
            ? "bg-purple-600 text-white"
            : "bg-purple-600/20 text-purple-400 border border-purple-500/50",
        yellow: "bg-yellow-500 text-black",
        green: variant === 'glow'
            ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            : "bg-green-500 text-white",
        cyan: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50",
        outline: "border border-white/20 text-white bg-white/5 backdrop-blur-sm"
    };

    const selectedColor = colorClasses[color] || colorClasses.red;

    return (
        <motion.span
            initial={animated ? { scale: 0.8, opacity: 0 } : false}
            animate={animated ? { scale: 1, opacity: 1 } : false}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${selectedColor} ${animated ? 'animate-pulse' : ''} ${className}`}
        >
            {children}
        </motion.span>
    );
};

// ============================================
// MODAL COMPONENT
// ============================================
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md', title }) => {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-[150]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`fixed inset-0 m-auto w-full ${sizes[size]} h-fit z-[160] p-4`}
                    >
                        <div className="bg-[#1a202c] rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative max-h-[90vh] overflow-y-auto">
                            {/* Gradient accent line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-purple-600 animate-gradient bg-[length:200%_100%]" />

                            {/* Header with title */}
                            {title && (
                                <div className="p-6 pb-0">
                                    <h2 className="text-xl font-black text-white">{title}</h2>
                                </div>
                            )}

                            {/* Close button */}
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-4 right-4 z-20 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            >
                                <X size={18} />
                            </motion.button>

                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ============================================
// ACCORDION COMPONENT
// ============================================
export interface AccordionProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, isOpen, onClick }) => {
    return (
        <motion.div
            className="border border-white/10 rounded-xl overflow-hidden bg-[#1a202c] mb-3 shadow-sm hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -2 }}
        >
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center p-5 text-left bg-[#1a202c] hover:bg-white/5 transition-colors"
            >
                <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-red-500' : 'text-white'}`}>{title}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    {isOpen ? <Minus size={20} className="text-red-500" /> : <Plus size={20} className="text-gray-400" />}
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 text-gray-400 leading-relaxed border-t border-white/10">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================
// SECTION HEADING COMPONENT
// ============================================
interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
    light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, icon, action, className = '', light = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-10 group ${className}`}
    >
        <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-4">
                {/* Animated accent bar */}
                <div className="relative">
                    <div className="h-10 w-1.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:h-12 transition-all duration-300" />
                    <div className="absolute inset-0 h-10 w-1.5 bg-red-600 rounded-full blur-sm opacity-50 group-hover:h-12 transition-all duration-300" />
                </div>

                <div className="flex items-center gap-3">
                    {icon && <span className="text-red-500">{icon}</span>}
                    <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-red-500 transition-colors ${light ? 'text-gray-900' : 'text-white'}`}>
                        {title}
                    </h2>
                </div>
            </div>

            {action && <div>{action}</div>}
        </div>

        {subtitle && (
            <p className="text-gray-500 text-base font-medium pl-6 mb-4">{subtitle}</p>
        )}

        {/* Animated line */}
        <div className={`h-[2px] ${light ? 'bg-gray-200' : 'bg-white/10'} relative overflow-hidden rounded-full`}>
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600/50 via-red-600 to-red-600/50"
            />
        </div>
    </motion.div>
);

// ============================================
// COOKIE BANNER COMPONENT
// ============================================
export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('techplay_cookie_consent');
        if (!consent) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('techplay_cookie_consent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('techplay_cookie_consent', 'false');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-4 left-4 right-4 md:left-8 md:bottom-8 md:right-auto md:max-w-md z-[999]"
                >
                    <div className="bg-[#1a202c]/95 backdrop-blur-xl border-l-4 border-red-600 p-6 rounded-r-lg shadow-2xl text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center border border-red-600/50">
                                    <Cookie size={16} />
                                </div>
                                <h4 className="font-black uppercase tracking-wider text-sm">Cookie Settings</h4>
                            </div>

                            <p className="text-sm text-gray-300 leading-relaxed mb-6">
                                We use cookies to personalize content, analyze traffic, and ensure you get the best gaming experience.
                                By continuing, you agree to our use of cookies.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 glow-red"
                                >
                                    <ShieldCheck size={14} /> Accept All
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                                    >
                                        Necessary Only
                                    </button>
                                    <Link href="/cookies" className="bg-white/5 hover:bg-white/10 text-gray-300 p-3 border border-white/10 flex items-center justify-center">
                                        <Settings size={16} />
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 text-[10px] text-gray-500 text-center">
                                Read our <Link href="/cookies" className="text-gray-400 hover:text-white underline">Cookie Policy</Link> and <Link href="/privacy" className="text-gray-400 hover:text-white underline">Privacy Policy</Link>.
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================
// INPUT COMPONENT
// ============================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    className?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">{label}</label>}
            <input
                className={`w-full bg-[#0F1623] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

// ============================================
// TEXTAREA COMPONENT
// ============================================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">{label}</label>}
            <textarea
                className={`w-full bg-[#0F1623] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] resize-y ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

// ============================================
// LOADING SPINNER
// ============================================
export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return (
        <div className={`${sizes[size]} border-2 border-white/20 border-t-red-500 rounded-full animate-spin ${className}`} />
    );
};

// ============================================
// TOOLTIP COMPONENT
// ============================================
export const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-white/10">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
        </div>
    );
};

// ============================================
// AVATAR COMPONENT
// ============================================
export const Avatar = ({
    src,
    alt,
    size = 'md',
    className = ''
}: {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string
}) => {
    const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12', xl: 'w-16 h-16' };

    return (
        <div className={`${sizes[size]} rounded-full bg-gray-700 overflow-hidden flex items-center justify-center ${className}`}>
            {src ? (
                <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
                <span className="text-white font-bold text-sm">{alt?.[0]?.toUpperCase() || '?'}</span>
            )}
        </div>
    );
};
