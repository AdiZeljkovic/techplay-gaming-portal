<?php

namespace App\Observers;

use App\Models\Comment;
use App\Models\Thread;
use App\Models\Post;

class UserActivityObserver
{
    public function created(mixed $model): void
    {
        $xp = match (get_class($model)) {
            Comment::class => 10,  // Was 1
            Thread::class => 20,   // Was 5
            Post::class => 5,      // Was 1
            default => 0,
        };

        if ($xp > 0 && $model->user) {
            $model->user->addXp($xp);

            if ($model instanceof Comment) {
                // Criteria: comments_count (matches AchievementSeeder)
                $count = $model->user->comments()->count();
                $model->user->checkAchievementUnlock('comments_count', $count);

                activity()
                    ->performedOn($model)
                    ->causedBy($model->user)
                    ->log('posted a comment');
            } elseif ($model instanceof Thread) {
                // Criteria: threads_count
                $count = $model->user->threads()->count();
                $model->user->checkAchievementUnlock('threads_count', $count);

                activity()
                    ->performedOn($model)
                    ->causedBy($model->user)
                    ->log('started a new thread');
            } elseif ($model instanceof Post) {
                // Criteria: posts_count (forum replies) - distinct from comments? 
                // Seeder has 'comments_count', maybe add 'posts_count' later or treat as same?
                // Let's use 'comments_count' for now as "participation" or add new criteria.
                // Seeder didn't explicitly have 'forum_reply_count', just 'threads_count'.
                // Let's leave achievement check out for posts/replies for now unless we add it to seeder.

                activity()
                    ->performedOn($model)
                    ->causedBy($model->user)
                    ->log('replied to a thread');
            }
        }
    }
}
