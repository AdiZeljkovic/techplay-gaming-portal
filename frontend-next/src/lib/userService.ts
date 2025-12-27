import api from './api';

export const userService = {
    async updateProfile(data: any): Promise<any> {
        const response = await api.post('/user/profile', data);
        return response.data;
    },

    async getActivity(): Promise<any[]> {
        try {
            const response = await api.get('/user/activity');
            return response.data.data.map((activity: any) => ({
                type: activity.type || 'general',
                title: activity.description || activity.title,
                time: activity.created_at,
                icon: activity.icon || 'Activity',
                color: activity.color || 'text-gray-500'
            }));
        } catch (error) {
            console.warn('Failed to fetch user activity', error);
            return [];
        }
    }
};
