<?php
/**
 * RAWG Article Tagging Script - Phase 1
 * 
 * Goes through ALL articles and adds rawg:{game-slug} tags
 * where a matching game is found on RAWG.io
 * 
 * This is Phase 1 - tagging only, no image downloading.
 */

use App\Models\Article;
use Illuminate\Support\Facades\Http;

$RAWG_API_KEY = '4e4e22410cc442cd840111b911318766';
$API_BASE = 'https://api.rawg.io/api';

function searchRawgGame(string $query, string $apiKey, string $baseUrl): ?array
{
    // Clean query (remove special chars that break search)
    $cleanQuery = preg_replace('/[^\w\s:\-\'\"]/u', '', $query);
    $cleanQuery = trim($cleanQuery);

    if (strlen($cleanQuery) < 3)
        return null;

    $response = Http::timeout(10)->get("$baseUrl/games", [
        'key' => $apiKey,
        'search' => $cleanQuery,
        'page_size' => 1,
    ]);

    if (!$response->successful()) {
        return null;
    }

    $data = $response->json();
    $result = $data['results'][0] ?? null;

    // Basic relevance check - game name should have some overlap with query
    if ($result && isset($result['name'])) {
        $queryWords = array_map('strtolower', preg_split('/\s+/', $cleanQuery));
        $gameWords = array_map('strtolower', preg_split('/\s+/', $result['name']));
        $overlap = array_intersect($queryWords, $gameWords);

        // Require at least 1 matching word for relevance
        if (count($overlap) < 1) {
            return null;
        }
    }

    return $result;
}

echo "=== RAWG Article Tagging Script - Phase 1 ===\n\n";

// Get ALL articles that don't already have a rawg: tag
$articles = Article::with('tags')->orderBy('id', 'asc')->get();
$total = $articles->count();

echo "Total articles: $total\n\n";

// Filter to only those without rawg: tag
$articlesToProcess = $articles->filter(function ($article) {
    return !$article->tags->contains(function ($tag) {
        return str_starts_with($tag->name, 'rawg:');
    });
});

echo "Articles without rawg: tag: " . $articlesToProcess->count() . "\n\n";

$matched = 0;
$noMatch = 0;
$processed = 0;

foreach ($articlesToProcess as $article) {
    $processed++;

    if ($processed % 50 === 0) {
        echo "Progress: $processed / " . $articlesToProcess->count() . " | Matched: $matched | No match: $noMatch\n";
    }

    // Search RAWG by title
    $gameData = searchRawgGame($article->title, $RAWG_API_KEY, $API_BASE);

    if ($gameData && isset($gameData['slug'])) {
        $gameSlug = $gameData['slug'];
        $article->attachTag("rawg:$gameSlug");
        $matched++;
        echo "  [MATCH] {$article->id}: '{$article->title}' -> rawg:{$gameSlug}\n";
    } else {
        $noMatch++;
    }

    // Rate limit to avoid RAWG throttling (free tier allows 20 requests/second)
    usleep(100000); // 0.1s delay = 10 requests/second max
}

echo "\n=== Phase 1 Complete ===\n";
echo "Processed: $processed\n";
echo "Games matched & tagged: $matched\n";
echo "No match found: $noMatch\n";
