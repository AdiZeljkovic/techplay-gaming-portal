<?php

namespace App\Observers;

use App\Models\Article;
use App\Models\Revision;

class ArticleObserver
{
    protected $cacheService;

    public function __construct(\App\Services\GlobalCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function created(Article $article): void
    {
        if ($article->status === 'published') {
            $this->cacheService->refreshLatestArticles();
            // In case of seeder or migration importing articles with views
            if ($article->views > 0) {
                $this->cacheService->refreshPopularArticles();
            }
        }
    }

    public function updated(Article $article): void
    {
        // Only create revision if body, title or status changed
        if ($article->isDirty(['body', 'title', 'status'])) {
            Revision::create([
                'article_id' => $article->id,
                'user_id' => auth()->id() ?? $article->user_id, // Who made the change
                'content_snapshot' => json_encode([
                    'title' => $article->title,
                    'body' => $article->body,
                    'status' => $article->status,
                ]),
            ]);
        }

        // Refresh cache if relevant fields changed
        if ($article->isDirty(['status', 'title', 'published_at', 'views']) && $article->status === 'published') {
            $this->cacheService->refreshLatestArticles();
            $this->cacheService->refreshPopularArticles();
        }
    }

    public function deleted(Article $article): void
    {
        $this->cacheService->refreshLatestArticles();
        $this->cacheService->refreshPopularArticles();
    }
}
