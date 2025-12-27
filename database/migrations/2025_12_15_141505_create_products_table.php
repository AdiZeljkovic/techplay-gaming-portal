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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->string('sku')->unique()->nullable();
            $table->integer('stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->string('category')->nullable(); // e.g., 'apparel', 'accessories', 'collectibles'
            $table->string('subcategory')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Array of additional images
            $table->json('sizes')->nullable(); // ['S', 'M', 'L', 'XL']
            $table->json('colors')->nullable(); // ['Black', 'White']
            $table->json('attributes')->nullable(); // Any additional attributes
            $table->decimal('weight', 8, 2)->nullable(); // For shipping
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category', 'is_active']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
