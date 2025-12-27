import api from './api';
import { Product } from './types';

export const shopService = {
    async getProducts(category?: string): Promise<Product[]> {
        const query = category && category !== 'All' ? `?category=${category}` : '';
        const response = await api.get(`/products${query}`);
        return response.data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image: p.image || p.media?.[0]?.original_url || 'https://via.placeholder.com/400',
            gallery: p.gallery || [],
            category: p.category?.name || p.category || 'Uncategorized',
            description: p.description,
            features: p.features || [],
            rating: p.rating || 0,
            reviews: p.reviews_count || 0,
            isNew: p.is_new || false,
            isSale: p.is_sale || false,
            colors: p.colors || [],
            sizes: p.sizes || []
        }));
    },

    async getProductById(id: number): Promise<Product | undefined> {
        try {
            const response = await api.get(`/products/${id}`);
            const p = response.data.data;
            return {
                id: p.id,
                name: p.name,
                price: parseFloat(p.price),
                image: p.image || p.media?.[0]?.original_url || 'https://via.placeholder.com/400',
                gallery: p.gallery || [],
                category: p.category?.name || p.category || 'Uncategorized',
                description: p.description,
                features: p.features || [],
                rating: p.rating || 0,
                reviews: p.reviews_count || 0,
                isNew: p.is_new || false,
                isSale: p.is_sale || false,
                colors: p.colors || [],
                sizes: p.sizes || []
            };
        } catch (error) {
            console.error('Failed to fetch product', error);
            return undefined;
        }
    },

    async getFeaturedProducts(): Promise<Product[]> {
        const response = await api.get('/products/featured');
        return response.data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image: p.image || p.media?.[0]?.original_url || 'https://via.placeholder.com/400',
            gallery: p.gallery || [],
            category: p.category?.name || p.category || 'Uncategorized',
            description: p.description,
            features: p.features || [],
            rating: p.rating || 0,
            reviews: p.reviews_count || 0,
            isNew: p.is_new || false,
            isSale: p.is_sale || false
        }));
    },

    async getOrders(): Promise<any[]> {
        const response = await api.get('/orders');
        return response.data.data.map((order: any) => ({
            id: order.id,
            date: order.created_at,
            total: parseFloat(order.total),
            status: order.status,
            items: order.items?.map((item: any) => ({
                name: item.product?.name || item.name,
                quantity: item.quantity,
                price: parseFloat(item.price),
                image: item.product?.image || 'https://via.placeholder.com/100'
            })) || []
        }));
    }
};
