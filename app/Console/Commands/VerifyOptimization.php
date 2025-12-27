<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class VerifyOptimization extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:optimization';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Verifying Optimization Logic...');

        // 1. Clear Cache
        \Illuminate\Support\Facades\Cache::forget(\App\Services\GlobalCacheService::KEY_LATEST);

        // 2. Create Article
        $this->info('Creating Test Article...');
        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        $article = \App\Models\Article::create([
            'user_id' => $user->id,
            'title' => 'Speed Test Article ' . now()->timestamp,
            'slug' => 'speed-test-' . now()->timestamp,
            'body' => 'Testing cache invalidation.',
            'status' => 'published',
            'published_at' => now(),
            'views' => 100, // Should trigger popular too
        ]);

        // 3. Check Cache
        if (\Illuminate\Support\Facades\Cache::has(\App\Services\GlobalCacheService::KEY_LATEST)) {
            $this->info('✅ Latest Articles Cache: REFRESHED');
        } else {
            $this->error('❌ Latest Articles Cache: NOT REFRESHED');
        }

        if (\Illuminate\Support\Facades\Cache::has(\App\Services\GlobalCacheService::KEY_POPULAR)) {
            $this->info('✅ Popular Articles Cache: REFRESHED');
        } else {
            $this->error('❌ Popular Articles Cache: NOT REFRESHED');
        }

        // Cleanup
        $article->delete();
        $this->info('Test Article Deleted.');
    }
}
