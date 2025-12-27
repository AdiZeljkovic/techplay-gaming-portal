<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;

class AchievementService
{
    /**
     * Check if user qualifies for achievements of a specific type.
     */
    public function checkAndUnlock(User $user, string $type, int $currentValue): void
    {
        // Find achievements of this type that the user hasn't unlocked yet
        // and where the current value meets or exceeds the requirement.
        $achievements = Achievement::where('criteria_type', $type)
            ->where('criteria_value', '<=', $currentValue)
            ->get();

        foreach ($achievements as $achievement) {
            if (!$user->achievements()->where('achievement_id', $achievement->id)->exists()) {
                $this->unlock($user, $achievement);
            }
        }
    }

    /**
     * Unlock a specific achievement for a user.
     */
    public function unlock(User $user, Achievement $achievement): void
    {
        $user->achievements()->attach($achievement->id, ['unlocked_at' => now()]);

        // Add XP for the achievement
        $user->addXp($achievement->xp);

        // Optional: Create a notification or activity log
        // Notification::send($user, new AchievementUnlocked($achievement));
    }
}
