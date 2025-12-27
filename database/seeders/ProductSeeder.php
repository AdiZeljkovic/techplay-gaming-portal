<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Cyberpunk Bomber Jacket',
                'price' => 89.99,
                'category' => 'Hoodies', // mapped to Hoodies for now
                'image' => 'https://images.unsplash.com/photo-1551028919-ac7437140738?auto=format&fit=crop&q=80',
                'description' => 'High-collar bomber jacket with neon accents and water-resistant finish.',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Black', 'Navy'],
            ],
            [
                'name' => 'Pixel Art Tee',
                'price' => 29.99,
                'category' => 'T-Shirts',
                'image' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80',
                'description' => '100% Cotton tee featuring retro pixel art graphics.',
                'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                'colors' => ['White', 'Black', 'Grey'],
            ],
            [
                'name' => 'Tactical Cargo Pants',
                'price' => 65.00,
                'category' => 'All', // fallback
                'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80',
                'description' => 'Durable cargo pants with multiple pockets for all your gear.',
                'sizes' => ['30', '32', '34', '36', '38'],
                'colors' => ['Camo', 'Black'],
            ],
            [
                'name' => 'Pro Gamer Cap',
                'price' => 24.99,
                'category' => 'Headwear',
                'image' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89d?auto=format&fit=crop&q=80',
                'description' => 'Snapback cap with embroidered logo and breathable mesh back.',
                'sizes' => ['One Size'],
                'colors' => ['Red', 'Blue', 'Black'],
            ],
            [
                'name' => 'Neon Pulse Hoodie',
                'price' => 59.99,
                'sale_price' => 49.99,
                'category' => 'Hoodies',
                'image' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80',
                'description' => 'Soft fleece hoodie with glow-in-the-dark piping.',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Black/Neon Green', 'Black/Neon Pink'],
                'is_featured' => true,
            ],
        ];

        foreach ($products as $p) {
            Product::create([
                'name' => $p['name'],
                'slug' => Str::slug($p['name']),
                'price' => $p['price'],
                'sale_price' => $p['sale_price'] ?? null,
                'category' => $p['category'],
                'description' => $p['description'],
                'image' => $p['image'],
                'sizes' => $p['sizes'],
                'colors' => $p['colors'],
                'stock' => rand(10, 100),
                'is_active' => true,
                'is_featured' => $p['is_featured'] ?? false,
                'sku' => strtoupper(Str::random(8)),
            ]);
        }
    }
}
