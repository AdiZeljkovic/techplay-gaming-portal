'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BookmarkContextType {
    bookmarks: string[];
    toggleBookmark: (slug: string, title?: string) => void;
    isBookmarked: (slug: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('techplay_bookmarks');
        if (saved) {
            try {
                setBookmarks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse bookmarks', e);
            }
        }
    }, []);

    const toggleBookmark = (slug: string, title?: string) => {
        setBookmarks(prev => {
            const newBookmarks = prev.includes(slug)
                ? prev.filter(b => b !== slug)
                : [...prev, slug];

            localStorage.setItem('techplay_bookmarks', JSON.stringify(newBookmarks));
            return newBookmarks;
        });

        // Optional: Trigger a toast notification here
        // toast.success(bookmarks.includes(slug) ? 'Removed from bookmarks' : 'Added to bookmarks');
        if (title) {
            console.log(`${bookmarks.includes(slug) ? 'Removed' : 'Saved'}: ${title}`);
        }
    };

    const isBookmarked = (slug: string) => bookmarks.includes(slug);

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
}
