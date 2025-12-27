<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Using raw SQL to ensure idempotency (IF NOT EXISTS)
        // User requested author_id index, which is user_id in schema
        DB::statement('CREATE INDEX IF NOT EXISTS articles_status_index ON articles (status)');
        DB::statement('CREATE INDEX IF NOT EXISTS articles_user_id_index ON articles (user_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS articles_category_id_index ON articles (category_id)');
        // slug index likely exists (unique), so skipping or adding safely
        DB::statement('CREATE INDEX IF NOT EXISTS articles_slug_index ON articles (slug)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex('articles_status_index');
            $table->dropIndex('articles_user_id_index');
            $table->dropIndex('articles_category_id_index');
            // We don't drop slug index because it might have existed before
        });
    }
};
