<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->index('status');
            $table->index('published_at');
            $table->index('slug');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index('reviewable_type');
            $table->index('reviewable_id');
        });

        Schema::table('threads', function (Blueprint $table) {
            $table->index('is_pinned');
            $table->index('is_locked');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['slug']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['reviewable_type']);
            $table->dropIndex(['reviewable_id']);
        });

        Schema::table('threads', function (Blueprint $table) {
            $table->dropIndex(['is_pinned']);
            $table->dropIndex(['is_locked']);
        });
    }
};
