<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            // --- SOCIAL ---
            [
                'name' => 'First Hello',
                'description' => 'Post your first comment in the community.',
                'icon' => 'MessageCircle', // Lucide icon name
                'criteria_type' => 'comments_count',
                'criteria_value' => 1,
                'xp' => 50,
            ],
            [
                'name' => 'Chatterbox',
                'description' => 'Post 50 comments.',
                'icon' => 'MessageSquare',
                'criteria_type' => 'comments_count',
                'criteria_value' => 50,
                'xp' => 200,
            ],
            [
                'name' => 'Social Butterfly',
                'description' => 'Add 5 friends.',
                'icon' => 'Users',
                'criteria_type' => 'friends_count',
                'criteria_value' => 5,
                'xp' => 150,
            ],
            [
                'name' => 'Squad Leader',
                'description' => 'Add 20 friends.',
                'icon' => 'Crown',
                'criteria_type' => 'friends_count',
                'criteria_value' => 20,
                'xp' => 500,
            ],

            // --- CONTENT (Reviews) ---
            [
                'name' => 'The Critic',
                'description' => 'Write your first game review.',
                'icon' => 'PenTool',
                'criteria_type' => 'reviews_count',
                'criteria_value' => 1,
                'xp' => 100,
            ],
            [
                'name' => 'Respected Voice',
                'description' => 'Write 10 game reviews.',
                'icon' => 'Feather',
                'criteria_type' => 'reviews_count',
                'criteria_value' => 10,
                'xp' => 1000,
            ],
            [
                'name' => 'Trendsetter',
                'description' => 'Receive 50 likes on your reviews.',
                'icon' => 'Heart',
                'criteria_type' => 'review_likes',
                'criteria_value' => 50,
                'xp' => 300,
            ],

            // --- PROGRESSION (Rank/XP) ---
            [
                'name' => 'Getting Started',
                'description' => 'Reach Level 2.',
                'icon' => 'Zap',
                'criteria_type' => 'level_reach',
                'criteria_value' => 2,
                'xp' => 50,
            ],
            [
                'name' => 'Rising Star',
                'description' => 'Reach Level 5.',
                'icon' => 'Star',
                'criteria_type' => 'level_reach',
                'criteria_value' => 5,
                'xp' => 250,
            ],
            [
                'name' => 'Veteran',
                'description' => 'Reach Level 10.',
                'icon' => 'Shield',
                'criteria_type' => 'level_reach',
                'criteria_value' => 10,
                'xp' => 1000,
            ],
            [
                'name' => 'Elite',
                'description' => 'Reach Level 25.',
                'icon' => 'Trophy',
                'criteria_type' => 'level_reach',
                'criteria_value' => 25,
                'xp' => 5000,
            ],

            // --- PROFILE & IDENTITY ---
            [
                'name' => 'Identity Revealed',
                'description' => 'Complete your profile bio and avatar.',
                'icon' => 'UserCheck',
                'criteria_type' => 'profile_complete',
                'criteria_value' => 1,
                'xp' => 100,
            ],
            [
                'name' => 'Rig Flex',
                'description' => 'Fill out your PC specs.',
                'icon' => 'Cpu',
                'criteria_type' => 'specs_complete',
                'criteria_value' => 1,
                'xp' => 100,
            ],
            [
                'name' => 'Cross-Platform',
                'description' => 'Link at least one external account (Steam/Xbox/Discord).',
                'icon' => 'Link2',
                'criteria_type' => 'account_linked',
                'criteria_value' => 1,
                'xp' => 150,
            ],

            // --- SHOPPING (Orders) ---
            [
                'name' => 'Supporter',
                'description' => 'Make your first purchase in the shop.',
                'icon' => 'ShoppingBag',
                'criteria_type' => 'orders_count',
                'criteria_value' => 1,
                'xp' => 200,
            ],
            [
                'name' => 'Collector',
                'description' => 'Make 5 purchases.',
                'icon' => 'Package',
                'criteria_type' => 'orders_count',
                'criteria_value' => 5,
                'xp' => 800,
            ],

            // --- FORUM/THREADS ---
            [
                'name' => 'Discussion Starter',
                'description' => 'Create a forum thread.',
                'icon' => 'Megaphone',
                'criteria_type' => 'threads_count',
                'criteria_value' => 1,
                'xp' => 100,
            ],
            [
                'name' => 'Debater',
                'description' => 'Create 10 forum threads.',
                'icon' => 'Mic',
                'criteria_type' => 'threads_count',
                'criteria_value' => 10,
                'xp' => 500,
            ],

            // --- MISC ---
            [
                'name' => 'Early Adopter',
                'description' => 'Join the platform during the beta (First 100 users).',
                'icon' => 'Rocket',
                'criteria_type' => 'user_id_below',
                'criteria_value' => 100,
                'xp' => 500,
            ],
            [
                'name' => 'Information Sponge',
                'description' => 'Reads 50 Articles',
                'icon' => 'BookOpen',
                'criteria_type' => 'articles_read',
                'criteria_value' => 50,
                'xp' => 300,
            ],
        ];

        foreach ($achievements as $ach) {
            Achievement::firstOrCreate(
                ['name' => $ach['name']],
                $ach
            );
        }
    }
}
