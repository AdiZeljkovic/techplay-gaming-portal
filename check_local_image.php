<?php
use App\Models\Article;

$article = Article::whereHas('tags', fn($q) => $q->where('name', 'like', 'rawg:%'))->first();

if (!$article) {
    echo "No tagged articles found.\n";
    exit;
}

echo "Article ID: $article->id\n";
echo "Title: $article->title\n";

$media = $article->getFirstMedia('featured_image');

if ($media) {
    echo "\nMedia Found:\n";
    echo "ID: $media->id\n";
    echo "Disk: $media->disk\n";
    echo "File Name: $media->file_name\n";
    echo "Relative Path: " . $media->getPath() . "\n";
    echo "Absolute Path: " . $media->getPath() . "\n";
    echo "URL: " . $media->getUrl() . "\n";

    if (file_exists($media->getPath())) {
        echo "✅ File exists on disk at " . $media->getPath() . "\n";
        echo "Size: " . round(filesize($media->getPath()) / 1024, 2) . " KB\n";
    } else {
        echo "❌ File MISSING on disk at " . $media->getPath() . "\n";
    }
} else {
    echo "❌ No media found in 'featured_image' collection.\n";
}
