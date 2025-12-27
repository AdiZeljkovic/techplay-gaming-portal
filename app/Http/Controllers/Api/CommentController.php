<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Article;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Get comments for a specific resource.
     */
    public function index(Request $request, string $type, int $id): JsonResponse
    {
        $model = $this->resolveModel($type, $id);

        if (!$model) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        $comments = $model->comments()
            ->approved()
            ->root()
            ->with(['user', 'replies.user'])
            ->withCount(['replies', 'likes'])
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Add isLiked flag for authenticated user
        $user = $request->user();
        $comments->getCollection()->transform(function ($comment) use ($user) {
            $comment->is_liked = $comment->isLikedBy($user);
            $comment->replies->transform(function ($reply) use ($user) {
                $reply->is_liked = $reply->isLikedBy($user);
                return $reply;
            });
            return $comment;
        });

        return response()->json([
            'data' => $comments->items(),
            'meta' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    /**
     * Store a new comment.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'commentable_type' => 'required|string|in:article,review',
            'commentable_id' => 'required|integer',
            'parent_id' => 'nullable|exists:comments,id',
            'body' => 'required|string|min:1|max:5000',
        ]);

        $model = $this->resolveModel($validated['commentable_type'], $validated['commentable_id']);

        if (!$model) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'commentable_type' => get_class($model),
            'commentable_id' => $model->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'body' => $validated['body'],
            'is_approved' => true, // Auto-approve, or set to false for moderation
        ]);

        $comment->load('user');
        $comment->loadCount(['replies', 'likes']);

        // Notify parent comment author if this is a reply
        if ($comment->parent_id) {
            $parentInfo = Comment::where('id', $comment->parent_id)->with('user')->first();
            if ($parentInfo && $parentInfo->user && $parentInfo->user_id !== $comment->user_id) {
                $parentInfo->user->notify(new \App\Notifications\CommentReplyNotification($comment));
            }
        }

        return response()->json([
            'data' => $comment,
            'message' => 'Comment added successfully'
        ], 201);
    }

    /**
     * Update a comment.
     */
    public function update(Request $request, Comment $comment): JsonResponse
    {
        // Users can only update their own comments
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string|min:1|max:5000',
        ]);

        $comment->update($validated);

        return response()->json([
            'data' => $comment,
            'message' => 'Comment updated successfully'
        ]);
    }

    /**
     * Delete a comment.
     */
    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        // Users can only delete their own comments
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * Toggle like on a comment.
     */
    public function toggleLike(Request $request, Comment $comment): JsonResponse
    {
        $liked = $comment->toggleLike($request->user());

        return response()->json([
            'liked' => $liked,
            'likes_count' => $comment->loadCount('likes')->likes_count
        ]);
    }

    /**
     * Resolve model from type string.
     */
    private function resolveModel(string $type, int $id)
    {
        return match ($type) {
            'article', 'articles' => Article::find($id),
            'review', 'reviews' => Review::find($id),
            default => null,
        };
    }
}
