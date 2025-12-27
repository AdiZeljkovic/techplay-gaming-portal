'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { echo } from '@/lib/echo';

export const ActiveUsersCounter: React.FC = () => {
    const [count, setCount] = useState<number>(0);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!echo) return;

        // Presence channel 'online'
        // Note: Presence channels require authentication.
        // If user is not logged in, Echo might fail to authorize.
        // We should wrap this or check auth state.

        try {
            echo.join('online')
                .here((users: any[]) => {
                    setUsers(users);
                    setCount(users.length);
                })
                .joining((user: any) => {
                    setUsers(prev => [...prev, user]);
                    setCount(prev => prev + 1);
                })
                .leaving((user: any) => {
                    setUsers(prev => prev.filter(u => u.id !== user.id));
                    setCount(prev => Math.max(0, prev - 1));
                });

            return () => {
                echo.leave('online');
            };
        } catch (e) {
            console.error('Echo connection failed', e);
        }
    }, []);

    if (count === 0) return null;

    return (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 py-1 px-3 rounded-full border border-white/5" title={`${count} users online`}>
            <div className="relative">
                <Users size={12} className="text-green-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse border border-[#0b1120]"></span>
            </div>
            <span>{count} Online</span>
        </div>
    );
};
