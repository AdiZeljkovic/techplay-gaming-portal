<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use App\Models\User;

class LeaderboardService
{
    private const GLOBAL_KEY = 'leaderboard:global';
    private const WEEKLY_KEY = 'leaderboard:weekly';
    private const MONTHLY_KEY = 'leaderboard:monthly';

    /**
     * Add or update a user's score in the leaderboard.
     * Uses Redis ZADD command.
     *
     * @param int $userId
     * @param int $score Total XP/points
     * @param string $type 'global', 'weekly', 'monthly'
     */
    public function updateScore(int $userId, int $score, string $type = 'global'): void
    {
        $key = $this->getKey($type);
        Redis::zadd($key, $score, $userId);
    }

    /**
     * Increment a user's score by a given amount.
     *
     * @param int $userId
     * @param int $amount Points to add
     * @param string $type Leaderboard type
     */
    public function incrementScore(int $userId, int $amount, string $type = 'global'): void
    {
        $key = $this->getKey($type);
        Redis::zincrby($key, $amount, $userId);
    }

    /**
     * Get top players from leaderboard.
     * Uses Redis ZREVRANGE for descending order.
     *
     * @param int $limit Number of top players (default 10)
     * @param string $type Leaderboard type
     * @return array Array of ['user_id' => score]
     */
    public function getTop(int $limit = 10, string $type = 'global'): array
    {
        $key = $this->getKey($type);
        return Redis::zrevrange($key, 0, $limit - 1, ['WITHSCORES' => true]) ?? [];
    }

    /**
     * Get top players with full user data.
     *
     * @param int $limit
     * @param string $type
     * @return \Illuminate\Support\Collection
     */
    public function getTopWithUsers(int $limit = 10, string $type = 'global')
    {
        $scores = $this->getTop($limit, $type);
        $userIds = array_keys($scores);

        if (empty($userIds)) {
            return collect([]);
        }

        $users = User::whereIn('id', $userIds)
            ->with(['rank', 'profile'])
            ->get()
            ->keyBy('id');

        $result = [];
        $rank = 1;
        foreach ($scores as $userId => $score) {
            if (isset($users[$userId])) {
                $user = $users[$userId];
                $result[] = [
                    'rank' => $rank++,
                    'user_id' => $userId,
                    'name' => $user->name,
                    'avatar' => $user->profile_photo_url,
                    'level' => $user->profile?->level ?? 1,
                    'rank_name' => $user->rank?->name ?? 'Rookie',
                    'score' => (int) $score,
                ];
            }
        }

        return collect($result);
    }

    /**
     * Get a user's rank in the leaderboard.
     *
     * @param int $userId
     * @param string $type
     * @return int|null Rank (1-indexed) or null if not ranked
     */
    public function getUserRank(int $userId, string $type = 'global'): ?int
    {
        $key = $this->getKey($type);
        $rank = Redis::zrevrank($key, $userId);
        return $rank !== null ? $rank + 1 : null;
    }

    /**
     * Get a user's score.
     *
     * @param int $userId
     * @param string $type
     * @return int
     */
    public function getUserScore(int $userId, string $type = 'global'): int
    {
        $key = $this->getKey($type);
        return (int) (Redis::zscore($key, $userId) ?? 0);
    }

    /**
     * Sync all users' XP from database to Redis.
     * Usually called via a scheduled job.
     */
    public function syncFromDatabase(): void
    {
        User::where('xp', '>', 0)->chunk(500, function ($users) {
            foreach ($users as $user) {
                $this->updateScore($user->id, $user->xp);
            }
        });
    }

    /**
     * Reset weekly/monthly leaderboards.
     */
    public function resetLeaderboard(string $type): void
    {
        $key = $this->getKey($type);
        Redis::del($key);
    }

    private function getKey(string $type): string
    {
        return match ($type) {
            'weekly' => self::WEEKLY_KEY,
            'monthly' => self::MONTHLY_KEY,
            default => self::GLOBAL_KEY,
        };
    }
}
