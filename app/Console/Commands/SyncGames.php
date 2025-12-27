<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncGames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'games:sync {--pages=5 : Number of pages to fetch} {--dates= : Date range (YYYY-MM-DD,YYYY-MM-DD)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync games from RAWG API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apiKey = '4e4e22410cc442cd840111b911318766';
        $pages = $this->option('pages');
        $dates = $this->option('dates');
        $baseUrl = 'https://api.rawg.io/api/games';

        $this->info("Starting sync for {$pages} pages...");
        if ($dates) {
            $this->info("Filtering by dates: {$dates}");
        }

        for ($i = 1; $i <= $pages; $i++) {
            $this->info("Fetching page {$i}...");

            try {
                $params = [
                    'key' => $apiKey,
                    'page' => $i,
                    'page_size' => 20,
                ];

                if ($dates) {
                    $params['dates'] = $dates;
                    $params['ordering'] = '-released';
                }

                $response = \Illuminate\Support\Facades\Http::get($baseUrl, $params);

                if ($response->successful()) {
                    $games = $response->json()['results'];

                    foreach ($games as $gameData) {
                        \App\Models\Game::updateOrCreate(
                            ['rawg_id' => $gameData['id']],
                            [
                                'slug' => $gameData['slug'],
                                'name' => $gameData['name'],
                                'released' => $gameData['released'],
                                'background_image' => $gameData['background_image'],
                                'rating' => $gameData['rating'],
                                'rating_top' => $gameData['rating_top'],
                                'metacritic' => $gameData['metacritic'] ?? null,
                                'playtime' => $gameData['playtime'] ?? 0,
                                'esrb_rating' => $gameData['esrb_rating']['name'] ?? null,
                                'genres' => $gameData['genres'] ?? [],
                                'platforms' => $gameData['parent_platforms'] ?? [], // Using parent platforms for cleaner UI
                                'stores' => $gameData['stores'] ?? [],
                                'tags' => $gameData['tags'] ?? [],
                                'last_synced_at' => now(),
                            ]
                        );
                    }
                    $this->info("Page {$i} processed (" . count($games) . " games).");
                } else {
                    $this->error("Failed to fetch page {$i}: " . $response->status());
                }
            } catch (\Exception $e) {
                $this->error("Error on page {$i}: " . $e->getMessage());
            }
        }

        $this->info("Sync completed.");
    }
}
