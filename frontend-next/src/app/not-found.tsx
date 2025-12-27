'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 404 Icon */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8"
                    >
                        <Ghost className="w-32 h-32 text-purple-500 mx-auto opacity-80" />
                    </motion.div>

                    {/* Error Code */}
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-4">
                        404
                    </h1>

                    {/* Message */}
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        Maybe it&apos;s hiding in another dimension?
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
                        >
                            <Home className="w-5 h-5" />
                            Go to Homepage
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>

                    {/* Search Suggestion */}
                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <p className="text-gray-500 mb-4">Or try searching for what you need:</p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Search TechPlay
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
