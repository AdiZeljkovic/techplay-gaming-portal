<?php
/**
 * RAWG Article Tag & Image Backfill Script - V2
 * 
 * Strategy:
 * 1. Find articles with broken/missing featured images
 * 2. Search RAWG by full title (no keyword stripping)
 * 3. If match found: Add 'rawg:{game-slug}' tag to article
 * 4. Download background_image from RAWG and attach to article
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

function searchRawgGame(string $query, string $apiKey, string $baseUrl): ?array
{
    // Clean query a bit (remove special chars that break search)
    $cleanQuery = preg_replace('/[^\w\s:\-\'\"]/u', '', $query);
    $cleanQuery = trim($cleanQuery);

    if (strlen($cleanQuery) < 3)
        return null;

    $response = Http::timeout(10)->get("$baseUrl/games", [
        'key' => $apiKey,
        'search' => $cleanQuery,
        'page_size' => 1, // We only need the top result
    ]);

    if (!$response->successful()) {
        echo "  RAWG API error: {$response->status()}\n";
        return null;
    }

    $data = $response->json();
    $result = $data['results'][0] ?? null;

    // Basic relevance check - game name should have some overlap with query
    if ($result && isset($result['name'])) {
        $queryWords = explode(' ', strtolower($cleanQuery));
        $gameWords = explode(' ', strtolower($result['name']));
        $overlap = array_intersect($queryWords, $gameWords);

        // Require at least 1 matching word for relevance
        if (count($overlap) < 1) {
            return null;
        }
    }

    return $result;
}

echo "=== RAWG Article Tag & Image Backfill Script ===\n\n";

// Find articles without a featured_image in media library
$articles = Article::whereDoesntHave('media', function ($q) {
    $q->where('collection_name', 'featured_image');
})->orderBy('id', 'desc')->limit(50)->get();

echo "Found " . $articles->count() . " articles without featured_image.\n\n";

$imagesAdded = 0;
$tagsAdded = 0;
$noMatch = 0;

foreach ($articles as $article) {
    echo "[{$article->id}] {$article->title}\n";

    // Check if article already has a rawg: tag
    $existingRawgTag = $article->tags->first(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });

    $gameSlug = null;
    $gameData = null;

    if ($existingRawgTag) {
        // Already tagged - use existing slug
        $gameSlug = str_replace('rawg:', '', $existingRawgTag->name);
        echo "  -> Already tagged: $gameSlug\n";

        // Fetch game data by slug
        $response = Http::timeout(10)->get("$API_BASE/games/$gameSlug", [
            'key' => $RAWG_API_KEY,
        ]);
        if ($response->successful()) {
            $gameData = $response->json();
        }
    } else {
        // Search RAWG by title
        echo "  -> Searching RAWG... ";
        $gameData = searchRawgGame($article->title, $RAWG_API_KEY, $API_BASE);

        if ($gameData && isset($gameData['slug'])) {
            $gameSlug = $gameData['slug'];
            echo "FOUND: '{$gameData['name']}'\n";

            // Add rawg: tag
            $article->attachTag("rawg:$gameSlug");
            echo "  -> Added tag: rawg:$gameSlug\n";
            $tagsAdded++;
        } else {
            echo "NO MATCH\n";
            $noMatch++;
            continue;
        }
    }

    // Download and attach image if we have game data
    if ($gameData && isset($gameData['background_image']) && $gameData['background_image']) {
        try {
            $article->addMediaFromUrl($gameData['background_image'])
                ->toMediaCollection('featured_image');
            echo "  -> Image attached!\n";
            $imagesAdded++;
        } catch (\Exception $e) {
            echo "  -> Error: " . $e->getMessage() . "\n";
        }
    } else {
        echo "  -> No image available from RAWG\n";
    }

    // Rate limit to avoid RAWG throttling
    usleep(300000); // 0.3s delay
}

echo "\n=== Summary ===\n";
echo "Tags added: $tagsAdded\n";
echo "Images attached: $imagesAdded\n";
echo "No match found: $noMatch\n";
