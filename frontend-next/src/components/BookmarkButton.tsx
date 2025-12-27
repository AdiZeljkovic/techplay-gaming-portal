'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useBookmarks } from '@/providers/BookmarkProvider';
import { motion } from 'framer-motion';

interface BookmarkButtonProps {
    slug: string;
    title?: string;
    showLabel?: boolean;
    className?: string;
    size?: number;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
    slug,
    title,
    showLabel = false,
    className = '',
    size = 20
}) => {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const isSaved = isBookmarked(slug);

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(slug, title);
            }}
            className={`flex items-center gap-2 transition-colors ${isSaved ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'} ${className}`}
            aria-label={isSaved ? "Remove from bookmarks" : "Add to bookmarks"}
        >
            <motion.div
                initial={false}
                animate={{ scale: isSaved ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                <Star size={size} fill={isSaved ? "currentColor" : "none"} />
            </motion.div>
            {showLabel && (
                <span className="text-xs font-bold uppercase tracking-wider">
                    {isSaved ? 'Saved' : 'Save'}
                </span>
            )}
        </motion.button>
    );
};
