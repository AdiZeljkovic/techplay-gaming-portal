<?php
$a = App\Models\Article::find(795);
if ($a) {
    echo "Slug: $a->slug\n";
    echo "Image: " . $a->getFirstMediaUrl('featured_image') . "\n";
} else {
    echo "Article 795 not found.\n";
}
