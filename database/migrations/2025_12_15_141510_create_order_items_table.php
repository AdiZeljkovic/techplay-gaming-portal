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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name'); // Snapshot of name at time of order
            $table->string('product_sku')->nullable();
            $table->decimal('price', 10, 2); // Price at time of order
            $table->integer('quantity')->default(1);
            $table->decimal('subtotal', 10, 2); // price * quantity
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->json('options')->nullable(); // Any other selected options
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
