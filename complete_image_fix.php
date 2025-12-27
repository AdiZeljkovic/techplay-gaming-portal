<?php
/**
 * Complete Image Fix Script v2 - With Retry and Error Handling
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

echo "=== Complete Image Fix Script v2 ===\n\n";

// Get all articles with rawg: tags that DON'T have valid featured_image
$articles = Article::with(['tags', 'media'])->get()->filter(function ($article) {
    // Must have rawg: tag
    $hasRawgTag = $article->tags->contains(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
    if (!$hasRawgTag)
        return false;

    // Check if already has valid image (from previous run)
    $media = $article->getFirstMedia('featured_image');
    if ($media) {
        $path = $media->getPath();
        if (file_exists($path))
            return false; // Already good
    }

    return true; // Needs fixing
});

echo "Found " . $articles->count() . " articles needing images.\n\n";

$fixed = 0;
$errors = 0;
$processed = 0;

foreach ($articles as $article) {
    $processed++;

    if ($processed % 50 == 0) {
        echo "Progress: $processed / " . $articles->count() . " | Fixed: $fixed | Errors: $errors\n";
    }

    // Get the rawg: tag
    $rawgTag = $article->tags->first(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });

    $gameSlug = str_replace('rawg:', '', $rawgTag->name);

    // Clear any existing broken media
    $article->clearMediaCollection('featured_image');

    // Fetch game data from RAWG with error handling
    try {
        $response = Http::timeout(15)->retry(2, 1000)->get("$API_BASE/games/$gameSlug", [
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

        $article->addMediaFromUrl($gameData['background_image'])
            ->toMediaCollection('featured_image');
        $fixed++;

    } catch (\Exception $e) {
        echo "[{$article->id}] Error: " . substr($e->getMessage(), 0, 50) . "\n";
        $errors++;
    }

    // Rate limit
    usleep(200000); // 0.2s delay
}

echo "\n=== Summary ===\n";
echo "Processed: $processed\n";
echo "Fixed: $fixed\n";
echo "Errors: $errors\n";
