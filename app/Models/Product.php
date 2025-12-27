<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

use Laravel\Scout\Searchable;

class Product extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia, Searchable;

    protected $guarded = [];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'gallery' => 'array',
        'sizes' => 'array',
        'colors' => 'array',
        'attributes' => 'array',
    ];

    /**
     * Get the order items for this product.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the effective price (sale or regular).
     */
    public function getEffectivePriceAttribute(): float
    {
        return (float) ($this->sale_price ?? $this->price);
    }

    /**
     * Check if product is on sale.
     */
    public function getIsOnSaleAttribute(): bool
    {
        return $this->sale_price !== null && $this->sale_price < $this->price;
    }

    /**
     * Check if product is in stock.
     */
    public function getInStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Scope for active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for category filter.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('product_images')
            ->useDisk('public');
    }

    public function getSchema(): \Spatie\SchemaOrg\Product
    {
        return \Spatie\SchemaOrg\Schema::product()
            ->name($this->name)
            ->description(strip_tags($this->description))
            ->sku($this->sku ?? $this->id)
            ->image($this->getFirstMediaUrl('products') ?: asset('images/default-product.jpg'))
            ->offers(
                \Spatie\SchemaOrg\Schema::offer()
                    ->price($this->effective_price)
                    ->priceCurrency('USD')
                    ->availability($this->in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock')
            );
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => strip_tags($this->description),
            'price' => (float) $this->price,
            'category' => $this->category,
            'sku' => $this->sku,
            'in_stock' => $this->in_stock,
        ];
    }
}
