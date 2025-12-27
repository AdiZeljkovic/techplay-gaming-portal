<?php
/**
 * RAWG Image Fetch Script - Phase 2
 * 
 * For articles that:
 * 1. Have a rawg:{game-slug} tag
 * 2. Are missing a featured_image
 * 
 * Fetch the background_image from RAWG and attach it.
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

echo "=== RAWG Image Fetch Script - Phase 2 ===\n\n";

// Find articles WITH rawg: tag but WITHOUT featured_image
$articles = Article::with(['tags', 'media'])
    ->whereDoesntHave('media', function ($q) {
        $q->where('collection_name', 'featured_image');
    })
    ->get()
    ->filter(function ($article) {
        return $article->tags->contains(function ($tag) {
            return str_starts_with($tag->name, 'rawg:');
        });
    });

echo "Found " . $articles->count() . " articles with rawg: tag but no featured_image.\n\n";

$imagesAdded = 0;
$errors = 0;
$processed = 0;

foreach ($articles as $article) {
    $processed++;

    // Get the rawg: tag
    $rawgTag = $article->tags->first(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });

    if (!$rawgTag)
        continue;

    $gameSlug = str_replace('rawg:', '', $rawgTag->name);

    echo "[$processed] {$article->id}: Fetching image for '$gameSlug'... ";

    // Fetch game data from RAWG
    $response = Http::timeout(10)->get("$API_BASE/games/$gameSlug", [
        'key' => $RAWG_API_KEY,
    ]);

    if (!$response->successful()) {
        echo "API ERROR ({$response->status()})\n";
        $errors++;
        continue;
    }

    $gameData = $response->json();

    if (!isset($gameData['background_image']) || !$gameData['background_image']) {
        echo "NO IMAGE\n";
        $errors++;
        continue;
    }

    try {
        $article->addMediaFromUrl($gameData['background_image'])
            ->toMediaCollection('featured_image');
        echo "OK!\n";
        $imagesAdded++;
    } catch (\Exception $e) {
        echo "ATTACH ERROR: " . $e->getMessage() . "\n";
        $errors++;
    }

    // Rate limit
    usleep(200000); // 0.2s delay
}

echo "\n=== Phase 2 Complete ===\n";
echo "Processed: $processed\n";
echo "Images attached: $imagesAdded\n";
echo "Errors: $errors\n";
