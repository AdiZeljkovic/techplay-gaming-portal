'use client';

import React, { memo, useState } from 'react';
import { Twitter, Facebook, Linkedin, Link2, MessageCircle, Mail, Check } from 'lucide-react';

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
    className?: string;
    compact?: boolean;
}

export const SocialShare: React.FC<SocialShareProps> = memo(({
    url,
    title,
    description = '',
    className = '',
    compact = false
}) => {
    const [copied, setCopied] = useState(false);

    // Ensure we handle client-side URLs correctly
    const shareUrl = typeof window !== 'undefined' && url.startsWith('/')
        ? `${window.location.origin}${url}`
        : url;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
        reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: keyof typeof shareLinks) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    const buttonClass = compact
        ? 'p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors'
        : 'flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium';

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {!compact && <span className="text-gray-400 text-sm">Share:</span>}

            <button
                onClick={() => handleShare('twitter')}
                className={`${buttonClass} text-blue-400 hover:text-blue-300`}
                title="Share on Twitter"
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
                {!compact && 'Twitter'}
            </button>

            <button
                onClick={() => handleShare('facebook')}
                className={`${buttonClass} text-blue-600 hover:text-blue-500`}
                title="Share on Facebook"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
                {!compact && 'Facebook'}
            </button>

            <button
                onClick={() => handleShare('linkedin')}
                className={`${buttonClass} text-blue-500 hover:text-blue-400`}
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="w-4 h-4" />
                {!compact && 'LinkedIn'}
            </button>

            <button
                onClick={() => handleShare('reddit')}
                className={`${buttonClass} text-orange-500 hover:text-orange-400`}
                title="Share on Reddit"
                aria-label="Share on Reddit"
            >
                <MessageCircle className="w-4 h-4" />
                {!compact && 'Reddit'}
            </button>

            <button
                onClick={() => handleShare('email')}
                className={`${buttonClass} text-gray-400 hover:text-gray-300`}
                title="Share via Email"
                aria-label="Share via Email"
            >
                <Mail className="w-4 h-4" />
                {!compact && 'Email'}
            </button>

            <button
                onClick={handleCopyLink}
                className={`${buttonClass} ${copied ? 'text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
                title={copied ? 'Link copied!' : 'Copy link'}
                aria-label="Copy link"
            >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                {!compact && (copied ? 'Copied!' : 'Copy')}
            </button>
        </div>
    );
});

SocialShare.displayName = 'SocialShare';

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * ReadingTime - Display estimated reading time
 */
export const ReadingTime: React.FC<{ content: string; className?: string }> = memo(({
    content,
    className = ''
}) => {
    const minutes = calculateReadingTime(content);

    return (
        <span className={`text-gray-400 ${className}`}>
            {minutes} min read
        </span>
    );
});

ReadingTime.displayName = 'ReadingTime';
