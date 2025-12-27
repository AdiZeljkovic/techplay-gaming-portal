<?php
/**
 * Fix Broken Images Script
 * 
 * This script:
 * 1. Finds articles with rawg: tags
 * 2. Checks if their featured_image media actually exists/is accessible
 * 3. If broken, clears the media and fetches fresh from RAWG
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

echo "=== Fix Broken Images Script ===\n\n";

// Get all articles with rawg: tags
$articles = Article::with(['tags', 'media'])->get()->filter(function ($article) {
    return $article->tags->contains(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
});

echo "Found " . $articles->count() . " articles with rawg: tags.\n\n";

$fixed = 0;
$alreadyGood = 0;
$errors = 0;
$processed = 0;

foreach ($articles as $article) {
    $processed++;

    if ($processed % 100 == 0) {
        echo "Progress: $processed / " . $articles->count() . " | Fixed: $fixed | Good: $alreadyGood | Errors: $errors\n";
    }

    // Check if featured_image exists and is valid
    $media = $article->getFirstMedia('featured_image');
    $needsFix = false;

    if (!$media) {
        $needsFix = true;
    } else {
        // Check if file actually exists
        $path = $media->getPath();
        if (!file_exists($path)) {
            $needsFix = true;
            echo "[{$article->id}] Media record exists but file missing: $path\n";
            // Clear the broken media record
            $article->clearMediaCollection('featured_image');
        }
    }

    if (!$needsFix) {
        $alreadyGood++;
        continue;
    }

    // Get the rawg: tag
    $rawgTag = $article->tags->first(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });

    $gameSlug = str_replace('rawg:', '', $rawgTag->name);

    // Fetch game data from RAWG
    $response = Http::timeout(10)->get("$API_BASE/games/$gameSlug", [
        'key' => $RAWG_API_KEY,
    ]);

    if (!$response->successful()) {
        $errors++;
        continue;
    }

    $gameData = $response->json();

    if (!isset($gameData['background_image']) || !$gameData['background_image']) {
        $errors++;
        continue;
    }

    try {
        $article->addMediaFromUrl($gameData['background_image'])
            ->toMediaCollection('featured_image');
        echo "[{$article->id}] Fixed: $gameSlug\n";
        $fixed++;
    } catch (\Exception $e) {
        echo "[{$article->id}] Error: " . substr($e->getMessage(), 0, 50) . "\n";
        $errors++;
    }

    // Rate limit
    usleep(150000); // 0.15s delay
}

echo "\n=== Summary ===\n";
echo "Processed: $processed\n";
echo "Already good: $alreadyGood\n";
echo "Fixed: $fixed\n";
echo "Errors: $errors\n";
