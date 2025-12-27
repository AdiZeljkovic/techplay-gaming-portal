<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumCategory extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Relationship: Parent Category (for Subcategories)
    public function parent()
    {
        return $this->belongsTo(ForumCategory::class, 'parent_id');
    }

    // Relationship: Child Categories (Subcategories)
    public function children()
    {
        return $this->hasMany(ForumCategory::class, 'parent_id');
    }

    // Relationship: Threads (A category has many threads)
    public function threads(): HasMany
    {
        return $this->hasMany(Thread::class);
    }
}
