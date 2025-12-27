<?php
$a = App\Models\Article::first();
if ($a) {
    echo "Article ID: $a->id\n";
    echo "Title: $a->title\n";

    $imageUrl = $a->getFirstMediaUrl('featured_image');
    echo "Image URL: $imageUrl\n";

    $media = $a->getFirstMedia('featured_image');
    if ($media) {
        echo "Media ID: $media->id\n";
        echo "File Name: $media->file_name\n";
        echo "Disk: $media->disk\n";
        echo "Path: $media->getPath()\n";
        echo "File Exists: " . (file_exists($media->getPath()) ? 'YES' : 'NO') . "\n";
    } else {
        echo "No media found for this article.\n";
    }
} else {
    echo "No articles found.\n";
}
