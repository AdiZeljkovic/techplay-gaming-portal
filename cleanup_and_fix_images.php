<?php
/**
 * Cleanup Script:
 * 1. Delete articles WITHOUT rawg: tags (no game match found)
 * 2. For articles WITH rawg: tags, fetch images from RAWG if missing/broken
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

echo "=== Cleanup Script ===\n\n";

// Step 1: Delete articles without rawg: tags
echo "--- Step 1: Deleting articles without game matches ---\n";

$articlesWithoutTag = Article::with('tags')->get()->filter(function ($article) {
    return !$article->tags->contains(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
});

$deleteCount = $articlesWithoutTag->count();
echo "Found $deleteCount articles without rawg: tags.\n";

foreach ($articlesWithoutTag as $article) {
    echo "  Deleting ID: {$article->id} - {$article->title}\n";
    $article->delete();
}

echo "Deleted $deleteCount articles.\n\n";

// Step 2: Fetch images for articles with rawg: tags but missing/broken images
echo "--- Step 2: Fetching images for tagged articles ---\n";

// Get all articles with rawg: tags
$taggedArticles = Article::with(['tags', 'media'])->get()->filter(function ($article) {
    return $article->tags->contains(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
});

echo "Found " . $taggedArticles->count() . " articles with rawg: tags.\n";

$imagesAdded = 0;
$alreadyHaveImage = 0;
$errors = 0;

foreach ($taggedArticles as $article) {
    // Check if article already has a valid featured_image
    $existingImage = $article->getFirstMediaUrl('featured_image');

    if ($existingImage && !str_contains($existingImage, 'picsum.photos')) {
        $alreadyHaveImage++;
        continue; // Skip - already has image
    }

    // Get the rawg: tag
    $rawgTag = $article->tags->first(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });

    $gameSlug = str_replace('rawg:', '', $rawgTag->name);

    echo "[{$article->id}] Fetching image for '$gameSlug'... ";

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
        // Clear any existing (broken) media
        $article->clearMediaCollection('featured_image');

        // Add new image from RAWG
        $article->addMediaFromUrl($gameData['background_image'])
            ->toMediaCollection('featured_image');
        echo "OK!\n";
        $imagesAdded++;
    } catch (\Exception $e) {
        echo "ERROR: " . substr($e->getMessage(), 0, 50) . "\n";
        $errors++;
    }

    // Rate limit
    usleep(150000); // 0.15s delay
}

echo "\n=== Summary ===\n";
echo "Articles deleted: $deleteCount\n";
echo "Already have images: $alreadyHaveImage\n";
echo "New images added: $imagesAdded\n";
echo "Errors: $errors\n";
