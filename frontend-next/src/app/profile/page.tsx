'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { friendService } from '@/lib/friendService';
import { achievementService } from '@/lib/achievementService';
import { shopService } from '@/lib/shopService';
import { userService } from '@/lib/userService';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthModal } from '@/providers/AuthModalProvider';
import Link from 'next/link';
import Image from 'next/image';
import {
    Gamepad2, Trophy, Activity, ShoppingBag, Edit2, Settings, Zap,
    Link2, Users, Cpu, Sparkles, Star, TrendingUp, MessageSquare,
    Award, Heart, Clock, CheckCircle, Package, ChevronRight, Crown, Lock
} from 'lucide-react';

const MOCK_USER_PROFILE = {
    id: 'guest',
    username: 'Guest',
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Guest&background=1a202c&color=fff',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    bio: 'Welcome to TechPlay! Log in to personalize your profile.',
    level: 1,
    role: 'Guest',
    xpCurrent: 0,
    xpNextLevel: 1000,
    joinDate: 'Today',
    achievements: [],
    accounts: [],
    friends: [],
    specs: {
        cpu: 'Not specified',
        gpu: 'Not specified',
        ram: 'Not specified',
        storage: 'Not specified',
        monitor: 'Not specified',
        case: 'Not specified'
    }
};

// Type definitions for profile data
type ProfileAchievement = {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    rarity: string;
    progress: number;
};

type ProfileActivity = {
    type: string;
    title: string;
    time: string;
    icon: any;
    color: string;
};

type ProfileOrder = {
    id: string;
    date: string;
    total: number;
    status: string;
    items: { name: string; quantity: number; price: number; image: string }[];
};

type TabType = 'overview' | 'achievements' | 'activity' | 'orders';

const rarityColors: Record<string, string> = {
    common: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
    uncommon: 'bg-green-500/20 border-green-500/30 text-green-400',
    rare: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    epic: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    legendary: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
};

