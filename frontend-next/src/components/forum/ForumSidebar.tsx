'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthModal } from '@/providers/AuthModalProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Shield, Book, Award, LogIn } from 'lucide-react';

export function ForumSidebar() {
    const { openLogin, openRegister } = useAuthModal();
    const { user, isLoading: loading } = useAuth();
    // Removed local state

    return (
        <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-50" />

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto" />
                        <div className="h-4 bg-white/10 rounded w-24 mx-auto" />
                        <div className="h-8 bg-white/10 rounded w-full" />
                    </div>
                ) : user ? (
                    <div className="relative z-10">
                        {/* User Header */}
                        <div className="flex flex-col items-center mb-6 relative">
                            <div className="relative mb-3 group/avatar cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-purple-600 rounded-full blur-md opacity-50 group-hover/avatar:opacity-75 transition-opacity" />
                                <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-red-500 via-purple-500 to-indigo-500 relative z-10">
                                    <div className="w-full h-full rounded-full bg-black overflow-hidden relative border-2 border-black">
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name || 'User'}
                                                width={96}
                                                height={96}
                                                className="object-cover w-full h-full"
                                                unoptimized={user.avatar?.includes('localhost')}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white bg-gray-800 uppercase">
                                                {user.name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg pointer-events-none">
                                    <Shield size={10} className="text-red-500" /> {user.role}
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-white tracking-tight mb-0.5">{user.username}</h3>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                            </div>
                        </div>

                        {/* Level Progress */}
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 mb-4 backdrop-blur-sm">
                            <div className="flex justify-between items-end mb-2">
                                <div className="text-xs font-black text-white uppercase italic flex items-center gap-1">
                                    <Award size={12} className="text-yellow-500" /> Level {user.level || 1}
                                </div>
                                <div className="text-[10px] font-bold text-gray-500 font-mono">
                                    {user.xp_progress || 0}%
                                </div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 to-purple-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-1000 ease-out"
                                    style={{ width: `${user.xp_progress || 0}%` }}
                                />
                            </div>
                            <div className="text-[9px] text-right text-gray-600 mt-1.5 font-mono uppercase">
                                {(user.xp_next_level || 1000) - (user.xp || 0)} XP to next level
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-white/5 border border-white/5 hover:border-white/20 transition-colors rounded-xl p-3 text-center group/stat">
                                <div className="text-lg font-black text-white group-hover/stat:text-red-500 transition-colors">{user.posts_count || 0}</div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Posts</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 hover:border-white/20 transition-colors rounded-xl p-3 text-center group/stat">
                                <div className="text-lg font-black text-white group-hover/stat:text-purple-500 transition-colors">{user.threads_count || 0}</div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Threads</div>
                            </div>
                        </div>

                        <Link href="/profile" className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/5 hover:border-white/30 backdrop-blur-md group/btn">
                            View Profile <Shield size={12} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                ) : (
                    <div className="text-center relative z-10 py-4">
                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <LogIn className="w-8 h-8" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Join the Community</h3>
                        <p className="text-xs text-gray-400 mb-6 px-2">Log in to track your stats, level up, and discuss with other gamers.</p>
                        <div className="space-y-2">
                            <button onClick={openLogin} className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition">
                                Log In
                            </button>
                            <button onClick={openRegister} className="block w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs transition">
                                Register
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Rules Widget */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
                <h3 className="font-black text-white uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                    <Book className="w-4 h-4 text-red-500" /> Forum Rules
                </h3>
                <ul className="space-y-3">
                    {[
                        "Be respectful to other members.",
                        "No hate speech or harassment.",
                        "Keep discussions on topic.",
                        "No spam or self-promotion.",
                        "Use appropriate language.",
                    ].map((rule, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                            <span className="flex items-center justify-center w-5 h-5 rounded bg-white/5 text-[10px] font-bold text-gray-500 shrink-0 mt-0.5">
                                {i + 1}
                            </span>
                            <span className="leading-snug">{rule}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <Link href="/rules" className="text-xs font-bold text-indigo-400 hover:text-white transition">
                        Read Full Guidelines
                    </Link>
                </div>
            </div>
        </div>
    );
}
