<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Badge extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function reviews(): BelongsToMany
    {
        return $this->belongsToMany(Review::class, 'badge_review');
    }
}
