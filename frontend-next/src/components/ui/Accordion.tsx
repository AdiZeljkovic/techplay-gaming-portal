'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

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
