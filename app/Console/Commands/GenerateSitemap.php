<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Product;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.xml file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        $sitemap = Sitemap::create();

        // Static pages
        $sitemap->add(Url::create('/')->setPriority(1.0)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));
        $sitemap->add(Url::create('/about')->setPriority(0.8)->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY));
        $sitemap->add(Url::create('/shop')->setPriority(0.9)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));
        $sitemap->add(Url::create('/forum')->setPriority(0.9)->setChangeFrequency(Url::CHANGE_FREQUENCY_HOURLY));
        $sitemap->add(Url::create('/reviews')->setPriority(0.9)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));

        // Articles
        Article::where('status', 'published')
            ->each(function (Article $article) use ($sitemap) {
                $sitemap->add(
                    Url::create("/articles/{$article->slug}")
                        ->setLastModificationDate($article->updated_at)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setPriority(0.8)
                );
            });

        // Products
        Product::all()->each(function (Product $product) use ($sitemap) {
            $sitemap->add(
                Url::create("/shop/{$product->slug}")
                    ->setLastModificationDate($product->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.8)
            );
        });

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully!');
    }
}
