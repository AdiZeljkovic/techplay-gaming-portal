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
        Schema::table('articles', function (Blueprint $table) {
            $table->timestamp('scheduled_at')->nullable()->after('published_at');
            $table->timestamp('submitted_at')->nullable()->after('scheduled_at');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('rejection_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['scheduled_at', 'submitted_at', 'reviewed_by', 'rejection_reason']);
        });
    }
};
