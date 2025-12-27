'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/UI';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/90 to-transparent pointer-events-none"></div>

            <div className="relative z-10 max-w-md w-full text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="mb-8 relative inline-block"
                >
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-500/20 to-transparent p-6 rounded-full border border-red-500/30 backdrop-blur-md">
                        <Lock size={64} className="text-red-500" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[var(--bg-body)] p-2 rounded-full border border-red-500/30">
                        <ShieldAlert size={24} className="text-red-400" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-black text-white mb-2 font-manrope"
                >
                    Access Denied
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 mb-8 leading-relaxed"
                >
                    You don&apos;t have the necessary permissions to view this area. Only <strong>Admins</strong> and <strong>Editors</strong> can access the command center.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowLeft size={16} className="mr-2" />
                            Return Home
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-xs text-gray-600 font-mono"
                >
                    Targeting Error: 403_FORBIDDEN<br />
                    System: ACTIVE<br />
                    IP: {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
                </motion.div>
            </div>
        </div>
    );
}
