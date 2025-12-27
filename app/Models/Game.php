<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Game extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'rawg_id',
        'slug',
        'name',
        'released',
        'background_image',
        'rating',
        'rating_top',
        'metacritic',
        'playtime',
        'description',
        'esrb_rating',
        'genres',
        'platforms',
        'stores',
        'tags',
        'last_synced_at'
    ];

    protected $casts = [
        'released' => 'date',
        'rating' => 'decimal:2',
        'genres' => 'array',
        'platforms' => 'array',
        'stores' => 'array',
        'tags' => 'array',
        'last_synced_at' => 'datetime',
    ];
    protected $appends = ['user_score'];

    public function reviews()
    {
        return $this->hasMany(GameReview::class);
    }

    public function getUserScoreAttribute()
    {
        // Cache this ideally, but for now calculate on fly
        return round($this->reviews()->avg('rating'), 1);
    }
}
