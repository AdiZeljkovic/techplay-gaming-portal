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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rawg_id')->index();
            $table->string('slug')->unique();
            $table->string('name');
            $table->date('released')->nullable();
            $table->string('background_image')->nullable();
            $table->decimal('rating', 3, 2)->nullable(); // e.g. 4.50
            $table->integer('rating_top')->nullable();
            $table->integer('metacritic')->nullable();
            $table->integer('playtime')->nullable();
            $table->text('description')->nullable(); // RAWG descriptions can be long
            $table->string('esrb_rating')->nullable();

            // JSON columns for complex data
            $table->json('genres')->nullable();
            $table->json('platforms')->nullable();
            $table->json('stores')->nullable();
            $table->json('tags')->nullable();

            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
