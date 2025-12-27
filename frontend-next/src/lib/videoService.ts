import api from './api';

export interface Video {
    id: number;
    title: string;
    youtube_url: string;
    thumbnail_url: string;
    is_featured: boolean;
    published_at: string;
    created_at: string;
}

export const videoService = {
    async getVideos(page = 1): Promise<{ data: Video[], links: any, meta: any }> {
        const response = await api.get(`/videos?page=${page}`);
        return response.data;
    },

    async getAll(): Promise<Video[]> {
        const response = await api.get('/videos');
        return response.data.data;
    }
};
