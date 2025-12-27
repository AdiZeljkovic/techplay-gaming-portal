<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    private ImageManager $manager;
    private int $maxWidth = 1920;
    private int $quality = 80;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Process and store an uploaded image.
     * - Resizes to max 1920px width (maintains aspect ratio)
     * - Converts to WebP format
     * - Applies 80% quality compression
     *
     * @param UploadedFile $file The uploaded image file
     * @param string $directory Storage directory (e.g., 'avatars', 'covers')
     * @param string|null $filename Optional custom filename (without extension)
     * @return string The stored file path
     */
    public function processAndStore(UploadedFile $file, string $directory, ?string $filename = null): string
    {
        // Read the image
        $image = $this->manager->read($file->getRealPath());

        // Resize if wider than max width
        if ($image->width() > $this->maxWidth) {
            $image->scale(width: $this->maxWidth);
        }

        // Generate filename
        $filename = $filename ?? Str::uuid()->toString();
        $path = "{$directory}/{$filename}.webp";

        // Encode to WebP with quality
        $encoded = $image->toWebp($this->quality);

        // Store the processed image
        Storage::disk('public')->put($path, $encoded->toString());

        return $path;
    }

    /**
     * Process image from URL and store it.
     *
     * @param string $url Image URL
     * @param string $directory Storage directory
     * @return string|null The stored file path or null on failure
     */
    public function processFromUrl(string $url, string $directory): ?string
    {
        try {
            $image = $this->manager->read($url);

            if ($image->width() > $this->maxWidth) {
                $image->scale(width: $this->maxWidth);
            }

            $filename = Str::uuid()->toString();
            $path = "{$directory}/{$filename}.webp";

            $encoded = $image->toWebp($this->quality);
            Storage::disk('public')->put($path, $encoded->toString());

            return $path;
        } catch (\Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Create a thumbnail from an existing image.
     *
     * @param string $sourcePath Source image path in storage
     * @param int $width Thumbnail width
     * @param int $height Thumbnail height
     * @return string|null Thumbnail path
     */
    public function createThumbnail(string $sourcePath, int $width = 300, int $height = 200): ?string
    {
        try {
            $fullPath = Storage::disk('public')->path($sourcePath);
            $image = $this->manager->read($fullPath);

            $image->cover($width, $height);

            $pathInfo = pathinfo($sourcePath);
            $thumbnailPath = "{$pathInfo['dirname']}/thumb_{$pathInfo['filename']}.webp";

            $encoded = $image->toWebp($this->quality);
            Storage::disk('public')->put($thumbnailPath, $encoded->toString());

            return $thumbnailPath;
        } catch (\Exception $e) {
            report($e);
            return null;
        }
    }

    /**
     * Delete an image and its thumbnail if exists.
     */
    public function delete(string $path): void
    {
        Storage::disk('public')->delete($path);

        // Try to delete thumbnail too
        $pathInfo = pathinfo($path);
        $thumbnailPath = "{$pathInfo['dirname']}/thumb_{$pathInfo['filename']}.webp";
        Storage::disk('public')->delete($thumbnailPath);
    }
}
