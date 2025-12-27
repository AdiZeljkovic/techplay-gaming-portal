<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Get all available achievements.
     */
    public function index(Request $request)
    {
        $achievements = Achievement::all();
        $user = $request->user('sanctum');

        if ($user) {
            // Eager load unlocked achievements to minimize queries
            $unlockedIds = $user->achievements()->pluck('achievement_id')->toArray();

            // Get current counts for progress calculation
            $counts = [
                'comments_count' => $user->comments()->count(),
                'reviews_count' => $user->reviews()->count(),
                'friends_count' => $user->friends->count(),
                'level_reach' => $user->rank_id, // Approximation
                // Add others as needed
            ];

            return $achievements->map(function ($ach) use ($unlockedIds, $counts) {
                $ach->is_unlocked = in_array($ach->id, $unlockedIds);

                // Calculate progress
                $current = 0;
                if (isset($counts[$ach->criteria_type])) {
                    $current = $counts[$ach->criteria_type];
                }

                // Special cases or defaults
                if ($ach->is_unlocked) {
                    $ach->progress = 100;
                } else {
                    $ach->progress = $ach->criteria_value > 0
                        ? min(100, round(($current / $ach->criteria_value) * 100))
                        : 0;
                }

                return $ach;
            });
        }

        return $achievements;
    }
}
