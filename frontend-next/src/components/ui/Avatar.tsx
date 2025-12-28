'use client';

import React from 'react';

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
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
                <span className="text-white font-bold text-sm">{alt?.[0]?.toUpperCase() || '?'}</span>
            )}
        </div>
    );
};
