import api from './api';
import { Post } from './types';

// Utility to strip HTML tags from text
function stripHtml(html: string): string {
    if (!html) return '';
    // Remove all HTML tags
    return html.replace(/<[^>]*>/g, '').trim();
}

// Extract image URL from HTML string (in case title contains <img> tag)
function extractImageFromHtml(html: string): string | null {
    if (!html) return null;
    const match = html.match(/src=["']([^"']+)["']/);
    return match ? match[1] : null;
}

// Mapper function to convert Backend Article to Frontend Post
function mapToPost(data: any): Post {
    const getTagName = (tag: any): string => {
        if (typeof tag.name === 'string') return tag.name;
        if (typeof tag.name === 'object' && tag.name.en) return tag.name.en;
        return 'Unknown';
    };

    // Get best available image
    const getImage = (): string => {
        const rootUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        let imageUrl = '';

        // Determine the raw image URL
        if (data.image && !data.image.includes('picsum')) {
            imageUrl = data.image;
        } else if (data.featured_image_url) {
            imageUrl = data.featured_image_url;
        } else if (data.media?.[0]?.original_url) {
            imageUrl = data.media[0].original_url;
        } else {
            const embeddedImage = extractImageFromHtml(data.title);
            if (embeddedImage) imageUrl = embeddedImage;
        }

        // If no image found, return fallback
        if (!imageUrl) {
            return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
        }

        // Check if it's a relative path (starts with /) and not a blob/data URI
        if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
            return `${rootUrl}${imageUrl}`;
        }

        return imageUrl;
    };

    // Clean title of any HTML
    const cleanTitle = stripHtml(data.title);

    return {
        id: data.id.toString(),
        slug: data.slug,
        title: cleanTitle,
        excerpt: stripHtml(data.excerpt),
        content: data.content,
        image: getImage(),
        coverImageAlt: cleanTitle,
        category: data.category?.name || (data.section ? data.section.charAt(0).toUpperCase() + data.section.slice(1) : 'News'),
        section: data.section,
        subcategory: data.tags?.[0] ? getTagName(data.tags[0]) : 'General',
        rating: data.rating,
        author: {
            id: data.author?.id?.toString(),
            username: data.author?.name || 'Unknown',
            avatar: data.author?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.author?.name || 'User'),
            level: 1,
            role: 'User',
            bio: data.author?.bio || 'Tech enthusiast and gamer.',
        },
        date: data.published_at,
        views: data.views || 0,
        comments_count: data.comments_count || 0,
        status: data.is_published ? 'Published' : 'Draft',
        tags: data.tags?.map((t: any) => getTagName(t)) || []
    };
}

// Mapper from Frontend Post -> Backend Payload
function mapToPayload(post: Partial<Post>): any {
    return {
        title: post.title,
        body: post.content,
        excerpt: post.excerpt,
        section: post.category?.toLowerCase() || 'news',
        status: post.status === 'Published' ? 'published' : 'draft',
        tags: post.tags,
    };
}

export const articleService = {
    async getAll(): Promise<Post[]> {
        const response = await api.get('/articles');
        return response.data.data.map(mapToPost);
    },

    async getBySlug(slug: string): Promise<Post> {
        const response = await api.get(`/articles/${slug}`);
        return mapToPost(response.data.data);
    },

    async getArticles(params: { section?: string; category?: string; tag?: string; limit?: number; search?: string } = {}): Promise<Post[]> {
        const query = new URLSearchParams();
        if (params.section) query.append('section', params.section);
        if (params.category) query.append('category', params.category);
        if (params.tag) query.append('tag', params.tag);
        if (params.limit) query.append('per_page', params.limit.toString());
        if (params.search) query.append('search', params.search);

        const response = await api.get(`/articles?${query.toString()}`);
        return response.data.data.map(mapToPost);
    },

    async getLatest(): Promise<Post[]> {
        const response = await api.get('/articles?sort=-created_at&limit=50');
        return response.data.data.map(mapToPost);
    },

    async getFeatured(): Promise<Post[]> {
        const response = await api.get('/articles?featured=true&limit=5');
        const posts = response.data.data.map(mapToPost);
        return posts.length > 0 ? posts : this.getLatest();
    },

    async getMostRead(): Promise<Post[]> {
        const response = await api.get('/articles?sort=views&limit=5');
        return response.data.data.map(mapToPost);
    },

    async create(post: Partial<Post>): Promise<Post> {
        const payload = mapToPayload(post);
        const response = await api.post('/articles', payload);
        return mapToPost(response.data.data);
    },

    async update(id: string, post: Partial<Post>): Promise<Post> {
        const payload = mapToPayload(post);
        const response = await api.put(`/articles/${id}`, payload);
        return mapToPost(response.data.data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/articles/${id}`);
    },

    async save(post: Partial<Post>): Promise<Post> {
        if (post.id && !post.id.startsWith('p')) {
            return this.update(post.id, post);
        } else {
            return this.create(post);
        }
    },

    async getVideos(): Promise<Post[]> {
        // Assuming 'Video' is a category or we filter by media type
        const response = await api.get('/articles?category=Video&limit=3');
        return response.data.data.map(mapToPost);
    },

    async getGuides(): Promise<Post[]> {
        const response = await api.get('/articles?category=Guide&limit=3');
        return response.data.data.map(mapToPost);
    },

    async getForumThreads(): Promise<any[]> {
        // Fetching real threads
        try {
            const response = await api.get('/threads?limit=5');
            // Map backend thread to frontend interface
            return response.data.data.map((thread: any) => ({
                id: thread.id.toString(),
                title: thread.title,
                replies: thread.posts_count || 0,
                category: thread.category?.title || 'General',
                isNew: new Date(thread.created_at) > new Date(Date.now() - 86400000)
            }));
        } catch (error) {
            console.warn('Failed to fetch threads', error);
            return [];
        }
    }
};
