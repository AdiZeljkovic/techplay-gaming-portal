<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // News Section
            ['name' => 'Gaming', 'slug' => 'gaming', 'section' => 'news'],
            ['name' => 'Console', 'slug' => 'consoles', 'section' => 'news'],
            ['name' => 'PC', 'slug' => 'pc', 'section' => 'news'],
            ['name' => 'Movies & TV', 'slug' => 'movies', 'section' => 'news'],
            ['name' => 'Industry', 'slug' => 'industry', 'section' => 'news'],
            ['name' => 'E-sport', 'slug' => 'esports', 'section' => 'news'],
            ['name' => 'Opinions', 'slug' => 'opinions', 'section' => 'news'],

            // Reviews Section
            ['name' => 'Latest', 'slug' => 'latest', 'section' => 'reviews'],
            ['name' => "Editor's Choice", 'slug' => 'editors-choice', 'section' => 'reviews'],
            ['name' => 'AAA Titles', 'slug' => 'aaa', 'section' => 'reviews'],
            ['name' => 'Indie Gems', 'slug' => 'indie', 'section' => 'reviews'],
            ['name' => 'Retro', 'slug' => 'retro', 'section' => 'reviews'],

            // Tech Section
            ['name' => 'News', 'slug' => 'news', 'section' => 'tech'],
            ['name' => 'Reviews', 'slug' => 'reviews', 'section' => 'tech'],
            ['name' => 'Guides', 'slug' => 'guides', 'section' => 'tech'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug'], 'section' => $category['section']],
                ['name' => $category['name']]
            );
        }
    }
}
