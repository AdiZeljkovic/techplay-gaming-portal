<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations - Add performance indexes to frequently queried tables.
     */
    public function up(): void
    {
        // Games table indexes
        DB::statement('CREATE INDEX IF NOT EXISTS games_slug_index ON games (slug)');
        DB::statement('CREATE INDEX IF NOT EXISTS games_metacritic_index ON games (metacritic)');
        DB::statement('CREATE INDEX IF NOT EXISTS games_released_index ON games (released)');
        DB::statement('CREATE INDEX IF NOT EXISTS games_rating_index ON games (rating)');

        // Comments table - polymorphic relationship optimization
        DB::statement('CREATE INDEX IF NOT EXISTS comments_commentable_index ON comments (commentable_type, commentable_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS comments_user_id_index ON comments (user_id)');

        // Notifications table
        DB::statement('CREATE INDEX IF NOT EXISTS notifications_notifiable_index ON notifications (notifiable_type, notifiable_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS notifications_read_at_index ON notifications (read_at)');

        // Friendships table
        DB::statement('CREATE INDEX IF NOT EXISTS friendships_status_index ON friendships (status)');
        DB::statement('CREATE INDEX IF NOT EXISTS friendships_sender_id_index ON friendships (sender_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS friendships_recipient_id_index ON friendships (recipient_id)');

        // Products table
        DB::statement('CREATE INDEX IF NOT EXISTS products_is_active_index ON products (is_active)');
        // DB::statement('CREATE INDEX IF NOT EXISTS products_category_id_index ON products (category_id)');

        // Threads/Forum table
        DB::statement('CREATE INDEX IF NOT EXISTS threads_forum_category_id_index ON threads (forum_category_id)');
        DB::statement('CREATE INDEX IF NOT EXISTS threads_user_id_index ON threads (user_id)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes (PostgreSQL syntax)
        DB::statement('DROP INDEX IF EXISTS games_slug_index');
        DB::statement('DROP INDEX IF EXISTS games_metacritic_index');
        DB::statement('DROP INDEX IF EXISTS games_released_index');
        DB::statement('DROP INDEX IF EXISTS games_rating_index');
        DB::statement('DROP INDEX IF EXISTS comments_commentable_index');
        DB::statement('DROP INDEX IF EXISTS comments_user_id_index');
        DB::statement('DROP INDEX IF EXISTS notifications_notifiable_index');
        DB::statement('DROP INDEX IF EXISTS notifications_read_at_index');
        DB::statement('DROP INDEX IF EXISTS friendships_status_index');
        DB::statement('DROP INDEX IF EXISTS friendships_sender_id_index');
        DB::statement('DROP INDEX IF EXISTS friendships_recipient_id_index');
        DB::statement('DROP INDEX IF EXISTS products_is_active_index');
        DB::statement('DROP INDEX IF EXISTS products_category_id_index');
        DB::statement('DROP INDEX IF EXISTS threads_forum_category_id_index');
        DB::statement('DROP INDEX IF EXISTS threads_user_id_index');
    }
};
