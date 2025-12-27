<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'title',
        'youtube_url',
        'thumbnail_url',
        'is_featured',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::saving(function ($video) {
            if ($video->isDirty('youtube_url') && empty($video->thumbnail_url)) {
                $video->thumbnail_url = self::getYoutubeThumbnail($video->youtube_url);
            }
        });
    }

    public static function getYoutubeThumbnail($url)
    {
        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches);
        $id = $matches[1] ?? null;
        return $id ? "https://img.youtube.com/vi/{$id}/maxresdefault.jpg" : null;
    }
}
