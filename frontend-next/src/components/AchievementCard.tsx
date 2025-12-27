'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { Achievement } from '@/lib/types';
import { motion } from 'framer-motion';

interface AchievementCardProps {
    achievement: Achievement;
    unlocked?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked = false }) => {
    // Dynamic Icon
    // @ts-ignore - Lucide icons are dynamically accessed
    const IconComponent: any = Icons[achievement.icon as keyof typeof Icons] || Icons.Award;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${unlocked
                ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/20 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'bg-white/5 border-white/5 grayscale opacity-60'
                }`}
        >
            <div className={`p-3 rounded-lg ${unlocked ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-500'}`}>
                <IconComponent size={24} />
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.title}
                    </h3>
                    {unlocked && achievement.date && (
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {new Date(achievement.date).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{achievement.description}</p>
            </div>

            <div className={`absolute top-2 right-2 flex items-center gap-1 ${unlocked ? 'text-yellow-400' : 'text-gray-600'}`}>
                <span className="text-[10px] font-bold">+{achievement.xpValue} XP</span>
            </div>
        </motion.div>
    );
};
