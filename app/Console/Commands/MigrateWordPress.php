<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MigrateWordPress extends Command
{
    protected $signature = 'techplay:migrate 
                            {--path= : Path to WordPress XML export file}
                            {--dry-run : Run without saving to database}
                            {--skip-images : Skip image downloading and processing}
                            {--skip-translation : Skip AI translation}
                            {--start=0 : Start from article index}
                            {--limit=0 : Limit number of articles (0 = no limit)}';

    protected $description = 'Migrate articles from WordPress XML export with AI translation and image optimization';

    // ═══════════════════════════════════════════════════════════════════════════
    // CATEGORY MAPPING TABLE - Edit this to customize mappings
    // ═══════════════════════════════════════════════════════════════════════════
    protected array $categoryMapping = [
        // Reviews Section
        'recenzije' => ['section' => 'reviews', 'category' => 'latest'],
        'reviews' => ['section' => 'reviews', 'category' => 'latest'],
        'review' => ['section' => 'reviews', 'category' => 'latest'],
        'ps5' => ['section' => 'reviews', 'category' => 'aaa'],
        'ps4' => ['section' => 'reviews', 'category' => 'aaa'],
        'playstation' => ['section' => 'reviews', 'category' => 'aaa'],
        'xbox' => ['section' => 'reviews', 'category' => 'aaa'],
        'nintendo' => ['section' => 'reviews', 'category' => 'aaa'],
        'switch' => ['section' => 'reviews', 'category' => 'aaa'],
        'pc gaming' => ['section' => 'reviews', 'category' => 'aaa'],
        'aaa' => ['section' => 'reviews', 'category' => 'aaa'],
        'indie' => ['section' => 'reviews', 'category' => 'indie'],
        'indie igre' => ['section' => 'reviews', 'category' => 'indie'],
        'retro' => ['section' => 'reviews', 'category' => 'retro'],
        'klasici' => ['section' => 'reviews', 'category' => 'retro'],

        // Tech Section
        'hardware' => ['section' => 'tech', 'category' => 'reviews'],
        'tech' => ['section' => 'tech', 'category' => 'news'],
        'tehnologija' => ['section' => 'tech', 'category' => 'news'],
        'benchmark' => ['section' => 'tech', 'category' => 'reviews'],
        'benchmarks' => ['section' => 'tech', 'category' => 'reviews'],
        'vodič' => ['section' => 'tech', 'category' => 'guides'],
        'vodic' => ['section' => 'tech', 'category' => 'guides'],
        'guide' => ['section' => 'tech', 'category' => 'guides'],
        'guides' => ['section' => 'tech', 'category' => 'guides'],
        'tutorial' => ['section' => 'tech', 'category' => 'guides'],
        'gpu' => ['section' => 'tech', 'category' => 'reviews'],
        'cpu' => ['section' => 'tech', 'category' => 'reviews'],
        'grafička' => ['section' => 'tech', 'category' => 'reviews'],
        'graficka' => ['section' => 'tech', 'category' => 'reviews'],

        // News Section (default fallbacks)
        'vijesti' => ['section' => 'news', 'category' => 'gaming'],
        'news' => ['section' => 'news', 'category' => 'gaming'],
        'gaming' => ['section' => 'news', 'category' => 'gaming'],
        'igre' => ['section' => 'news', 'category' => 'gaming'],
        'esports' => ['section' => 'news', 'category' => 'esports'],
        'e-sport' => ['section' => 'news', 'category' => 'esports'],
        'esport' => ['section' => 'news', 'category' => 'esports'],
        'film' => ['section' => 'news', 'category' => 'movies'],
        'filmovi' => ['section' => 'news', 'category' => 'movies'],
        'tv' => ['section' => 'news', 'category' => 'movies'],
        'serije' => ['section' => 'news', 'category' => 'movies'],
        'industrija' => ['section' => 'news', 'category' => 'industry'],
        'industry' => ['section' => 'news', 'category' => 'industry'],
        'console' => ['section' => 'news', 'category' => 'consoles'],
        'konzole' => ['section' => 'news', 'category' => 'consoles'],
        'pc' => ['section' => 'news', 'category' => 'pc'],
        'mišljenje' => ['section' => 'news', 'category' => 'opinions'],
        'opinion' => ['section' => 'news', 'category' => 'opinions'],
    ];

    protected int $successCount = 0;
    protected int $failedCount = 0;
    protected int $skippedCount = 0;
    protected array $failedArticles = [];

    public function handle(): int
    {
        $this->newLine();
        $this->components->info('╔══════════════════════════════════════════════════════════════╗');
        $this->components->info('║         TECHPLAY WORDPRESS MIGRATION TOOL v1.0               ║');
        $this->components->info('╚══════════════════════════════════════════════════════════════╝');
        $this->newLine();

        // Get XML path
        $xmlPath = $this->option('path') ?? 'C:\\Users\\adize\\Downloads\\techplaygg.WordPress.2025-12-23.xml';

        if (!file_exists($xmlPath)) {
            $this->components->error("XML file not found: {$xmlPath}");
            return Command::FAILURE;
        }

        $this->components->info("📂 Loading XML: {$xmlPath}");

        // Parse XML
        $articles = $this->parseWordPressXml($xmlPath);
        $totalArticles = count($articles);

        $this->components->info("📊 Found {$totalArticles} articles to process");
        $this->newLine();

        // Apply start/limit options
        $start = (int) $this->option('start');
        $limit = (int) $this->option('limit');

        if ($start > 0) {
            $articles = array_slice($articles, $start);
            $this->components->warn("⏭️  Starting from article #{$start}");
        }

        if ($limit > 0) {
            $articles = array_slice($articles, 0, $limit);
            $this->components->warn("🔢 Limited to {$limit} articles");
        }

        $processCount = count($articles);

        if ($this->option('dry-run')) {
            $this->components->warn('🧪 DRY RUN MODE - No changes will be saved');
        }

        $this->newLine();
        $this->components->info('Starting migration...');
        $this->newLine();

        // Process each article
        $progressBar = $this->output->createProgressBar($processCount);
        $progressBar->setFormat(" %current%/%max% [%bar%] %percent:3s%% | %message%");
        $progressBar->start();

        foreach ($articles as $index => $article) {
            $progressBar->setMessage("Processing: " . Str::limit($article['title'], 40));

            try {
                $this->processArticle($article, $index + $start);
            } catch (\Exception $e) {
                $this->failedCount++;
                $this->failedArticles[] = [
                    'title' => $article['title'],
                    'error' => $e->getMessage()
                ];
                $this->logError($article['title'], $e->getMessage());
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // Summary
        $this->printSummary();

        return Command::SUCCESS;
    }

    /**
     * Parse WordPress XML export
     */
    protected function parseWordPressXml(string $path): array
    {
        $xml = simplexml_load_file($path);
        $namespaces = $xml->getNamespaces(true);

        $articles = [];

        foreach ($xml->channel->item as $item) {
            // Get namespaced elements
            $wp = $item->children($namespaces['wp'] ?? 'http://wordpress.org/export/1.2/');
            $dc = $item->children($namespaces['dc'] ?? 'http://purl.org/dc/elements/1.1/');
            $content = $item->children($namespaces['content'] ?? 'http://purl.org/rss/1.0/modules/content/');
            $excerpt = $item->children($namespaces['excerpt'] ?? 'http://wordpress.org/export/1.2/excerpt/');

            // Only process posts (not pages, attachments, etc.)
            if ((string) $wp->post_type !== 'post') {
                continue;
            }

            // Skip drafts unless they have content
            if ((string) $wp->status !== 'publish') {
                continue;
            }

            // Extract categories and tags
            $categories = [];
            $tags = [];
            foreach ($item->category as $cat) {
                $domain = (string) $cat['domain'];
                $name = (string) $cat;

                if ($domain === 'category') {
                    $categories[] = $name;
                } elseif ($domain === 'post_tag') {
                    $tags[] = $name;
                }
            }

            // Extract featured image from meta
            $featuredImage = null;
            foreach ($wp->postmeta as $meta) {
                if ((string) $meta->meta_key === '_thumbnail_id') {
                    // We'll need to find the attachment URL later
                    $attachmentId = (string) $meta->meta_value;
                    $featuredImage = $this->findAttachmentUrl($xml, $attachmentId, $namespaces);
                    break;
                }
            }

            // Try to get image from content if not found
            if (!$featuredImage) {
                $featuredImage = $this->extractFirstImage((string) $content->encoded);
            }

            $articles[] = [
                'title' => (string) $item->title,
                'content' => (string) $content->encoded,
                'excerpt' => (string) $excerpt->encoded ?: Str::limit(strip_tags((string) $content->encoded), 300),
                'slug' => (string) $wp->post_name,
                'date' => (string) $wp->post_date,
                'author' => (string) $dc->creator,
                'categories' => $categories,
                'tags' => $tags,
                'featured_image' => $featuredImage,
                'wp_id' => (string) $wp->post_id,
                'wp_url' => (string) $item->link,
            ];
        }

        return $articles;
    }

    /**
     * Find attachment URL by ID
     */
    protected function findAttachmentUrl(\SimpleXMLElement $xml, string $attachmentId, array $namespaces): ?string
    {
        foreach ($xml->channel->item as $item) {
            $wp = $item->children($namespaces['wp'] ?? 'http://wordpress.org/export/1.2/');

            if ((string) $wp->post_id === $attachmentId && (string) $wp->post_type === 'attachment') {
                return (string) $wp->attachment_url;
            }
        }

        return null;
    }

    /**
     * Extract first image from HTML content
     */
    protected function extractFirstImage(string $content): ?string
    {
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', $content, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Process a single article
     */
    protected function processArticle(array $article, int $index): void
    {
        $this->line('');
        $this->components->twoColumnDetail(
            "<fg=cyan>#{$index}</> <fg=white>{$article['author']}</>",
            Str::limit($article['title'], 60)
        );

        // Check if article already exists
        if (Article::where('slug', $article['slug'])->exists()) {
            $this->skippedCount++;
            $this->components->warn("   ⏭️  Skipped (already exists): {$article['slug']}");
            return;
        }

        // Translate content
        $translatedTitle = $article['title'];
        $translatedContent = $article['content'];
        $translatedExcerpt = $article['excerpt'];

        if (!$this->option('skip-translation')) {
            $this->line("   🌐 Translating...");

            $translatedTitle = $this->translateWithOllama($article['title']);
            $translatedContent = $this->translateWithOllama($article['content']);
            $translatedExcerpt = $this->translateWithOllama($article['excerpt']);

            $this->components->info("   ✅ Translation complete");
        }

        // Determine section and category
        $mapping = $this->determineCategory($article['categories'], $article['tags']);
        $this->components->twoColumnDetail(
            "   📁 Category",
            "<fg=yellow>{$mapping['section']}</> → <fg=green>{$mapping['category']}</>"
        );

        // Process image
        $imagePath = null;
        if (!$this->option('skip-images') && $article['featured_image']) {
            $this->line("   🖼️  Processing image...");
            $imagePath = $this->processImage($article['featured_image'], $article['slug']);

            if ($imagePath) {
                $this->components->info("   ✅ Image saved: {$imagePath}");
            }
        }

        // Skip DB write in dry-run mode
        if ($this->option('dry-run')) {
            $this->successCount++;
            $this->components->info("   🧪 [DRY RUN] Would save article");
            return;
        }

        // Save to database with transaction
        DB::transaction(function () use ($article, $translatedTitle, $translatedContent, $translatedExcerpt, $mapping, $imagePath) {
            // Find or create author
            $author = $this->findOrCreateAuthor($article['author']);

            // Find category
            $category = Category::where('slug', $mapping['category'])
                ->where('section', $mapping['section'])
                ->first();

            // Create article
            $newArticle = Article::create([
                'title' => $translatedTitle,
                'slug' => $this->ensureUniqueSlug($article['slug']),
                'excerpt' => Str::limit(strip_tags($translatedExcerpt), 500),
                'body' => $translatedContent,
                'section' => $mapping['section'],
                'category_id' => $category?->id,
                'user_id' => $author->id,
                'status' => 'published',
                'published_at' => $article['date'] ?: now(),
                'meta_title' => Str::limit($translatedTitle, 60),
                'meta_description' => Str::limit(strip_tags($translatedExcerpt), 160),
                'wp_old_url' => $article['wp_url'], // For 301 redirects
            ]);

            // Attach tags
            if (!empty($article['tags'])) {
                $newArticle->attachTags($article['tags']);
            }

            // Handle image with Spatie Media Library
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                $newArticle->addMediaFromDisk($imagePath, 'public')
                    ->toMediaCollection('articles');
            }

            $this->successCount++;
            $this->components->info("   ✅ Saved: ID #{$newArticle->id}");
        });
    }

    /**
     * Translate text using Ollama (Gemma 2)
     */
    protected function translateWithOllama(string $text): string
    {
        if (empty(trim($text))) {
            return $text;
        }

        try {
            $response = Http::timeout(300)
                ->post('http://127.0.0.1:11434/api/generate', [
                    'model' => 'gemma2',
                    'prompt' => "You are an expert gaming journalist. Translate this content from Bosnian to professional gaming English. Keep all HTML structure and media tags intact. Output ONLY the translation, nothing else:\n\n{$text}",
                    'stream' => false,
                ]);

            if ($response->successful()) {
                $result = $response->json('response');
                return $result ?: $text;
            }

            $this->components->warn("   ⚠️  Translation API failed, using original");
            return $text;

        } catch (\Exception $e) {
            $this->components->warn("   ⚠️  Translation timeout: " . Str::limit($e->getMessage(), 50));
            return $text;
        }
    }

    /**
     * Determine section and category based on WP categories/tags
     */
    protected function determineCategory(array $wpCategories, array $wpTags): array
    {
        // Check categories first (higher priority)
        foreach ($wpCategories as $cat) {
            $key = Str::lower(trim($cat));
            if (isset($this->categoryMapping[$key])) {
                return $this->categoryMapping[$key];
            }
        }

        // Check tags
        foreach ($wpTags as $tag) {
            $key = Str::lower(trim($tag));
            if (isset($this->categoryMapping[$key])) {
                return $this->categoryMapping[$key];
            }
        }

        // Default fallback
        return ['section' => 'news', 'category' => 'gaming'];
    }

    /**
     * Process image - download and save (Spatie will handle optimization)
     */
    protected function processImage(string $url, string $slug): ?string
    {
        try {
            // Download image
            $response = Http::timeout(30)->get($url);

            if (!$response->successful()) {
                $this->components->warn("   ⚠️  Could not download image");
                return null;
            }

            $imageData = $response->body();

            // Get extension from URL
            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';

            // Generate filename
            $filename = Str::slug($slug) . '-' . uniqid() . '.' . $extension;
            $storagePath = 'articles/' . $filename;
            $fullPath = storage_path('app/public/' . $storagePath);

            // Ensure directory exists
            $dir = dirname($fullPath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            // Save image directly
            file_put_contents($fullPath, $imageData);

            return $storagePath;

        } catch (\Exception $e) {
            $this->components->warn("   ⚠️  Image failed: " . Str::limit($e->getMessage(), 40));
            return null;
        }
    }

    /**
     * Find or create author by name
     */
    protected function findOrCreateAuthor(string $name): User
    {
        $user = User::where('name', $name)->first();

        if (!$user) {
            $email = Str::slug($name) . '@techplay.gg';

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt(Str::random(16)),
            ]);

            $this->components->info("   👤 Created author: {$name}");
        }

        return $user;
    }

    /**
     * Ensure slug is unique
     */
    protected function ensureUniqueSlug(string $slug): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while (Article::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Log error to file
     */
    protected function logError(string $title, string $error): void
    {
        $logPath = storage_path('logs/migration-errors.log');
        $timestamp = now()->toDateTimeString();
        $message = "[{$timestamp}] {$title}: {$error}\n";
        file_put_contents($logPath, $message, FILE_APPEND);
    }

    /**
     * Print final summary
     */
    protected function printSummary(): void
    {
        $this->newLine();
        $this->components->info('╔══════════════════════════════════════════════════════════════╗');
        $this->components->info('║                    MIGRATION COMPLETE                        ║');
        $this->components->info('╚══════════════════════════════════════════════════════════════╝');
        $this->newLine();

        $this->components->twoColumnDetail('✅ Successful', "<fg=green>{$this->successCount}</>");
        $this->components->twoColumnDetail('⏭️  Skipped (duplicates)', "<fg=yellow>{$this->skippedCount}</>");
        $this->components->twoColumnDetail('❌ Failed', "<fg=red>{$this->failedCount}</>");

        $this->newLine();

        if (!empty($this->failedArticles)) {
            $this->components->warn('Failed articles:');
            foreach (array_slice($this->failedArticles, 0, 10) as $failed) {
                $this->line("   • {$failed['title']}: {$failed['error']}");
            }

            if (count($this->failedArticles) > 10) {
                $remaining = count($this->failedArticles) - 10;
                $this->line("   ... and {$remaining} more. See storage/logs/migration-errors.log");
            }
        }

        $this->newLine();
        $this->components->info('📋 Old URLs saved in wp_old_url column for 301 redirects');
        $this->newLine();
    }
}
