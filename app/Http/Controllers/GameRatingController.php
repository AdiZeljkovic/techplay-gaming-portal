<?php

namespace App\Http\Controllers;

use App\Models\GameRating;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GameRatingController extends Controller
{
    /**
     * Get ratings for a specific game.
     */
    public function index(string $gameSlug): JsonResponse
    {
        $stats = GameRating::where('game_slug', $gameSlug)
            ->selectRaw('COUNT(*) as count, AVG(rating) as average')
            ->first();

        // Get user's rating if authenticated
        $userRating = null;
        if (auth()->check()) {
            $userRating = GameRating::where('game_slug', $gameSlug)
                ->where('user_id', auth()->id())
                ->value('rating');
        }

        return response()->json([
            'stats' => [
                'count' => (int) $stats->count,
                'average' => round((float) $stats->average, 1),
            ],
            'user_rating' => $userRating,
        ]);
    }

    /**
     * Submit or update a rating for a game.
     */
    public function store(Request $request, string $gameSlug): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $rating = GameRating::updateOrCreate(
            [
                'game_slug' => $gameSlug,
                'user_id' => $request->user()->id,
            ],
            [
                'rating' => $validated['rating'],
            ]
        );

        // Get updated stats
        $stats = GameRating::where('game_slug', $gameSlug)
            ->selectRaw('COUNT(*) as count, AVG(rating) as average')
            ->first();

        return response()->json([
            'message' => 'Rating saved successfully',
            'stats' => [
                'count' => (int) $stats->count,
                'average' => round((float) $stats->average, 1),
            ],
            'user_rating' => $rating->rating,
        ]);
    }
}
