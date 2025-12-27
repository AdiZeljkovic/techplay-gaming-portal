<?php

namespace App\Services;

use App\Models\Article;
use App\Http\Resources\CompactArticleResource;
use Illuminate\Support\Facades\Cache;

class GlobalCacheService
{
    const KEY_LATEST = 'global:articles:latest';
    const KEY_POPULAR = 'global:articles:popular';
    const TTL = 60 * 5; // 5 minutes

    /**
     * Refresh the 'latest articles' list in cache.
     */
    public function refreshLatestArticles(): void
    {
        try {
            $articles = Article::with(['author', 'category'])
                ->where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->limit(20)
                ->get();

            $resource = CompactArticleResource::collection($articles);
            Cache::put(self::KEY_LATEST, json_encode($resource), self::TTL);
        } catch (\Exception $e) {
            report($e);
        }
    }

    /**
     * Refresh the 'popular articles' list in cache.
     */
    public function refreshPopularArticles(): void
    {
        try {
            $articles = Article::with(['author', 'category'])
                ->where('status', 'published')
                ->orderBy('views', 'desc')
                ->limit(10)
                ->get();

            $resource = CompactArticleResource::collection($articles);
            Cache::put(self::KEY_POPULAR, json_encode($resource), self::TTL);
        } catch (\Exception $e) {
            report($e);
        }
    }

    /**
     * Get latest articles from cache with SQL fallback.
     */
    public function getLatestArticles(): ?array
    {
        try {
            $cached = Cache::get(self::KEY_LATEST);

            if ($cached) {
                return json_decode($cached, true);
            }

            // Fallback: fetch from DB directly
            $articles = Article::with(['author', 'category'])
                ->where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->limit(20)
                ->get();

            return CompactArticleResource::collection($articles)->toArray(request());
        } catch (\Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Get popular articles from cache with SQL fallback.
     */
    public function getPopularArticles(): ?array
    {
        try {
            $cached = Cache::get(self::KEY_POPULAR);

            if ($cached) {
                return json_decode($cached, true);
            }

            // Fallback: fetch from DB directly
            $articles = Article::with(['author', 'category'])
                ->where('status', 'published')
                ->orderBy('views', 'desc')
                ->limit(10)
                ->get();

            return CompactArticleResource::collection($articles)->toArray(request());
        } catch (\Exception $e) {
            report($e);
            return null;
        }
    }
}
