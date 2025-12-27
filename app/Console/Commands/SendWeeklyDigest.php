<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendWeeklyDigest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:send-weekly-digest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send weekly digest of latest articles to newsletter subscribers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Finding articles from the last week...');
        // Placeholder logic: Fetch articles
        // $articles = \App\Models\Article::where('published_at', '>=', now()->subWeek())->get();

        $this->info('Creating Mailchimp campaign...');
        // Placeholder: \Spatie\Newsletter\Facades\Newsletter::createCampaign(...)

        $this->info('Weekly digest sent successfully!');
    }
}
