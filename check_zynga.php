<?php
$a = App\Models\Article::where('title', 'like', '%Zynga%')->first();
if ($a) {
    echo "ID: $a->id\n";
    echo "Slug: $a->slug\n";
    echo "Title: $a->title\n";
} else {
    echo "Not Found\n";
}
