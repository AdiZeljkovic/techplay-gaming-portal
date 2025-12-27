<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    protected $fillable = [
        'code',
        'description',
        'type',
        'value',
        'min_order_value',
        'max_uses',
        'times_used',
        'is_active',
        'starts_at',
        'expires_at',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_value' => 'decimal:2',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function isValid(): bool
    {
        if (!$this->is_active)
            return false;
        if ($this->max_uses && $this->times_used >= $this->max_uses)
            return false;
        if ($this->starts_at && now()->lt($this->starts_at))
            return false;
        if ($this->expires_at && now()->gt($this->expires_at))
            return false;
        return true;
    }

    public function calculateDiscount(float $orderTotal): float
    {
        if (!$this->isValid())
            return 0;
        if ($this->min_order_value && $orderTotal < $this->min_order_value)
            return 0;

        if ($this->type === 'percentage') {
            return round($orderTotal * ($this->value / 100), 2);
        }

        return min($this->value, $orderTotal);
    }

    public function incrementUsage(): void
    {
        $this->increment('times_used');
    }
}
