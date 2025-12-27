<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'is_approved' => 'boolean',
        'is_pinned' => 'boolean',
    ];

    // protected $withCount = ['replies', 'likes'];

    /**
     * Get the parent commentable model (article, review, etc.).
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who wrote the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent comment (for replies).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Get replies to this comment.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->orderBy('created_at', 'asc');
    }

    /**
     * Get users who liked this comment.
     */
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'comment_likes')->withTimestamps();
    }

    /**
     * Check if current user liked this comment.
     */
    public function isLikedBy(?User $user): bool
    {
        if (!$user)
            return false;
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    /**
     * Toggle like for a user.
     */
    public function toggleLike(User $user): bool
    {
        if ($this->isLikedBy($user)) {
            $this->likes()->detach($user->id);
            $this->decrement('likes_count');
            return false;
        } else {
            $this->likes()->attach($user->id);
            $this->increment('likes_count');
            return true;
        }
    }

    /**
     * Scope for approved comments.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope for root comments (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
