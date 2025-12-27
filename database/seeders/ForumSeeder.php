<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumCategory;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Section: General
        $general = ForumCategory::create([
            'name' => 'General Hub',
            'slug' => 'general-hub',
            'description' => 'News, Announcements, and community chatter.',
            'is_section' => true,
            'order' => 10,
        ]);

        ForumCategory::create([
            'parent_id' => $general->id,
            'name' => 'Announcements',
            'slug' => 'announcements',
            'description' => 'Official updates from the TechPlay team.',
            'icon' => 'Megaphone',
            'color' => '#dc2626',
            'order' => 11,
        ]);

        ForumCategory::create([
            'parent_id' => $general->id,
            'name' => 'General Discussion',
            'slug' => 'general-discussion',
            'description' => 'Talk about anything gaming related.',
            'icon' => 'MessageSquare',
            'color' => '#6366f1',
            'order' => 12,
        ]);

        // 2. Section: Hardware Zone
        $hardware = ForumCategory::create([
            'name' => 'Hardware Zone',
            'slug' => 'hardware-zone',
            'description' => 'For the gearheads and builders.',
            'is_section' => true,
            'order' => 20,
        ]);

        ForumCategory::create([
            'parent_id' => $hardware->id,
            'name' => 'PC Builds',
            'slug' => 'pc-builds',
            'description' => 'Show off your rig or ask for build help.',
            'icon' => 'Cpu',
            'color' => '#10b981',
            'order' => 21,
        ]);

        ForumCategory::create([
            'parent_id' => $hardware->id,
            'name' => 'Peripherals',
            'slug' => 'peripherals',
            'description' => 'Keyboards, mice, monitors, and more.',
            'icon' => 'Keyboard',
            'color' => '#f59e0b',
            'order' => 22,
        ]);

        // 3. Section: Gaming Lounge
        $gaming = ForumCategory::create([
            'name' => 'Gaming Lounge',
            'slug' => 'gaming-lounge',
            'description' => 'Discuss your favorite genres.',
            'is_section' => true,
            'order' => 30,
        ]);

        ForumCategory::create([
            'parent_id' => $gaming->id,
            'name' => 'RPG & Adventure',
            'slug' => 'rpg-adventure',
            'description' => 'Baldur\'s Gate, Starfield, and epic quests.',
            'icon' => 'Sword',
            'color' => '#8b5cf6',
            'order' => 31,
        ]);

        ForumCategory::create([
            'parent_id' => $gaming->id,
            'name' => 'FPS & Shooters',
            'slug' => 'fps-shooters',
            'description' => 'Call of Duty, Valorant, and aim training.',
            'icon' => 'Crosshair',
            'color' => '#ef4444',
            'order' => 32,
        ]);

        ForumCategory::create([
            'parent_id' => $gaming->id,
            'name' => 'Strategy & Sim',
            'slug' => 'strategy-sim',
            'description' => 'Civ VI, Cities Skylines, and big brains.',
            'icon' => 'Map',
            'color' => '#3b82f6',
            'order' => 33,
        ]);

        // 4. Section: Support
        $support = ForumCategory::create([
            'name' => 'Support Desk',
            'slug' => 'support-desk',
            'description' => 'Get help with your account or report bugs.',
            'is_section' => true,
            'order' => 40,
        ]);

        ForumCategory::create([
            'parent_id' => $support->id,
            'name' => 'Site Feedback',
            'slug' => 'site-feedback',
            'description' => 'Tell us how we can improve TechPlay.',
            'icon' => 'HelpCircle',
            'color' => '#ec4899',
            'order' => 41,
        ]);
    }
}
