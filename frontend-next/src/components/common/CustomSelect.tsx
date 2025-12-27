'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select...',
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            {label && <label className="block text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">{label}</label>}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full flex items-center justify-between bg-[#0F1623] border ${isOpen ? 'border-purple-600 ring-1 ring-purple-600' : 'border-white/10'} rounded-lg px-4 py-3 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
                        {selectedOption ? (
                            <span className="flex items-center gap-2">
                                {selectedOption.icon}
                                {selectedOption.label}
                            </span>
                        ) : placeholder}
                    </span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute z-50 mt-2 w-full bg-[#1a202c] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                            <div className="p-1">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${value === option.value
                                                ? 'bg-purple-600/20 text-purple-400'
                                                : 'text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {option.icon}
                                            {option.label}
                                        </span>
                                        {value === option.value && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
