import { Friend } from './types';

const MOCK_FRIENDS: Friend[] = [
    {
        id: 'f1',
        username: 'PixelWarrior',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
        status: 'Online',
        level: 34,
        role: 'Member'
    },
    {
        id: 'f2',
        username: 'CyberNinja',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        status: 'In-Game',
        level: 56,
        role: 'Editor'
    }
];

export const friendService = {
    async getFriends(): Promise<{ friends: Friend[], requests: any[] }> {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { friends: MOCK_FRIENDS, requests: [] };
    },

    async acceptRequest(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
    },

    async removeFriend(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
};