export default function ProfilePage() {
    const { user: authUser, isAuthenticated } = useAuth();

    // Construct display user
    // Construct display user
    const user = useMemo(() => {
        if (!authUser) return null;
        return {
            ...authUser,
            username: authUser.name, // Map name to username if needed, or use username if available
            bio: authUser.profile?.biography || 'No bio yet.',
            avatar: authUser.profile?.profile_picture_path || authUser.profile_photo_url,
            banner: authUser.profile?.banner_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
            level: authUser.rank_id || 1, // Assuming rank_id corresponds to level
            role: authUser.roles?.[0]?.name || 'Member',
            xpCurrent: authUser.xp || 0,
            xpNextLevel: authUser.xp_next_level || 1000,
            specs: authUser.profile?.computer_specs || {
                cpu: 'Not specified', gpu: 'Not specified', ram: 'Not specified',
                storage: 'Not specified', monitor: 'Not specified', case: 'Not specified'
            },
            accounts: [
                // Placeholder for now as we don't have this in DB yet fully implemented or need to fetch
                { platform: 'Steam', connected: false, username: '' },
                { platform: 'Discord', connected: false },
                { platform: 'Xbox', connected: false },
            ],
            postsCount: authUser.posts_count || 0,
            reviewsCount: authUser.reviews_count || 0,
            ordersCount: authUser.orders_count || 0,
            rep: '0', // Placeholder or calc
        } as any;
    }, [authUser]);

    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [friendsData, setFriendsData] = useState<any>({ friends: [], requests: [] });
    const [achievements, setAchievements] = useState<ProfileAchievement[]>([]);
    const [orders, setOrders] = useState<ProfileOrder[]>([]);
    const [activities, setActivities] = useState<ProfileActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const [friends, achievementsData, ordersData, activityData] = await Promise.all([
                    friendService.getFriends(),
                    achievementService.getAll(),
                    shopService.getOrders(),
                    userService.getActivity()
                ]);
                setFriendsData(friends);
                setAchievements(achievementsData.map((a: any) => ({
                    id: a.id,
                    name: a.name, // Use 'name' from DB
                    description: a.description,
                    icon: a.icon || '🏆', // Dynamic icon mapping needed? Using Trophy default for now if icon string lookup fails
                    unlocked: a.is_unlocked, // Use backend 'is_unlocked'
                    rarity: a.rarity || 'common', // DB doesn't have rarity yet? Add to model/seeder or derive?
                    progress: a.progress
                })));
                setOrders(ordersData);
                setActivities(activityData);
            } catch (e) {
                console.error('Failed to fetch profile data:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [user]);

    const { openLogin } = useAuthModal();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[var(--bg-body)] flex items-center justify-center">
                <div className="container mx-auto px-4 max-w-lg">
                    <EmptyState
                        icon={<Lock size={32} className="opacity-50" />}
                        title="Profile Locked"
                        description="You need to be logged in to view your profile, stats, and achievements."
                        action={{
                            label: "Log In / Register",
                            onClick: openLogin
                        }}
                    />
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Posts', value: user.postsCount, icon: MessageSquare },
        { label: 'Reviews', value: user.reviewsCount, icon: Star },
        { label: 'Rep', value: user.rep, icon: TrendingUp },
        { label: 'Orders', value: user.ordersCount, icon: ShoppingBag },
    ];

    const xpPercentage = (user.xpCurrent / user.xpNextLevel) * 100;

    return (
        <div className="min-h-screen bg-[var(--bg-body)]">
            {/* Hero */}
            <div className="relative pt-32 pb-12 border-b border-[var(--border-subtle)] overflow-hidden">
                <div className="absolute inset-0 bg-[var(--bg-body)]" />
                <div className="absolute inset-0 z-0">
                    <Image src={user.banner} alt="Banner" fill className="object-cover opacity-20 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-body)]/60 via-[var(--bg-body)]/80 to-[var(--bg-body)]" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    {/* Actions */}
                    <div className="absolute top-0 right-4 flex gap-3">
                        <button onClick={() => setIsEditProfileOpen(true)} className="glass-dark p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors border border-[var(--border-subtle)]">
                            <Edit2 size={16} />
                        </button>
                        <button className="glass-dark p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors border border-[var(--border-subtle)]">
                            <Settings size={16} />
                        </button>
                    </div>

                    {/* Avatar */}
                    <div className="inline-block relative mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-purple-500 to-transparent blur-xl opacity-50 rounded-full" />
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 glass-dark border border-white/10 relative z-10 overflow-hidden bg-black">
                                <Image src={user.avatar} alt={user.username} fill className="object-cover rounded-full" />
                            </div>
                            <div className="absolute -bottom-2 right-0 left-0 mx-auto w-max z-20">
                                <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg border border-white/10 flex items-center gap-1">
                                    <Zap size={10} fill="currentColor" /> Lvl {user.level}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">{user.username}</h1>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase">{user.role}</span>
                        <span className="text-gray-400 font-medium text-sm max-w-lg truncate">{user.bio}</span>
                    </div>

                    {/* XP Bar */}
                    <div className="max-w-md mx-auto mb-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>XP Progress</span>
                            <span>{user.xpCurrent} / {user.xpNextLevel}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all" style={{ width: `${xpPercentage}%` }} />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-10 text-gray-400">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group">
                                <div className="text-2xl font-black text-white group-hover:text-red-500 transition-colors">{stat.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <stat.icon size={12} /> {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {[
                            { id: 'overview', label: 'Overview', icon: Gamepad2 },
                            { id: 'achievements', label: 'Achievements', icon: Trophy },
                            { id: 'activity', label: 'Activity', icon: Activity },
                            { id: 'orders', label: 'Orders', icon: ShoppingBag },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${activeTab === tab.id
                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] transform scale-105'
                                    : 'glass-dark text-gray-400 border-[var(--border-subtle)] hover:bg-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-10">
                <AnimatePresence mode="wait">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-6">
                                {/* Linked Accounts */}
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                    <h3 className="font-black text-white uppercase text-xs tracking-widest mb-5 flex items-center gap-2">
                                        <Link2 size={14} className="text-red-500" /> Linked Accounts
                                    </h3>
                                    <div className="space-y-3">
                                        {user.accounts.map((acc: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-[var(--border-subtle)] hover:border-white/20 transition-all cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${acc.platform === 'Steam' ? 'bg-[#1b2838] text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                        <Gamepad2 size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{acc.platform}</div>
                                                        {acc.connected && <div className="text-[10px] text-gray-400 font-mono">{acc.username}</div>}
                                                    </div>
                                                </div>
                                                {acc.connected ? (
                                                    <span className="text-[9px] px-2 py-1 rounded bg-green-500/20 text-green-500 border border-green-500/30 font-bold uppercase">Connected</span>
                                                ) : (
                                                    <button className="text-[10px] py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 rounded transition-colors">Connect</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Friends */}
                                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                                                <Users size={20} className="text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-white uppercase text-sm tracking-widest">Friends</h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{friendsData.friends.length} Connected</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {friendsData.friends.map((friend: any) => (
                                            <div key={friend.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-[var(--border-subtle)]">
                                                <div className="relative w-10 h-10 shrink-0">
                                                    <Image src={friend.avatar} alt={friend.username} fill className="rounded-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm text-white">{friend.username}</div>
                                                    <div className="text-[10px] text-gray-500">Lvl {friend.level} • {friend.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                {/* The Rig */}
                                <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-red-600/10" />
                                    <div className="p-6 relative z-10">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-black text-white uppercase text-lg tracking-tight flex items-center gap-3">
                                                <Cpu size={20} className="text-red-500" /> The Rig
                                            </h3>
                                            <div className="text-[9px] px-2 py-1 rounded border border-white/20 text-white flex items-center gap-1">
                                                <Sparkles size={10} /> Premium Build
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {Object.entries(user.specs).filter(([k]) => k !== 'consoles').map(([key, value]) => (
                                                <div key={key} className="bg-white/5 p-4 rounded-xl border border-[var(--border-subtle)] hover:border-white/10 transition">
                                                    <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{key}</div>
                                                    <div className="text-sm font-bold text-white truncate" title={value as string}>{value as string}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ACHIEVEMENTS TAB */}
                    {activeTab === 'achievements' && (
                        <motion.div key="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className={`relative rounded-2xl border p-6 transition-all hover:-translate-y-1 cursor-pointer ${achievement.unlocked ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-black/20 border-[var(--border-subtle)] opacity-60'}`}>
                                        {achievement.rarity === 'legendary' && achievement.unlocked && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 rounded-2xl" />
                                        )}
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="text-4xl">{achievement.icon}</div>
                                                <span className={`text-[9px] px-2 py-1 rounded-full border font-bold uppercase ${rarityColors[achievement.rarity]}`}>
                                                    {achievement.rarity}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-white text-lg mb-1">{achievement.name}</h3>
                                            <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                                            {!achievement.unlocked && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Progress</span>
                                                        <span>{achievement.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${achievement.progress}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                            {achievement.unlocked && (
                                                <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                                    <CheckCircle size={14} /> Unlocked
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ACTIVITY TAB */}
                    {activeTab === 'activity' && (
                        <motion.div key="activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="max-w-2xl mx-auto space-y-4">
                                {activities.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-[var(--border-subtle)] hover:border-white/10 transition-all">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.color.replace('text-', 'bg-')}/20 border ${activity.color.replace('text-', 'border-')}/30`}>
                                            <activity.icon size={20} className={activity.color} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white">{activity.title}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={10} /> {activity.time}
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white/5 rounded-2xl border border-white/10 p-6">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                                            <div>
                                                <div className="text-xs text-gray-500 font-mono mb-1">{order.id}</div>
                                                <div className="text-sm text-gray-400">{order.date}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                                                    {order.status}
                                                </span>
                                                <div className="text-xl font-black text-white">${order.total.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-white">{item.name}</div>
                                                        <div className="text-sm text-gray-400">Qty: {item.quantity} × ${item.price}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} />
        </div>
    );
}
