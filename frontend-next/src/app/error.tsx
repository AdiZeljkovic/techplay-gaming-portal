'use client';

import React from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Error Icon */}
                    <div className="w-32 h-32 mx-auto mb-8 relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                        <div className="relative flex items-center justify-center w-full h-full bg-red-500/10 border-2 border-red-500/50 rounded-full">
                            <span className="text-6xl">💥</span>
                        </div>
                    </div>

                    {/* Error Code */}
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-4">
                        500
                    </h1>

                    {/* Message */}
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Server Error
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Something went wrong on our end. Our team has been notified and we&apos;re working on it.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-semibold transition-all"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
