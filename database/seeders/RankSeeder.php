<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rank;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranks = [
            ['level' => 1, 'name' => 'Novice', 'min_xp' => 0],
            ['level' => 2, 'name' => 'Apprentice', 'min_xp' => 100],
            ['level' => 3, 'name' => 'Explorer', 'min_xp' => 250],
            ['level' => 4, 'name' => 'Adventurer', 'min_xp' => 500],
            ['level' => 5, 'name' => 'Squire', 'min_xp' => 800],
            ['level' => 6, 'name' => 'Knight', 'min_xp' => 1200],
            ['level' => 7, 'name' => 'Veteran', 'min_xp' => 1700],
            ['level' => 8, 'name' => 'Elite', 'min_xp' => 2300],
            ['level' => 9, 'name' => 'Champion', 'min_xp' => 3000],
            ['level' => 10, 'name' => 'Hero', 'min_xp' => 4000],
            ['level' => 11, 'name' => 'Legend', 'min_xp' => 5500],
            ['level' => 12, 'name' => 'Mythic', 'min_xp' => 7500],
            ['level' => 13, 'name' => 'Guardian', 'min_xp' => 10000],
            ['level' => 14, 'name' => 'Warlord', 'min_xp' => 15000],
            ['level' => 15, 'name' => 'Titan', 'min_xp' => 22000],
            ['level' => 16, 'name' => 'Demigod', 'min_xp' => 35000],
            ['level' => 17, 'name' => 'Godlike', 'min_xp' => 50000],
            ['level' => 18, 'name' => 'Immortal', 'min_xp' => 75000],
            ['level' => 19, 'name' => 'Ascended', 'min_xp' => 100000],
            ['level' => 20, 'name' => 'The One', 'min_xp' => 150000],
        ];

        foreach ($ranks as $rank) {
            Rank::updateOrCreate(
                ['level' => $rank['level']],
                ['name' => $rank['name'], 'min_xp' => $rank['min_xp']]
            );
        }
    }
}
