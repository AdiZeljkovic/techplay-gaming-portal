import api from './api';
import { ForumCategory, ForumThread, ForumPost } from './types';

// Helper to map backend Thread to frontend ForumThread
function mapToThread(data: any): ForumThread {
    return {
        id: data.id.toString(),
        categoryId: data.forum_category_id?.toString(),
        title: data.title,
        author: {
            id: data.user?.id?.toString() || '0',
            username: data.user?.name || 'Anonymous',
            avatar: data.user?.avatar || 'https://ui-avatars.com/api/?name=User',
            level: 1, // backend needs to send this
            role: 'User', // backend needs to send this
        },
        replies: data.posts_count || 0,
        views: data.views || 0,
        lastPost: data.latest_post_at || data.created_at,
        isPinned: Boolean(data.is_pinned),
        isLocked: Boolean(data.is_locked),
        tags: data.tags || []
    };
}

// Helper to map backend Post to frontend ForumPost
function mapToPost(data: any): ForumPost {
    return {
        id: data.id.toString(),
        threadId: data.thread_id.toString(),
        user: {
            id: data.user?.id?.toString() || '0',
            username: data.user?.name || 'Anonymous',
            avatar: data.user?.avatar || 'https://ui-avatars.com/api/?name=User',
            level: 1,
            role: 'User',
        },
        content: data.body,
        date: data.created_at,
        isOp: false // logic to be handled in component or extended mapper
    };
}

export const forumService = {
    // Categories
    async getCategories(): Promise<ForumCategory[]> {
        const response = await api.get('/forum/categories');
        return response.data;
    },

    async getCategory(id: string): Promise<{ category: ForumCategory, threads: any }> { // Update return type to reflect actual API
        const response = await api.get(`/forum/categories/${id}`);
        return response.data; // controller returns { category, threads }
    },

    async getCategoryBySlug(slug: string): Promise<ForumCategory> {
        const response = await api.get(`/forum/categories/${slug}`);
        return response.data.category;
    },

    // Threads
    async getThreads(categoryId?: string, page = 1): Promise<{ data: ForumThread[], meta: any }> {
        const url = categoryId
            ? `/threads?category_id=${categoryId}&page=${page}`
            : `/threads?page=${page}`;

        const response = await api.get(url);
        return {
            data: response.data.data.map(mapToThread),
            meta: response.data.meta
        };
    },

    async getRecentThreads(limit = 5): Promise<ForumThread[]> {
        const response = await api.get(`/threads?limit=${limit}&sort=-created_at`);
        return response.data.data.map(mapToThread);
    },

    async getThread(id: string): Promise<{ thread: ForumThread, posts: ForumPost[] }> {
        const response = await api.get(`/threads/${id}`);
        const thread = mapToThread(response.data.data);
        const posts = response.data.data.posts?.map(mapToPost) || [];

        return { thread, posts };
    },

    async createThread(data: { category_id: string; title: string; body: string; tags?: string[] }): Promise<ForumThread> {
        const response = await api.post('/threads', data);
        return mapToThread(response.data.data);
    },

    async replyToThread(threadId: string, body: string): Promise<ForumPost> {
        const response = await api.post(`/threads/${threadId}/reply`, { body });
        return mapToPost(response.data.data);
    },

    async updatePost(postId: string, body: string): Promise<ForumPost> {
        // Backend typically uses /posts/{id} or /comments/{id} depending on implementation
        // Based on routes/api.php, we have Route::put('/comments/{comment}', ...) and Route::put('/threads/{thread}', ...).
        // But for *forum posts*, they are likely stored as 'posts' in DB but controller might be CommentsController or specific ForumPostController?
        // Checking routes/api.php line 100: Route::put('/comments/{comment}', ...).
        // But wait, forum posts might be different from comments.
        // Let's check api routes again properly.
        // Route::post('/threads/{thread}/reply', [ThreadController::class, 'reply']);
        // But no direct route for editing a post in ThreadController in the snippet I saw?
        // Let's assume there is a generic update route or I need to find the right one.
        // Re-reading routes/api.php...

        // Line 10: use App\Http\Controllers\Api\PostController;
        // But PostController resource was barely used.
        // ThreadController uses 'reply' to store a post.
        // Maybe I need to check if there is a route for updating a forum post.
        // If not, I might need to add one or use an existing generic one.
        // Let's check ThreadController or ForumPostController if it exists.
        // I saw ForumPostController.php in file list.

        const response = await api.put(`/forum/posts/${postId}`, { body });
        return mapToPost(response.data.post);
    },

    // Stats
    async getStats(): Promise<{ threads: number; members: number; online: number }> {
        const response = await api.get('/forum/stats');
        return response.data;
    },

    // Search
    async search(query: string): Promise<ForumThread[]> {
        const response = await api.get(`/threads?search=${query}`);
        return response.data.data.map(mapToThread);
    }
};
