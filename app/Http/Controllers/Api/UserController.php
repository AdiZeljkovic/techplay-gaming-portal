<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Get the authenticated user with relations.
     */
    public function me(Request $request)
    {
        return $request->user()
            ->load(['rank', 'achievements', 'profile', 'socialIdentities'])
            ->loadCount(['threads', 'reviews', 'orders', 'posts']);
    }

    /**
     * Update user profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'bio' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|url',
            'banner_url' => 'nullable|url',
            'computer_specs' => 'nullable|array',
            'consoles' => 'nullable|array',
            'games_list' => 'nullable|array',
        ]);

        // Ensure profile exists
        if (!$user->profile) {
            $user->profile()->create([]);
            $user->load('profile');
        }

        $user->profile->update($validated);

        $user->profile->update($validated);

        if (!empty($validated['computer_specs'])) {
            $user->checkAchievementUnlock('specs_complete', 1);
        }

        // Also check for 'profile_complete' (bio + avatar)
        if ($user->profile->biography && $user->profile->profile_picture_path) {
            $user->checkAchievementUnlock('profile_complete', 1);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load(['rank', 'achievements', 'profile', 'socialIdentities'])
        ]);
    }
    /**
     * Get user activity feed.
     */
    public function activity(Request $request)
    {
        $activities = \Spatie\Activitylog\Models\Activity::where('causer_type', 'App\Models\User')
            ->where('causer_id', $request->user()->id)
            ->latest()
            ->take(20)
            ->get();

        return response()->json($activities);
    }
}
