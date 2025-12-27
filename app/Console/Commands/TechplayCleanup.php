<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TechplayCleanup extends Command
{
    protected $signature = 'techplay:cleanup 
                            {--dry-run : Run without making changes}
                            {--min-words=200 : Minimum word count threshold}
                            {--skip-images : Skip image fixing (faster)}';

    protected $description = 'Spring cleaning: Remove thin content, fix images, clean HTML from migrated WordPress articles';

    private int $deletedThinContent = 0;
    private int $imagesFixed = 0;
    private int $imagesFailed = 0;
    private int $htmlCleaned = 0;

    // Allowed HTML tags for content
    private array $allowedTags = ['p', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3', 'img', 'iframe', 'a', 'br'];

    // WordPress classes to remove
    private array $wpClassPatterns = [
        '/class="[^"]*wp-[^"]*"/i',
        '/class="[^"]*has-[^"]*"/i',
        '/class="[^"]*aligncenter[^"]*"/i',
        '/class="[^"]*alignleft[^"]*"/i',
        '/class="[^"]*alignright[^"]*"/i',
        '/class="[^"]*size-[^"]*"/i',
        '/class=""/i', // Empty class attributes
    ];

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $minWords = (int) $this->option('min-words');

        $this->info('');
        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║          TechPlay Database Spring Cleaning                   ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');
        $this->info('');

        if ($isDryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
            $this->info('');
        }

        $articles = Article::all();
        $totalArticles = $articles->count();

        $this->info("📊 Found {$totalArticles} articles to process");
        $this->info('');

        $progressBar = $this->output->createProgressBar($totalArticles);
        $progressBar->start();

        foreach ($articles as $article) {
            $this->processArticle($article, $isDryRun, $minWords);
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->info('');
        $this->info('');

        // Final Report
        $this->printReport($isDryRun);

        return Command::SUCCESS;
    }

    private function processArticle(Article $article, bool $isDryRun, int $minWords): void
    {
        // Step 1: Check word count
        $plainText = strip_tags($article->body ?? '');
        $wordCount = str_word_count($plainText);

        if ($wordCount < $minWords) {
            if (!$isDryRun) {
                $article->delete();
            }
            $this->deletedThinContent++;
            return; // Article deleted, skip other steps
        }

        // Step 2: Fix featured image (if not skipped)
        if (!$this->option('skip-images')) {
            $this->fixFeaturedImage($article, $isDryRun);
        }

        // Step 3: Clean HTML content
        $cleanedBody = $this->cleanHtml($article->body ?? '');

        if ($cleanedBody !== $article->body) {
            if (!$isDryRun) {
                $article->update(['body' => $cleanedBody]);
            }
            $this->htmlCleaned++;
        }
    }

    private function fixFeaturedImage(Article $article, bool $isDryRun): void
    {
        // Check if article has media via Spatie Media Library
        $featuredImage = $article->getFirstMedia('featured_image');

        if ($featuredImage) {
            // Image exists in media library
            return;
        }

        // No featured image - try to recover from wp_old_url
        if (empty($article->wp_old_url)) {
            // No old URL to recover from
            $this->imagesFailed++;
            return;
        }

        // Try to extract image from WordPress URL
        $imageUrl = $this->extractImageFromWpUrl($article->wp_old_url);

        if (!$imageUrl) {
            $this->imagesFailed++;
            return;
        }

        if (!$isDryRun) {
            $success = $this->downloadAndConvertImage($article, $imageUrl);
            if ($success) {
                $this->imagesFixed++;
            } else {
                $this->imagesFailed++;
            }
        } else {
            // In dry-run, assume it would succeed
            $this->imagesFixed++;
        }
    }

    private function extractImageFromWpUrl(string $wpUrl): ?string
    {
        // Try to fetch the old WordPress page and extract og:image
        try {
            $response = Http::timeout(10)->get($wpUrl);

            if (!$response->successful()) {
                return null;
            }

            $html = $response->body();

            // Try og:image meta tag
            if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/', $html, $matches)) {
                return $matches[1];
            }

            // Try twitter:image
            if (preg_match('/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']/', $html, $matches)) {
                return $matches[1];
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function downloadAndConvertImage(Article $article, string $imageUrl): bool
    {
        $tempPath = null;
        try {
            $response = Http::timeout(30)->get($imageUrl);

            if (!$response->successful()) {
                return false;
            }

            $imageData = $response->body();

            // Validate we got actual image data
            if (strlen($imageData) < 1000) {
                return false;
            }

            $tempPath = storage_path('app/temp_' . uniqid() . '.tmp');
            file_put_contents($tempPath, $imageData);

            // Ensure output directory exists
            $outputDir = storage_path('app/public/articles');
            if (!is_dir($outputDir)) {
                mkdir($outputDir, 0755, true);
            }

            $webpPath = $outputDir . '/' . $article->slug . '-featured.webp';

            // Try to convert to WebP using Intervention Image
            try {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($tempPath);
                $image->toWebp(85)->save($webpPath);
            } catch (\Exception $e) {
                // If WebP conversion fails, just copy the original
                $extension = pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                $fallbackPath = $outputDir . '/' . $article->slug . '-featured.' . $extension;
                copy($tempPath, $fallbackPath);
                $webpPath = $fallbackPath;
            }

            // Clean up temp file
            @unlink($tempPath);

            // Add to Spatie Media Library if file exists
            if (file_exists($webpPath)) {
                $article->addMedia($webpPath)
                    ->toMediaCollection('featured_image');
                return true;
            }

            return false;
        } catch (\Exception $e) {
            // Clean up on any failure
            if ($tempPath && file_exists($tempPath)) {
                @unlink($tempPath);
            }
            return false;
        }
    }

    private function cleanHtml(string $html): string
    {
        // Step 1: Remove WordPress-specific classes
        foreach ($this->wpClassPatterns as $pattern) {
            $html = preg_replace($pattern, '', $html);
        }

        // Step 2: Strip disallowed tags but keep allowed ones
        $allowedTagsString = '<' . implode('><', $this->allowedTags) . '>';
        $html = strip_tags($html, $allowedTagsString);

        // Step 3: Remove empty paragraphs
        $html = preg_replace('/<p>\s*<\/p>/i', '', $html);
        $html = preg_replace('/<p>&nbsp;<\/p>/i', '', $html);

        // Step 4: Remove excessive whitespace
        $html = preg_replace('/\s+/', ' ', $html);
        $html = preg_replace('/>\s+</', '><', $html);

        // Step 5: Restore proper paragraph spacing
        $html = str_replace('</p><p>', "</p>\n\n<p>", $html);
        $html = str_replace('</h2><', "</h2>\n<", $html);
        $html = str_replace('</h3><', "</h3>\n<", $html);

        return trim($html);
    }

    private function printReport(bool $isDryRun): void
    {
        $modeLabel = $isDryRun ? ' (DRY RUN)' : '';

        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║                    CLEANUP REPORT' . str_pad($modeLabel, 27) . '║');
        $this->info('╠══════════════════════════════════════════════════════════════╣');
        $this->info('║                                                              ║');
        $this->info('║  🗑️  Articles deleted (thin content): ' . str_pad((string) $this->deletedThinContent, 20) . '║');
        $this->info('║  🖼️  Images fixed/recovered:          ' . str_pad((string) $this->imagesFixed, 20) . '║');
        $this->info('║  ❌  Images failed to recover:        ' . str_pad((string) $this->imagesFailed, 20) . '║');
        $this->info('║  🧹  Articles HTML cleaned:           ' . str_pad((string) $this->htmlCleaned, 20) . '║');
        $this->info('║                                                              ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');

        if ($isDryRun) {
            $this->info('');
            $this->warn('Run without --dry-run to apply changes.');
        } else {
            $this->info('');
            $this->info('✅ Cleanup completed successfully!');
        }
    }
}
