<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Get all active products with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'products_index_' . md5(json_encode($request->all()));

        $result = \Illuminate\Support\Facades\Cache::remember($cacheKey, 60 * 5, function () use ($request) {
            $query = Product::query()->active();

            // Category filter
            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            // Subcategory filter
            if ($request->has('subcategory')) {
                $query->where('subcategory', $request->subcategory);
            }

            // Featured filter
            if ($request->boolean('featured')) {
                $query->featured();
            }

            // In stock filter
            if ($request->boolean('in_stock')) {
                $query->where('stock', '>', 0);
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Price range
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Sorting
            $sortBy = $request->get('sort', 'sort_order');
            $sortDir = $request->get('direction', 'asc');
            $query->orderBy($sortBy, $sortDir);

            // Pagination
            $perPage = $request->get('per_page', 12);
            $products = $query->paginate($perPage);

            return [
                'data' => $products->items(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
                'links' => [
                    'next' => $products->nextPageUrl(),
                    'prev' => $products->previousPageUrl(),
                ]
            ];
        });

        return response()->json($result);
    }

    /**
     * Get featured products.
     */
    public function featured(): JsonResponse
    {
        $products = \Illuminate\Support\Facades\Cache::remember('products_featured', 60 * 15, function () {
            return Product::active()
                ->featured()
                ->orderBy('sort_order')
                ->limit(8)
                ->get();
        });

        return response()->json(['data' => $products]);
    }

    /**
     * Get single product by ID or slug.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $product = \Illuminate\Support\Facades\Cache::remember("product_{$idOrSlug}", 60 * 30, function () use ($idOrSlug) {
            return Product::where('id', $idOrSlug)
                ->orWhere('slug', $idOrSlug)
                ->active()
                ->firstOrFail();
        });

        return response()->json(['data' => $product]);
    }

    /**
     * Get product categories.
     */
    public function categories(): JsonResponse
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('product_categories', 60 * 60, function () {
            return Product::active()
                ->select('category')
                ->distinct()
                ->whereNotNull('category')
                ->pluck('category');
        });

        return response()->json(['data' => $categories]);
    }

    /**
     * Store a new product (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|unique:products,sku',
            'stock' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'category' => 'nullable|string',
            'subcategory' => 'nullable|string',
            'image' => 'nullable|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
        ]);

        $product = Product::create($validated);

        return response()->json(['data' => $product], 201);
    }

    /**
     * Update a product (Admin only).
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'stock' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'category' => 'nullable|string',
            'subcategory' => 'nullable|string',
            'image' => 'nullable|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
        ]);

        $product->update($validated);

        return response()->json(['data' => $product]);
    }

    /**
     * Delete a product (Admin only).
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
