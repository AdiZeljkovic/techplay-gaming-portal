<?php

namespace App\Services;

use App\Models\Game;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GameSyncService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.rawg.io/api/games';

    public function __construct()
    {
        // Ideally from config, but using hardcoded for now to match command
        $this->apiKey = '4e4e22410cc442cd840111b911318766';
    }

    /**
     * Fetch a single game by slug or ID and sync it to the database.
     */
    public function fetchAndSync($slugOrId)
    {
        try {
            $response = Http::get("{$this->baseUrl}/{$slugOrId}", [
                'key' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return $this->syncGame($response->json());
            }
        } catch (\Exception $e) {
            Log::error("Failed to sync game {$slugOrId}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Create or update a game from RAWG data.
     */
    public function syncGame(array $gameData): Game
    {
        return Game::updateOrCreate(
            ['rawg_id' => $gameData['id']],
            [
                'slug' => $gameData['slug'],
                'name' => $gameData['name'],
                'released' => $gameData['released'] ?? null,
                'background_image' => $gameData['background_image'] ?? null,
                'rating' => $gameData['rating'] ?? 0,
                'rating_top' => $gameData['rating_top'] ?? 0,
                'metacritic' => $gameData['metacritic'] ?? null,
                'playtime' => $gameData['playtime'] ?? 0,
                'esrb_rating' => $gameData['esrb_rating']['name'] ?? null,
                'genres' => $gameData['genres'] ?? [],
                'platforms' => $gameData['parent_platforms'] ?? [],
                'stores' => $gameData['stores'] ?? [],
                'tags' => $gameData['tags'] ?? [],
                'description' => $gameData['description'] ?? null, // Rawg details gives description
                'last_synced_at' => now(),
            ]
        );
    }
}
