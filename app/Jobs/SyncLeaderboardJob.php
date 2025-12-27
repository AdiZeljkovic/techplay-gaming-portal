<?php

namespace App\Jobs;

use App\Services\LeaderboardService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncLeaderboardJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        //
    }

    /**
     * Sync all user XP scores from PostgreSQL to Redis leaderboard.
     */
    public function handle(LeaderboardService $leaderboardService): void
    {
        $leaderboardService->syncFromDatabase();
    }
}
