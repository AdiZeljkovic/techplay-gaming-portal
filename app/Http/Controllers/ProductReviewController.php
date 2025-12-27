<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductReviewController extends Controller
{
    /**
     * Get reviews for a specific product.
     */
    public function index(int $productId): JsonResponse
    {
        $reviews = ProductReview::where('product_id', $productId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Calculate aggregate stats
        $stats = ProductReview::where('product_id', $productId)
            ->selectRaw('COUNT(*) as count, AVG(rating) as average')
            ->first();

        return response()->json([
            'data' => $reviews->items(),
            'stats' => [
                'count' => (int) $stats->count,
                'average' => round((float) $stats->average, 1),
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'total' => $reviews->total(),
            ]
        ]);
    }

    /**
     * Store a new review for a product.
     */
    public function store(Request $request, int $productId): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if product exists
        $product = Product::findOrFail($productId);

        // Check if user already reviewed this product
        $existing = ProductReview::where('product_id', $productId)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            // Update existing review
            $existing->update($validated);
            $review = $existing->fresh()->load('user');
            $message = 'Review updated successfully';
        } else {
            // Create new review
            $review = ProductReview::create([
                'product_id' => $productId,
                'user_id' => $request->user()->id,
                ...$validated,
            ]);
            $review->load('user');
            $message = 'Review submitted successfully';
        }

        // Note: Product rating/reviews_count columns don't exist - stats calculated on-the-fly

        return response()->json([
            'data' => $review,
            'message' => $message,
        ], $existing ? 200 : 201);
    }

    /**
     * Delete a review.
     */
    public function destroy(Request $request, int $productId, int $reviewId): JsonResponse
    {
        $review = ProductReview::where('id', $reviewId)
            ->where('product_id', $productId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $review->delete();

        // Update product average rating
        // $this->updateProductRating($productId);  // Disabled - columns don't exist in products table

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
