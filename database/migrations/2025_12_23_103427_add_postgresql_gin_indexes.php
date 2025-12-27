<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     * PostgreSQL-specific GIN indexes for full-text search and additional performance indexes.
     */
    public function up(): void
    {
        // Only run on PostgreSQL
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        // GIN index for full-text search on articles (title + body)
        DB::statement('CREATE INDEX IF NOT EXISTS articles_fulltext_idx ON articles USING GIN (to_tsvector(\'english\', title || \' \' || COALESCE(body, \'\')))');

        // GIN index for full-text search on games (name + description)
        DB::statement('CREATE INDEX IF NOT EXISTS games_fulltext_idx ON games USING GIN (to_tsvector(\'english\', name || \' \' || COALESCE(description, \'\')))');

        // Additional performance indexes
        Schema::table('users', function (Blueprint $table) {
            $table->index('email');
        });

        Schema::table('games', function (Blueprint $table) {
            $table->index('slug');
            $table->index('released');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('slug');
            $table->index('is_active');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });

        Schema::table('comments', function (Blueprint $table) {
            // commentable_type + commentable_id index already exists from original migration
            $table->index('is_approved');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->index('thread_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('DROP INDEX IF EXISTS articles_fulltext_idx');
        DB::statement('DROP INDEX IF EXISTS games_fulltext_idx');

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email']);
        });

        Schema::table('games', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['released']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropIndex(['is_approved']);
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['thread_id']);
        });
    }
};
