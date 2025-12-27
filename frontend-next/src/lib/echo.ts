'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}

let echo: any;

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY;

    if (reverbKey) {
        echo = new Echo({
            broadcaster: 'reverb',
            key: reverbKey,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
            wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? '8080'),
            wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? '8080'),
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    } else {
        console.warn('Laravel Echo: NEXT_PUBLIC_REVERB_APP_KEY not configured. Real-time features disabled.');
    }
}

export { echo };
