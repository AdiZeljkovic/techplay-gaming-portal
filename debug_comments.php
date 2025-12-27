<?php

use App\Models\Article;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Finding Article 4...\n";
    $article = Article::find(4);
    if (!$article) {
        die("Article 4 not found.\n");
    }
    echo "Instantiating Comment model...\n";
    $c = new Comment();
    echo "Comment model instantiated.\n";

    echo "Fetching all comments count via Eloquent...\n";
    $count = Comment::count();
    echo "Count: $count\n";

    echo "Querying comments via Relation...\n";
    // $comments = $article->comments()->approved()->root()->get();
    // Use simple where first
    $comments = Comment::where('commentable_type', 'App\Models\Article')
        ->where('commentable_id', 4)
        ->get();

    echo "Found " . $comments->count() . " comments.\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
