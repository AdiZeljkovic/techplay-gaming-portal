'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
