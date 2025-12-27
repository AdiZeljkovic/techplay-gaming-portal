import api from './api';

export interface Category {
    id: number;
    name: string;
    slug: string;
    articles_count?: number;
}

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const response = await api.get('/categories');
        return response.data.data;
    },

    async getBySection(section: string): Promise<Category[]> {
        const response = await api.get(`/categories?section=${section}`);
        return response.data.data;
    }
};
