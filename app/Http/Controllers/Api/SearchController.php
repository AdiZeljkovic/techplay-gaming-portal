<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    /**
     * Instant Search endpoint for Meilisearch.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        // Search Articles
        $articles = Article::search($query)
            ->take(10)
            ->get()
            ->map(fn($a) => [
                'type' => 'article',
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'excerpt' => $a->excerpt,
                'image' => $a->getFirstMediaUrl('cover') ?: $a->getFirstMediaUrl('featured_image'),
                'section' => $a->section,
            ]);

        // Search Games (if Game model has Searchable trait)
        $games = collect();
        if (class_exists(Game::class) && in_array(\Laravel\Scout\Searchable::class, class_uses_recursive(Game::class))) {
            $games = Game::search($query)
                ->take(5)
                ->get()
                ->map(fn($g) => [
                    'type' => 'game',
                    'id' => $g->id,
                    'title' => $g->name,
                    'slug' => $g->slug,
                    'image' => $g->background_image,
                ]);
        }

        return response()->json([
            'results' => $articles->merge($games)->take(15),
        ]);
    }
}
