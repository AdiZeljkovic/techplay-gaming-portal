import api from './api';
import { Comment, User } from './types';

// Helper to map backend comment to frontend structure
function mapComment(data: any): Comment {
    return {
        id: data.id,
        user: {
            id: data.user?.id.toString(),
            username: data.user?.name || 'Unknown',
            avatar: data.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user?.name || 'U')}`,
            level: data.user?.level || 1,
            role: data.user?.role || 'User'
        },
        body: data.body,
        created_at: data.created_at,
        likes_count: data.likes_count || 0,
        parent_id: data.parent_id,
        // Backend returns is_liked for auth users
        is_liked: data.is_liked || false,
        replies: data.replies?.map(mapComment) || []
    };
}

export const commentService = {
    async getComments(postId: string): Promise<Comment[]> {
        // Fetch comments for 'article' type by default
        const response = await api.get(`/comments/article/${postId}`);
        // Backend returns paginated response { data: [], meta: ... }
        return response.data.data.map(mapComment);
    },

    async createComment(postId: string, body: string, parentId: number | null = null): Promise<Comment> {
        const payload = {
            commentable_type: 'article',
            commentable_id: parseInt(postId),
            body,
            parent_id: parentId
        };

        const response = await api.post('/comments', payload);
        // The endpoint returns { data: Comment, message: ... }
        return mapComment(response.data.data);
    },

    async likeComment(commentId: string | number): Promise<void> {
        await api.post(`/comments/${commentId}/like`);
    },

    // Optional: Delete comment
    async deleteComment(commentId: string | number): Promise<void> {
        await api.delete(`/comments/${commentId}`);
    }
};
