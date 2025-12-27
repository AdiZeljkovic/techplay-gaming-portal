<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompactArticleResource extends JsonResource
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
                $gameSlug = str_replace('rawg:', '', $rawgTag->name);
                $coverImage = "https://media.rawg.io/media/games/{$gameSlug}.jpg";
            }
        }

        // 4. Final fallback: picsum
        if (!$coverImage) {
            $coverImage = 'https://picsum.photos/seed/' . $this->id . '/800/600';
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'image' => $coverImage,
            'category' => $this->category ? $this->category->name : 'News',
            'author' => [
                'name' => $this->author?->name ?? 'Unknown',
                'avatar' => $this->author?->profile_photo_url,
            ],
            'published_at' => $this->published_at?->format('Y-m-d'),
            'views' => $this->views ?? 0,
            'comments_count' => $this->comments_count ?? 0,
        ];
    }
}
