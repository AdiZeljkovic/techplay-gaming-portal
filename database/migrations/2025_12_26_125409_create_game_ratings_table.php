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
        Schema::create('game_ratings', function (Blueprint $table) {
            $table->id();
            $table->string('game_slug');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('rating')->comment('1-5 stars');
            $table->timestamps();

            // Each user can only rate a game once
            $table->unique(['game_slug', 'user_id']);
            $table->index('game_slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_ratings');
    }
};
