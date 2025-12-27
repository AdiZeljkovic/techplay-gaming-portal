<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    use HasFactory, \Spatie\Activitylog\Traits\LogsActivity;

    public function getActivitylogOptions(): \Spatie\Activitylog\LogOptions
    {
        return \Spatie\Activitylog\LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty();
    }

    protected $guarded = [];

    protected $casts = [
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function options(): HasMany
    {
        return $this->hasMany(PollOption::class);
    }

    public function getTotalVotesAttribute(): int
    {
        return $this->options->sum(fn($option) => $option->votes()->count());
    }
}
