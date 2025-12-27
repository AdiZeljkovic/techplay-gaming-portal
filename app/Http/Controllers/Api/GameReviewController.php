<?php

namespace App\Http\Controllers\Api;

use App\Models\Game;
use App\Models\GameReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class GameReviewController extends Controller
{
    public function index($gameId)
    {
        $reviews = GameReview::where('game_id', $gameId)
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(Request $request, $gameId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:10',
            'title' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:1000',
        ]);

        $game = Game::findOrFail($gameId);

        // Update or Create to allow one review per user
        $review = GameReview::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'game_id' => $game->id,
            ],
            [
                'rating' => $request->rating,
                'title' => $request->title,
                'body' => $request->body,
            ]
        );

        $newScore = $game->reviews()->avg('rating');

        return response()->json([
            'review' => $review->load('user:id,name,avatar'),
            'new_score' => round($newScore, 1)
        ]);
    }
}
