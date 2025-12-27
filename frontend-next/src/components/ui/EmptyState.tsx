import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`col-span-full p-12 text-center text-gray-500 glass-dark rounded-2xl border border-[var(--border-subtle)] flex flex-col items-center justify-center ${className}`}>
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="max-w-md mx-auto mb-6">{description}</p>
            {action && (
                action.onClick ? (
                    <button
                        onClick={action.onClick}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-[var(--border-subtle)] hover:border-white/20 transition-all font-bold text-sm uppercase tracking-wide"
                    >
                        {action.label}
                    </button>
                ) : (
                    <Link
                        href={action.href || '#'}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-[var(--border-subtle)] hover:border-white/20 transition-all font-bold text-sm uppercase tracking-wide"
                    >
                        {action.label}
                    </Link>
                )
            )}
        </div>
    );
}
