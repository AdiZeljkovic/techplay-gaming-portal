'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Monitor, Cpu, HardDrive } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export const EditProfileModal = ({ isOpen, onClose, user }: EditProfileModalProps) => {
    const { refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        bio: user.bio || '',
        avatar_url: user.avatar || '',
        banner_url: user.banner || '',
        computer_specs: user.profile?.computer_specs || {
            cpu: '', gpu: '', ram: '', storage: '', monitor: '', case: ''
        },
    });

    React.useEffect(() => {
        if (isOpen && user) {
            setFormData({
                bio: user.bio || '',
                avatar_url: user.profile?.avatar_url || user.avatar || '',
                banner_url: user.profile?.banner_url || user.banner || '',
                computer_specs: user.profile?.computer_specs || (user.specs) || {
                    cpu: '', gpu: '', ram: '', storage: '', monitor: '', case: ''
                }
            });
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await import('@/lib/userService').then(m => m.userService.updateProfile(formData));
            await refreshUser();
            onClose();
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSpec = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            computer_specs: { ...prev.computer_specs, [key]: value }
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#0f172a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-xl pointer-events-auto"
                        >
                            <div className="sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10 p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Edit Profile</h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">About You</h3>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full bg-[#0b1120] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500 focus:outline-none min-h-[100px]"
                                            placeholder="Tell us about your gaming journey..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Avatar URL</label>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={formData.avatar_url}
                                                    onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                                                    className="w-full bg-[#0b1120] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500 focus:outline-none"
                                                    placeholder="https://..."
                                                />
                                                <Upload size={14} className="absolute right-3 top-3.5 text-gray-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Banner URL</label>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    value={formData.banner_url}
                                                    onChange={e => setFormData({ ...formData, banner_url: e.target.value })}
                                                    className="w-full bg-[#0b1120] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500 focus:outline-none"
                                                    placeholder="https://..."
                                                />
                                                <Upload size={14} className="absolute right-3 top-3.5 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                                        <Monitor size={16} /> The Rig
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'CPU', key: 'cpu', icon: Cpu },
                                            { label: 'GPU', key: 'gpu', icon: HardDrive },
                                            { label: 'RAM', key: 'ram', icon: HardDrive },
                                            { label: 'Storage', key: 'storage', icon: HardDrive },
                                            { label: 'Monitor', key: 'monitor', icon: Monitor },
                                            { label: 'Case', key: 'case', icon: HardDrive },
                                        ].map((field) => (
                                            <div key={field.key} className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{field.label}</label>
                                                <input
                                                    type="text"
                                                    value={(formData.computer_specs as any)?.[field.key] || ''}
                                                    onChange={e => updateSpec(field.key, e.target.value)}
                                                    className="w-full bg-[#0b1120] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500 focus:outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                    <button onClick={onClose} type="button" className="px-4 py-2 text-gray-400 hover:text-white transition">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
