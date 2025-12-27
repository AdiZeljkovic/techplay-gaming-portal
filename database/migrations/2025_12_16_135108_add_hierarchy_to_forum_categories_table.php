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
        Schema::table('forum_categories', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('forum_categories')->nullOnDelete();
            $table->string('icon')->nullable()->after('description');
            $table->string('color')->nullable()->after('icon'); // Hex code for UI
            $table->boolean('is_section')->default(false)->after('parent_id'); // If true, it acts as a Section Header
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forum_categories', function (Blueprint $table) {
            //
        });
    }
};
