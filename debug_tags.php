<?php
use App\Models\Article;

$id = 1543;
$article = Article::find($id);

if (!$article) {
    echo "Article $id not found.\n";
    // Try to find ANY article with tags
    $article = Article::whereHas('tags')->first();
    if ($article) {
        echo "Found another article with tags: $article->id\n";
    } else {
        echo "No articles with tags found looking at DB.\n";
        exit;
    }
} else {
    echo "Found Article $id: {$article->title}\n";
}

echo "Tags:\n";
foreach ($article->tags as $tag) {
    echo " - ID: $tag->id | Name: $tag->name | Type: $tag->type\n";
}

$media = $article->getFirstMedia('featured_image');
if ($media) {
    echo "\nMedia Check:\n";
    echo "ID: $media->id\n";
    echo "Path: " . $media->getPath() . "\n";
    echo "Exists on disk: " . (file_exists($media->getPath()) ? "YES" : "NO") . "\n";
} else {
    echo "\nNo featured_image found.\n";
}
