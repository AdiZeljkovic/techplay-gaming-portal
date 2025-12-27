<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class TechplayFixImages extends Command
{
    protected $signature = 'techplay:fix-images 
                            {--dry-run : Run without making changes}
                            {--limit=0 : Limit number of articles to process (0 = all)}';

    protected $description = 'Fix missing featured images for articles by downloading from wp_old_url';

    private int $imagesFixed = 0;
    private int $imagesFailed = 0;
    private int $imagesSkipped = 0;
    private array $errors = [];

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $limit = (int) $this->option('limit');

        $this->info('');
        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║          TechPlay Image Fixer                                ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');
        $this->info('');

        if ($isDryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
            $this->info('');
        }

        // Get articles without featured images
        $query = Article::whereDoesntHave('media', function ($q) {
            $q->where('collection_name', 'featured_image');
        })->whereNotNull('wp_old_url');

        if ($limit > 0) {
            $query->limit($limit);
        }

        $articles = $query->get();
        $totalArticles = $articles->count();

        $this->info("📊 Found {$totalArticles} articles without featured images");
        $this->info('');

        if ($totalArticles === 0) {
            $this->info('✅ All articles already have featured images!');
            return Command::SUCCESS;
        }

        $progressBar = $this->output->createProgressBar($totalArticles);
        $progressBar->start();

        foreach ($articles as $article) {
            $this->processArticle($article, $isDryRun);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->info('');
        $this->info('');

        $this->printReport($isDryRun);

        return Command::SUCCESS;
    }

    private function processArticle(Article $article, bool $isDryRun): void
    {
        if (empty($article->wp_old_url)) {
            $this->imagesSkipped++;
            return;
        }

        // Try to extract image URL from the old WordPress page
        $imageUrl = $this->extractImageFromWpUrl($article->wp_old_url);

        if (!$imageUrl) {
            $this->imagesFailed++;
            $this->errors[] = "No image found for: {$article->title}";
            return;
        }

        if ($isDryRun) {
            $this->imagesFixed++;
            return;
        }

        // Download and save the image
        $success = $this->downloadAndSaveImage($article, $imageUrl);

        if ($success) {
            $this->imagesFixed++;
        } else {
            $this->imagesFailed++;
        }
    }

    private function extractImageFromWpUrl(string $wpUrl): ?string
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                ])
                ->get($wpUrl);

            if (!$response->successful()) {
                return null;
            }

            $html = $response->body();

            // Try og:image meta tag (most reliable)
            if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $matches)) {
                return $this->cleanImageUrl($matches[1]);
            }

            // Try content attribute first pattern
            if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']/i', $html, $matches)) {
                return $this->cleanImageUrl($matches[1]);
            }

            // Try twitter:image
            if (preg_match('/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $matches)) {
                return $this->cleanImageUrl($matches[1]);
            }

            // Try first large image in content
            if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches)) {
                foreach ($matches[1] as $imgUrl) {
                    // Skip small images, icons, etc.
                    if (
                        strpos($imgUrl, 'icon') !== false ||
                        strpos($imgUrl, 'logo') !== false ||
                        strpos($imgUrl, 'avatar') !== false ||
                        strpos($imgUrl, '32') !== false ||
                        strpos($imgUrl, '16') !== false
                    ) {
                        continue;
                    }
                    return $this->cleanImageUrl($imgUrl);
                }
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function cleanImageUrl(string $url): string
    {
        // Decode HTML entities
        $url = html_entity_decode($url);

        // Remove any query parameters that might cause issues
        $parsed = parse_url($url);

        if (!isset($parsed['scheme'])) {
            // Relative URL, try to make it absolute
            return $url;
        }

        return $url;
    }

    private function downloadAndSaveImage(Article $article, string $imageUrl): bool
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                ])
                ->get($imageUrl);

            if (!$response->successful()) {
                $this->errors[] = "Failed to download: {$imageUrl}";
                return false;
            }

            $imageData = $response->body();

            // Validate image data
            if (strlen($imageData) < 1000) {
                $this->errors[] = "Image too small: {$imageUrl}";
                return false;
            }

            // Detect image type from content
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($imageData);

            $extension = match ($mimeType) {
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp',
                default => null
            };

            if (!$extension) {
                $this->errors[] = "Unknown image type ({$mimeType}): {$imageUrl}";
                return false;
            }

            // Create a safe filename
            $filename = 'articles/' . $article->slug . '-featured.' . $extension;

            // Save to storage
            Storage::disk('public')->put($filename, $imageData);

            $fullPath = Storage::disk('public')->path($filename);

            // Add to Spatie Media Library
            $article->addMedia($fullPath)
                ->toMediaCollection('featured_image');

            return true;
        } catch (\Exception $e) {
            $this->errors[] = "Error for {$article->slug}: " . $e->getMessage();
            return false;
        }
    }

    private function printReport(bool $isDryRun): void
    {
        $modeLabel = $isDryRun ? ' (DRY RUN)' : '';

        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║                    IMAGE FIX REPORT' . str_pad($modeLabel, 24) . '║');
        $this->info('╠══════════════════════════════════════════════════════════════╣');
        $this->info('║                                                              ║');
        $this->info('║  ✅  Images fixed:                    ' . str_pad((string) $this->imagesFixed, 20) . '║');
        $this->info('║  ❌  Images failed:                   ' . str_pad((string) $this->imagesFailed, 20) . '║');
        $this->info('║  ⏭️  Images skipped (no wp_url):      ' . str_pad((string) $this->imagesSkipped, 20) . '║');
        $this->info('║                                                              ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');

        if (count($this->errors) > 0 && $this->output->isVerbose()) {
            $this->info('');
            $this->warn('Errors encountered:');
            foreach (array_slice($this->errors, 0, 10) as $error) {
                $this->line("  - {$error}");
            }
            if (count($this->errors) > 10) {
                $this->line("  ... and " . (count($this->errors) - 10) . " more");
            }
        }

        if ($isDryRun) {
            $this->info('');
            $this->warn('Run without --dry-run to apply changes.');
        } else {
            $this->info('');
            $this->info('✅ Image fixing completed!');
        }
    }
}
