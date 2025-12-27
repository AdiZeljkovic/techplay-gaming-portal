<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LeaderboardService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LeaderboardController extends Controller
{
    public function __construct(private LeaderboardService $leaderboard)
    {
    }

    /**
     * Get top players.
     * GET /api/leaderboard?type=global&limit=10
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->get('type', 'global');
        $limit = min((int) $request->get('limit', 10), 100);

        $leaders = $this->leaderboard->getTopWithUsers($limit, $type);

        return response()->json([
            'data' => $leaders,
            'meta' => [
                'type' => $type,
                'total' => $leaders->count(),
            ],
        ]);
    }

    /**
     * Get current user's rank.
     * GET /api/leaderboard/me
     */
    public function myRank(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        return response()->json([
            'global' => [
                'rank' => $this->leaderboard->getUserRank($userId, 'global'),
                'score' => $this->leaderboard->getUserScore($userId, 'global'),
            ],
            'weekly' => [
                'rank' => $this->leaderboard->getUserRank($userId, 'weekly'),
                'score' => $this->leaderboard->getUserScore($userId, 'weekly'),
            ],
        ]);
    }
}
