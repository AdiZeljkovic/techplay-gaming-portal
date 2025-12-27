<?php
$a = App\Models\Article::where('title', 'like', 'Valve%')->first();
if ($a) {
    echo "Article ID: $a->id\n";
    $media = $a->getMedia('*');
    echo "Media Count: " . $media->count() . "\n";
    foreach ($media as $m) {
        echo "Collection: {$m->collection_name}\n";
        echo "URL: {$m->getUrl()}\n";
    }
} else {
    echo "Article not found.\n";
}
