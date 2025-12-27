<?php

use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Str;

echo "--- 1. Ensuring Categories Exist ---\n";
$cats = [
    'gaming' => 'Gaming News',
    'console' => 'Console News',
    'pc' => 'PC Gaming',
    'movies-tv' => 'Movies & TV',
    'industry' => 'Industry',
    'e-sport' => 'Esports',
    'opinions' => 'Opinions',
    'tech' => 'Tech Hub'
];

$catIds = [];
foreach ($cats as $slug => $name) {
    $c = Category::updateOrCreate(
        ['slug' => $slug],
        ['name' => $name]
    );
    $catIds[$slug] = $c->id;
    echo "Category '$slug' ready (ID: {$c->id})\n";
}

echo "\n--- 2. Distributing News Articles into Categories ---\n";
$newsArticles = Article::where('section', 'news')->get();
$count = 0;

foreach ($newsArticles as $article) {
    $t = strtolower($article->title);
    $targetSlug = 'gaming'; // Default

    // Logic to migrate to Tech Section if it's hardware
    if (str_contains($t, 'nvidia') || str_contains($t, 'amd') || str_contains($t, 'intel') || str_contains($t, 'rtx') || str_contains($t, 'cpu') || str_contains($t, 'gpu') || str_contains($t, 'hardware') || str_contains($t, 'monitor') || str_contains($t, 'mouse') || str_contains($t, 'keyboard') || str_contains($t, 'phone') || str_contains($t, 'samsung') || str_contains($t, 'apple')) {

        $article->section = 'tech';
        $article->attachTag('News'); // It's tech news
        // Also sync 'guides' or 'reviews' if applicable
        if (str_contains($t, 'review'))
            $article->attachTag('Review');
        if (str_contains($t, 'guide'))
            $article->attachTag('Guide');

        $article->category_id = $catIds['tech']; // Just in case
        $article->save();
        echo "Moved to Tech: {$article->title}\n";
        continue; // Skip News categorization
    }

    // Logic for News Categories
    if (str_contains($t, 'ps5') || str_contains($t, 'xbox') || str_contains($t, 'nintendo') || str_contains($t, 'switch') || str_contains($t, 'console')) {
        $targetSlug = 'console';
    } elseif (str_contains($t, 'steam') || str_contains($t, 'pc') || str_contains($t, 'windows') || str_contains($t, 'driver') || str_contains($t, 'mod')) {
        $targetSlug = 'pc';
    } elseif (str_contains($t, 'movie') || str_contains($t, 'series') || str_contains($t, 'netflix') || str_contains($t, 'anime') || str_contains($t, 'hbo')) {
        $targetSlug = 'movies-tv';
    } elseif (str_contains($t, 'acquisition') || str_contains($t, 'sales') || str_contains($t, 'market') || str_contains($t, 'ceo') || str_contains($t, 'layoff')) {
        $targetSlug = 'industry';
    } elseif (str_contains($t, 'esport') || str_contains($t, 'tournament') || str_contains($t, 'team') || str_contains($t, 'championship') || str_contains($t, 'major')) {
        $targetSlug = 'e-sport';
    } elseif (str_contains($t, 'opinion') || str_contains($t, 'editorial') || str_contains($t, 'why') || str_contains($t, 'column')) {
        $targetSlug = 'opinions';
    }

    if ($article->category_id !== $catIds[$targetSlug]) {
        $article->category_id = $catIds[$targetSlug];
        $article->save();
        $count++;
        // echo "Sorted '{$article->title}' into '$targetSlug'\n";
    }
}
echo "Sorted $count News articles.\n";

echo "\nDone!\n";
