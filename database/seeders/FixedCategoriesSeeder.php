<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FixedCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'news' => [
                'Gaming',
                'Console',
                'PC',
                'Movies & TV',
                'Industry',
                'E-sport',
                'Opinions',
            ],
            'reviews' => [
                // 'Latest' is typically a sort, but user requested it as a category "fixed"
                // If it's meant to be a query filter, it shouldn't be a category, but for now I follow instruction.
                // Actually, "Latest" usually just means "Show me all reviews sorted by date". 
                // Creating a category named "Latest" might be confusing if no articles are assigned to it.
                // However, "AAA Titles", "Indie Gems", "Retro" are definitely categories/tags.
                // I will include "Latest" as requested, but maybe it acts as a "General" category if not logical.
                // Re-reading: "Reviews... Latest, Editor's Choice..."
                // Use explicit slugs to avoid collision if necessary.
                'Latest',
                'Editor\'s Choice',
                'AAA Titles',
                'Indie Gems',
                'Retro',
            ],
            'tech' => [
                'Hardware',
                'Benchmarks',
                'Guides',
            ],
        ];

        foreach ($categories as $section => $names) {
            foreach ($names as $name) {
                // Determine valid slug
                $slug = Str::slug($name);

                // If specific slugs are needed to be distinct (though these look unique across sections)
                // e.g. if 'Guides' existed in both, we'd need 'tech-guides'.
                // For now, simple slug is fine.

                Category::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $name,
                        'section' => $section,
                    ]
                );
            }
        }

        $this->command->info('Fixed categories seeded successfully.');
    }
}
