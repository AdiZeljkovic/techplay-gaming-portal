<?php
$id = 1543;
$article = App\Models\Article::find($id);

if (!$article) {
    echo "Article $id not found.\n";
    exit(1);
}

$media = $article->getFirstMedia('featured_image');

if (!$media) {
    echo "No media found for article $id.\n";
    exit(1);
}

echo "--- Media Info ---\n";
echo "ID: " . $media->id . "\n";
echo "Disk: " . $media->disk . "\n";
echo "File Name: " . $media->file_name . "\n";
echo "Path (Relative): " . $media->getPath() . "\n";
echo "URL (Relative): " . $media->getUrl() . "\n";

$fullPath = storage_path('app/public/' . $media->id . '/' . $media->file_name);
echo "Full Disk Path: " . $fullPath . "\n";

if (file_exists($fullPath)) {
    echo "✅ FILE EXISTS on disk.\n";
} else {
    echo "❌ FILE MISSING on disk.\n";
}

$publicLinkPath = public_path('storage/' . $media->id . '/' . $media->file_name);
echo "Public Link Path: " . $publicLinkPath . "\n";

if (file_exists($publicLinkPath)) {
    echo "✅ PUBLIC LINK VALID (File visible via public/storage).\n";
} else {
    echo "❌ PUBLIC LINK BROKEN (File NOT visible via public/storage).\n";
}

$httpUrl = 'http://localhost:8000/storage/' . $media->id . '/' . $media->file_name;
echo "Testing HTTP: $httpUrl\n";

$headers = @get_headers($httpUrl);
if ($headers && strpos($headers[0], '200')) {
    echo "✅ HTTP 200 OK\n";
} else {
    echo "❌ HTTP FAILED: " . ($headers[0] ?? 'Unknown Error') . "\n";
}
