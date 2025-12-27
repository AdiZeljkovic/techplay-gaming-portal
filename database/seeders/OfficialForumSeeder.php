<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumCategory;
use App\Models\Thread;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class OfficialForumSeeder extends Seeder
{
    public function run()
    {
        // 1. Cleanup existing forum data
        $this->command->info('Cleaning up old forum data...');
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Post::truncate(); // Truncate posts first (child of threads)
        Thread::truncate(); // Truncate threads (child of categories)
        ForumCategory::truncate(); // Truncate categories
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 2. Define Official Categories Structure
        $categories = [
            [
                'name' => 'Official Information',
                'description' => 'News, announcements, and official updates from the TechPlay team.',
                'icon' => 'Star',
                'color' => '#6366f1', // Indigo
                'children' => [
                    ['name' => 'News & Announcements', 'description' => 'Official news and updates.'],
                    ['name' => 'Patch Notes', 'description' => 'Latest updates and changes to the platform.'],
                    ['name' => 'Rules & Guidelines', 'description' => 'Community standards and expectations.'],
                ]
            ],
            [
                'name' => 'General Gaming',
                'description' => 'The heart of the discussion. Talk about games, genres, and the industry.',
                'icon' => 'MessageSquare',
                'color' => '#ec4899', // Pink
                'children' => [
                    ['name' => 'General Discussion', 'description' => 'Talk about anything gaming related.'],
                    ['name' => 'Upcoming Releases', 'description' => 'Hype and speculation for new games.'],
                    ['name' => 'Retro Gaming', 'description' => 'Classics, emulation, and nostalgia.'],
                    ['name' => 'Esports', 'description' => 'Professional gaming, tournaments, and teams.'],
                ]
            ],
            [
                'name' => 'Platforms',
                'description' => 'Specific discussions for each major gaming platform.',
                'icon' => 'Cpu', // or Gamepad/Monitor
                'color' => '#ef4444', // Red
                'children' => [
                    ['name' => 'PC Gaming', 'description' => 'Steam, Epic, builds, and mods.'],
                    ['name' => 'PlayStation', 'description' => 'PS5, PS4, and exclusives.'],
                    ['name' => 'Xbox', 'description' => 'Series X|S, Game Pass, and Halo.'],
                    ['name' => 'Nintendo', 'description' => 'Switch, Mario, Zelda, and portable gaming.'],
                ]
            ],
            [
                'name' => 'Hardware & Tech',
                'description' => 'Gear up. Discuss builds, components, and peripherals.',
                'icon' => 'Cpu',
                'color' => '#3b82f6', // Blue
                'children' => [
                    ['name' => 'Build Showcases', 'description' => 'Show off your rig (Battlestations).'],
                    ['name' => 'Tech Support', 'description' => 'Troubleshooting hardware and software issues.'],
                    ['name' => 'Peripherals', 'description' => 'Keyboards, mice, headsets, and monitors.'],
                    ['name' => 'Overclocking & Modding', 'description' => 'Pushing your hardware to the limit.'],
                ]
            ],
            [
                'name' => 'Community',
                'description' => 'Connect with other members.',
                'icon' => 'Users',
                'color' => '#10b981', // Green
                'children' => [
                    ['name' => 'Introductions', 'description' => 'New here? Say hello!'],
                    ['name' => 'LFG / Recruitment', 'description' => 'Find a squad or recruit for your clan.'],
                    ['name' => 'Content Creators', 'description' => 'Promote your streams, videos, and art.'],
                    ['name' => 'Off-Topic', 'description' => 'Talk about movies, music, life, and more.'],
                ]
            ],
            [
                'name' => 'Support & Feedback',
                'description' => 'Help us improve the specialized Gaming Portal.',
                'icon' => 'LifeBuoy',
                'color' => '#8b5cf6', // Purple
                'children' => [
                    ['name' => 'Site Feedback', 'description' => 'Suggestions and ideas for the website.'],
                    ['name' => 'Bug Reports', 'description' => 'Found a glitch? Report it here.'],
                ]
            ]
        ];

        // 3. Seed Categories
        foreach ($categories as $catData) {
            $children = $catData['children'] ?? [];
            unset($catData['children']);

            $catData['slug'] = \Illuminate\Support\Str::slug($catData['name']);
            $catData['is_section'] = true;

            $parent = ForumCategory::create($catData);
            $this->command->info("Created Category: {$parent->name}");

            foreach ($children as $childData) {
                $childData['parent_id'] = $parent->id;
                $childData['slug'] = \Illuminate\Support\Str::slug($childData['name']);
                // Inherit color/icon style mostly, but maybe simplified
                $childData['color'] = $parent->color;
                $childData['icon'] = $parent->icon;

                ForumCategory::create($childData);
            }
        }

        $this->command->info('Official Forum Categories Seeded Successfully!');
    }
}
