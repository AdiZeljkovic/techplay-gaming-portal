<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;

use Spatie\Feed\Feedable;
use Spatie\Feed\FeedItem;
use Laravel\Scout\Searchable;

class Article extends Model implements HasMedia, Feedable
{
    use HasFactory, InteractsWithMedia, HasTags, \Spatie\Activitylog\Traits\LogsActivity, Searchable;

    public function getActivitylogOptions(): \Spatie\Activitylog\LogOptions
    {
        return \Spatie\Activitylog\LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty();
    }

    public function scopeNews($query)
    {
        return $query->where('section', 'news');
    }

    public function scopeReviews($query)
    {
        return $query->where('section', 'reviews');
    }

    public function scopeTech($query)
    {
        return $query->where('section', 'tech');
    }

    public function scopeGuides($query)
    {
        return $query->where('section', 'guides');
    }

    public function scopeSection($query, $section)
    {
        return $query->where('section', $section);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    protected $guarded = [];

    /**
     * Get the route key for the model.
     * This enables route model binding to use slug instead of id.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the indexable data array for the model (Meilisearch).
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt ?? '',
            'body' => strip_tags($this->body ?? ''),
            'section' => $this->section,
            'category' => $this->category?->name ?? '',
            'author' => $this->author?->name ?? '',
            'published_at' => $this->published_at?->timestamp,
        ];
    }

    protected $casts = [
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'submitted_at' => 'datetime',
        'rating' => 'decimal:1',
    ];

    // Status constants
    const STATUS_DRAFT = 'draft';
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_PUBLISHED = 'published';

    public function submitForReview(): void
    {
        $this->update([
            'status' => self::STATUS_SUBMITTED,
            'submitted_at' => now(),
        ]);
    }

    public function approve(User $reviewer): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'reviewed_by' => $reviewer->id,
            'rejection_reason' => null,
        ]);
    }

    public function reject(User $reviewer, string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'reviewed_by' => $reviewer->id,
            'rejection_reason' => $reason,
        ]);
    }

    public function schedule(\DateTime $publishAt): void
    {
        $this->update([
            'status' => self::STATUS_SCHEDULED,
            'scheduled_at' => $publishAt,
        ]);
    }

    public function publish(): void
    {
        $this->update([
            'status' => self::STATUS_PUBLISHED,
            'published_at' => now(),
            'scheduled_at' => null,
        ]);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function liveUpdates(): HasMany
    {
        return $this->hasMany(LiveUpdate::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(Revision::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function polls(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Poll::class);
    }

    public function toFeedItem(): FeedItem
    {
        return FeedItem::create()
            ->id($this->id)
            ->title($this->title)
            ->summary($this->excerpt ?? substr(strip_tags($this->body), 0, 200))
            ->updated($this->updated_at)
            ->link("/articles/{$this->slug}")
            ->authorName($this->author->name)
            ->authorEmail($this->author->email);
    }

    public static function getFeedItems()
    {
        return Article::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->limit(50)
            ->get();
    }
}
