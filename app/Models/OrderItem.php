<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'options' => 'array',
    ];

    /**
     * Boot method to calculate subtotal.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            $item->subtotal = $item->price * $item->quantity;
        });

        static::updating(function ($item) {
            $item->subtotal = $item->price * $item->quantity;
        });
    }

    /**
     * Get the order this item belongs to.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product (if still exists).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
