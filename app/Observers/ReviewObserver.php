<?php

namespace App\Observers;

use App\Models\Review;

class ReviewObserver
{
    /**
     * Handle the Review "created" event.
     */
    public function created(Review $review): void
    {
        $user = $review->user;

        // 1. Give XP for reviewing (more than commenting)
        $user->addXp(50);

        // 2. Check for "The Critic" etc.
        $reviewCount = $user->reviews()->count();
        $user->checkAchievementUnlock('reviews_count', $reviewCount);
    }
}
