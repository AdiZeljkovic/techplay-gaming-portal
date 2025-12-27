<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Get cover image - prioritize local manual download (most reliable)
        $coverImage = null;

        // 1. Check for manually downloaded image in 'featured' folder
        $manualPath = storage_path("app/public/featured/{$this->id}.jpg");
        if (file_exists($manualPath)) {
            $coverImage = config('app.url') . "/storage/featured/{$this->id}.jpg";
        }

        // 2. Check Spatie Media Library
        if (!$coverImage) {
            $media = $this->getFirstMedia('featured_image');
            if ($media && file_exists($media->getPath())) {
                $url = $media->getUrl();
                if (str_starts_with($url, '/')) {
                    $coverImage = config('app.url') . $url;
                } else {
                    $coverImage = $url;
                }
            }
        }

        // 3. Fallback: check for rawg: tag and use RAWG image (direct from CDN)
        if (!$coverImage) {
            $rawgTag = $this->tags->first(fn($t) => str_starts_with($t->name, 'rawg:'));
            if ($rawgTag) {
                // ... (rest of RAWG logic)
                $gameSlug = str_replace('rawg:', '', $rawgTag->name);
                $coverImage = "https://media.rawg.io/media/games/{$gameSlug}.jpg";
            }
        }

        // Final fallback: picsum placeholder
        if (!$coverImage) {
            $coverImage = 'https://picsum.photos/seed/' . $this->id . '/800/600';
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'image' => $coverImage,
            'excerpt' => $this->excerpt,
            'content' => $this->body, // Frontend expects 'content' not 'body'
            'body' => $this->when($this->body, $this->body), // Keep for backwards compat
            'section' => $this->section,
            'status' => $this->status,
            'is_published' => $this->status === 'published',
            'published_at' => $this->published_at?->format('Y-m-d'),
            'views' => $this->views ?? 0,
            'rating' => $this->rating,
            'is_featured' => $this->is_featured ?? false,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'author' => [
                'id' => $this->author?->id,
                'name' => $this->author?->name ?? 'Unknown',
                'bio' => $this->author?->profile?->bio ?? 'Tech enthusiast and gamer.',
                'avatar' => $this->author?->profile_photo_url,
            ],
            'tags' => $this->tags->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name, // Spatie tags have 'name' as translatable array or string
            ]),
            'media' => $this->getMedia('articles')->map(fn($m) => [
                'id' => $m->id,
                'uuid' => $m->uuid,
                'original_url' => $m->getUrl(),
            ]),
            'comments_count' => $this->whenCounted('comments'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
