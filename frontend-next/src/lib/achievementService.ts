import api from './api';
import { Achievement } from './types';

export const achievementService = {
    async getAll(): Promise<Achievement[]> {
        const response = await api.get('/achievements');
        // Backend returns mixed case or distinct structure?
        // Let's assume standard Laravel resource response
        return response.data.map((ach: any) => ({
            id: ach.id.toString(),
            title: ach.name,
            description: ach.description,
            icon: ach.icon || 'Trophy',
            xpValue: ach.xp || 0,
            isUnlocked: ach.is_unlocked || false,
            rarity: ach.rarity || 'common',
            progress: ach.progress || 0
        }));
    }
};
