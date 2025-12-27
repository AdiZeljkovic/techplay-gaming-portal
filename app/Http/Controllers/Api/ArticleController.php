<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    protected $globalCache;

    public function __construct(\App\Services\GlobalCacheService $globalCache)
    {
        $this->globalCache = $globalCache;
    }

    public function index(Request $request)
    {
        $page = $request->page ?? 1;
        $category = $request->category ?? 'all';
        $search = $request->search ?? '';
        $section = $request->section ?? 'all';
        $featured = $request->featured ?? 'false';

        // Extreme Performance: Serve Page 1 of main feed directly from Global Redis Store
        if ($page == 1 && $category === 'all' && empty($search) && $section === 'all' && $featured === 'false' && !$request->has('tag')) {
            $latest = $this->globalCache->getLatestArticles();
            // Wrap to match paginate format roughly
            return response()->json([
                'data' => array_slice($latest, 0, 15), // Limit to standard page size
                'meta' => [
                    'current_page' => 1,
                    'per_page' => 15,
                    'total' => 1000, // Approximate, or we could cache count too
                    'last_page' => 50
                ]
            ]);
        }

        $articles = \Illuminate\Support\Facades\Cache::remember("articles_page_{$page}_cat_{$category}_sec_{$section}_search_{$search}_feat_{$featured}", 60 * 5, function () use ($request) {
            $query = Article::query()
                ->select([
                    'id',
                    'title',
                    'slug',
                    'excerpt',
                    'category_id',
                    'user_id',
                    'status',
                    'section',
                    'rating',
                    'published_at',
                    'views',
                    'is_featured',
                    'created_at'
                ])
                ->with(['category', 'author', 'tags'])
                ->where('status', 'published');

            // Apply Section Filter
            if ($request->section && $request->section !== 'all') {
                $query->where('section', $request->section);
            }

            // Apply Category Logic (Handling Virtual Categories)
            if ($request->category && $request->category !== 'all') {
                $categorySlug = $request->category;

                switch ($categorySlug) {
                    case 'latest':
                        // Just sort by date (default)
                        break;
                    case 'editors-choice':
                        $query->where('rating', '>=', 9.0);
                        break;
                    case 'aaa-titles':
                        // Assuming 'AAA' tag or featured
                        $query->where(function ($q) {
                            $q->where('is_featured', true)
                                ->orWhere(fn($sq) => $sq->withAnyTags(['aaa', 'AAA']));
                        });
                        break;
                    case 'indie-gems':
                        $query->withAnyTags(['indie', 'indie-game']);
                        break;
                    case 'retro':
                        $query->withAnyTags(['retro', 'classic', 'old-school']);
                        break;
                    default:
                        // Standard database category lookup
                        $query->whereHas('category', function ($q) use ($categorySlug) {
                            $q->where('slug', $categorySlug);
                            if (is_numeric($categorySlug)) {
                                $q->orWhere('id', $categorySlug);
                            }
                        });
                        break;
                }
            }

            // Apply Featured Filter
            if ($request->has('featured') && $request->featured === 'true') {
                $query->where('is_featured', true);
            }

            // Apply Tag Filter
            if ($request->tag) {
                $query->withAnyTags([$request->tag]);
            }

            // Apply Search
            if ($request->search) {
                $query->where('title', 'like', "%{$request->search}%");
            }

            // Sort
            if ($request->sort === 'views' || $request->sort === 'most_read') {
                $query->orderByDesc('views');
            } else {
                $query->latest('published_at');
            }

            return $query->paginate($request->per_page ?? 15);
        });

        return ArticleResource::collection($articles);
    }

    public function latest()
    {
        return response()->json(['data' => $this->globalCache->getLatestArticles()]);
    }

    public function popular()
    {
        return response()->json(['data' => $this->globalCache->getPopularArticles()]);
    }

    public function show(Article $article): ArticleResource
    {
        $article->increment('views');
        $article->load(['category', 'author', 'tags', 'liveUpdates']);
        return new ArticleResource($article);
    }

    public function store(Request $request): ArticleResource
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'excerpt' => 'nullable|string',
            'section' => 'nullable|string|in:news,reviews,tech,guides',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'in:draft,published,live',
            'rating' => 'nullable|numeric|min:0|max:10',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']);
        $validated['section'] = $request->section ?? 'news'; // Default to news

        $article = Article::create($validated);

        if ($request->has('tags')) {
            $article->attachTags($request->tags);
        }

        return new ArticleResource($article);
    }

    public function update(Request $request, Article $article): ArticleResource
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'excerpt' => 'nullable|string',
            'section' => 'nullable|string|in:news,reviews,tech,guides',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'in:draft,published,live',
        ]);

        $article->update($validated);

        if ($request->has('tags')) {
            $article->syncTags($request->tags);
        }

        return new ArticleResource($article);
    }

    public function destroy(Article $article): \Illuminate\Http\JsonResponse
    {
        $article->delete();
        return response()->json(['message' => 'Article deleted']);
    }
}
