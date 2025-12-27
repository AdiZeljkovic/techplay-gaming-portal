<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add performance indexes for filtering and sorting
        // Using raw SQL for safety/idempotency
        \Illuminate\Support\Facades\DB::statement('CREATE INDEX IF NOT EXISTS articles_rating_index ON articles (rating)');
        \Illuminate\Support\Facades\DB::statement('CREATE INDEX IF NOT EXISTS articles_views_index ON articles (views)');
        \Illuminate\Support\Facades\DB::statement('CREATE INDEX IF NOT EXISTS articles_published_at_index ON articles (published_at)');
        \Illuminate\Support\Facades\DB::statement('CREATE INDEX IF NOT EXISTS articles_is_featured_index ON articles (is_featured)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement('DROP INDEX IF EXISTS articles_rating_index');
        \Illuminate\Support\Facades\DB::statement('DROP INDEX IF EXISTS articles_views_index');
        \Illuminate\Support\Facades\DB::statement('DROP INDEX IF EXISTS articles_published_at_index');
        \Illuminate\Support\Facades\DB::statement('DROP INDEX IF EXISTS articles_is_featured_index');
    }
};
