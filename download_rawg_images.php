<?php
/**
 * RAWG Image Download Script
 * 
 * This script:
 * 1. Gets all articles with rawg: tags
 * 2. Downloads background_image from RAWG API
 * 3. Saves to storage/app/public/featured/{article_id}.jpg
 * 4. Updates media library to point to the local file
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

echo "=== RAWG Image Download Script ===\n\n";

// Ensure featured folder exists
$featuredPath = storage_path('app/public/featured');
if (!file_exists($featuredPath)) {
    mkdir($featuredPath, 0755, true);
    echo "Created folder: $featuredPath\n";
}

// Get all articles with rawg: tags
$articles = Article::with('tags')->get()->filter(function ($article) {
    return $article->tags->contains(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
});

echo "Found " . $articles->count() . " articles with rawg: tags.\n\n";

$downloaded = 0;
$skipped = 0;
$errors = 0;
$processed = 0;

foreach ($articles as $article) {
    $processed++;

    if ($processed % 50 == 0) {
        echo "Progress: $processed / " . $articles->count() . " | Downloaded: $downloaded | Skipped: $skipped | Errors: $errors\n";
    }

    $localPath = "featured/{$article->id}.jpg";
    $fullPath = storage_path("app/public/{$localPath}");

    // Skip if already downloaded
    if (file_exists($fullPath)) {
        $skipped++;
        continue;
    }

    // Get rawg tag
    $rawgTag = $article->tags->first(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
    $gameSlug = str_replace('rawg:', '', $rawgTag->name);

    // Fetch game data from RAWG
    try {
        $response = Http::timeout(10)->get("$API_BASE/games/$gameSlug", [
            'key' => $RAWG_API_KEY,
        ]);

        if (!$response->successful()) {
            $errors++;
            continue;
        }

        $gameData = $response->json();
        $imageUrl = $gameData['background_image'] ?? null;

        if (!$imageUrl) {
            $errors++;
            continue;
        }

        // Download image using cURL
        $ch = curl_init($imageUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $imageData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$imageData) {
            echo "[{$article->id}] Failed to download image\n";
            $errors++;
            continue;
        }

        // Save to disk
        file_put_contents($fullPath, $imageData);

        // Clear old broken media and add new one
        $article->clearMediaCollection('featured_image');
        $article->addMedia($fullPath)
            ->preservingOriginal()
            ->toMediaCollection('featured_image');

        $downloaded++;

    } catch (\Exception $e) {
        echo "[{$article->id}] Error: " . substr($e->getMessage(), 0, 50) . "\n";
        $errors++;
    }

    // Rate limit
    usleep(200000); // 0.2s delay
}

echo "\n=== Summary ===\n";
echo "Processed: $processed\n";
echo "Downloaded: $downloaded\n";
echo "Already existed (skipped): $skipped\n";
echo "Errors: $errors\n";
