<?php

use App\Models\Article;
use Spatie\Tags\Tag;

echo "--- Fixing Tech Articles ---\n";
$techArticles = Article::where('section', 'tech')->get();

foreach ($techArticles as $article) {
    $title = strtolower($article->title);
    $newTag = 'News'; // Default

    if (str_contains($title, 'review') || str_contains($title, 'test') || str_contains($title, 'benchmark')) {
        $newTag = 'Review';
    } elseif (str_contains($title, 'guide') || str_contains($title, 'how to') || str_contains($title, 'build') || str_contains($title, 'setup')) {
        $newTag = 'Guide';
    }

    // Detach existing 'structure' tags to avoid duplicates if re-running
    $article->detachTags(['News', 'Review', 'Guide']);

    // Attach new tag
    // We want this tag to be 'primary' (first). Spatie tags are sorted by order column usually? 
    // Or just insertion order. We can sync.
    // Let's just attach it. The frontend takes tags[0].

    // Get existing tags
    $currentTags = $article->tags->pluck('name')->toArray();

    // Add new tag to front
    array_unshift($currentTags, $newTag);
    $currentTags = array_unique($currentTags);

    $article->syncTags($currentTags);
    echo "Updated '{$article->title}' -> {$newTag}\n";
}

echo "\n--- Fixing Review Articles ---\n";
$reviewArticles = Article::where('section', 'reviews')->get();

foreach ($reviewArticles as $index => $article) {
    if ($index % 4 === 0) {
        $article->attachTag('AAA');
        echo "Tagged '{$article->title}' as AAA\n";
    } elseif ($index % 4 === 1) {
        $article->attachTag('Indie');
        echo "Tagged '{$article->title}' as Indie\n";
    } elseif ($index % 4 === 2) {
        $article->attachTag('Retro');
        echo "Tagged '{$article->title}' as Retro\n";
    }
}

echo "\nDone!\n";
