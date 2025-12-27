<?php

use Illuminate\Support\Facades\File;
use App\Models\Article;
use Illuminate\Support\Str;

$dir = storage_path('app/public/articles');
if (!File::exists($dir)) {
    echo "Directory not found: $dir\n";
    exit;
}

$files = File::files($dir);
echo "Found " . count($files) . " files in articles backup.\n";

$restored = 0;
$skipped = 0;

foreach ($files as $file) {
    $filename = $file->getFilename();

    // Parse slug: assume format {slug}-{hash}.{ext}
    // Hash seems to be 13 chars hex (uniqid)
    if (preg_match('/^(.*)-([a-f0-9]{13})\.(jpg|jpeg|png|webp|avif)$/i', $filename, $matches)) {
        $slug = $matches[1];
    } else {
        // Fallback: try removing extension and last segment?
        $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
        $parts = explode('-', $nameWithoutExt);
        // Maybe last part is hash?
        array_pop($parts);
        $slug = implode('-', $parts);
    }

    $article = Article::where('slug', $slug)->first();

    // Fuzzy match: Take first 3 words of filename slug
    if (!$article) {
        $parts = explode('-', $slug);
        // Filter matching parts
        $searchSlug = implode('-', array_slice($parts, 0, 3));
        if (strlen($searchSlug) > 5) {
            $article = Article::where('slug', 'like', $searchSlug . '%')->first();
        }
    }

    if ($article) {
        // Check if already has GOOD media
        // We'll just clear and re-add to be safe and fix the "ghost" links
        try {
            // Only clear 'featured_image' collection
            $article->clearMediaCollection('featured_image');

            $article->addMedia($file->getPathname())
                ->preservingOriginal()
                ->toMediaCollection('featured_image');

            echo "Restored match: $slug (ID: {$article->id})\n";
            $restored++;
        } catch (\Exception $e) {
            echo "Error restoring {$article->id}: " . $e->getMessage() . "\n";
        }
    } else {
        echo "No article found for slug: $slug\n";
        $skipped++;
    }
}

echo "\n--- Summary ---\n";
echo "Restored: $restored\n";
echo "Skipped: $skipped\n";
