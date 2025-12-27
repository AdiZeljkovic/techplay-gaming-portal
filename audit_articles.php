<?php
echo "--- Article Counts by Section ---\n";
$counts = App\Models\Article::groupBy('section')->selectRaw('section, count(*) as count')->get();
foreach ($counts as $c) {
    echo "{$c->section}: {$c->count}\n";
}

echo "\n--- Tech Articles (Sample) ---\n";
$tech = App\Models\Article::where('section', 'tech')->with('tags')->limit(10)->latest()->get();
foreach ($tech as $a) {
    echo "Title: {$a->title}\n";
    echo "Tags: " . $a->tags->pluck('name')->implode(', ') . "\n";
    echo "Category: " . ($a->category->name ?? 'None') . "\n";
    echo "---\n";
}

echo "\n--- Review Articles (Sample) ---\n";
$reviews = App\Models\Article::where('section', 'reviews')->with('tags')->limit(10)->latest()->get();
foreach ($reviews as $a) {
    echo "Title: {$a->title}\n";
    echo "Tags: " . $a->tags->pluck('name')->implode(', ') . "\n";
    echo "Category: " . ($a->category->name ?? 'None') . "\n";
    echo "---\n";
}
