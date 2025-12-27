<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get current user's orders.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::forUser($request->user()->id)
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    /**
     * Get single order details.
     */
    public function show(Request $request, Order $order): JsonResponse
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->load(['items.product']);

        return response()->json(['data' => $order]);
    }

    /**
     * Create a new order (checkout).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',

            // Shipping
            'shipping_name' => 'required|string|max:255',
            'shipping_email' => 'required|email',
            'shipping_phone' => 'nullable|string|max:50',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'nullable|string|max:100',
            'shipping_postal_code' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:100',

            // Optional billing
            'billing_name' => 'nullable|string|max:255',
            'billing_address' => 'nullable|string|max:500',
            'billing_city' => 'nullable|string|max:100',
            'billing_postal_code' => 'nullable|string|max:20',
            'billing_country' => 'nullable|string|max:100',

            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'nullable|string|in:cod,bank_transfer,stripe',
        ]);

        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                $price = $product->effective_price;
                $itemSubtotal = $price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemSubtotal,
                    'size' => $item['size'] ?? null,
                    'color' => $item['color'] ?? null,
                ];

                // Reduce stock
                $product->decrement('stock', $item['quantity']);
            }

            // Calculate shipping (flat rate for now)
            $shippingCost = 5.00; // TODO: Make configurable
            $tax = 0; // TODO: Calculate based on country
            $total = $subtotal + $shippingCost + $tax;

            // Create order
            $order = Order::create([
                'user_id' => $request->user()?->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'discount' => 0,
                'total' => $total,
                'shipping_name' => $validated['shipping_name'],
                'shipping_email' => $validated['shipping_email'],
                'shipping_phone' => $validated['shipping_phone'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_state' => $validated['shipping_state'] ?? null,
                'shipping_postal_code' => $validated['shipping_postal_code'],
                'shipping_country' => $validated['shipping_country'],
                'billing_name' => $validated['billing_name'] ?? null,
                'billing_address' => $validated['billing_address'] ?? null,
                'billing_city' => $validated['billing_city'] ?? null,
                'billing_postal_code' => $validated['billing_postal_code'] ?? null,
                'billing_country' => $validated['billing_country'] ?? null,
                'payment_method' => $validated['payment_method'] ?? 'cod',
                'payment_status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($itemsData as $itemData) {
                $order->items()->create($itemData);
            }

            DB::commit();

            $order->load('items');

            if ($request->user()) {
                $request->user()->notify(new \App\Notifications\OrderCreatedNotification($order));
            }

            return response()->json([
                'data' => $order,
                'message' => 'Order placed successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, Order $order): JsonResponse
    {
        // Ensure user can only cancel their own orders
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Can only cancel pending orders
        if ($order->status !== 'pending') {
            return response()->json([
                'error' => 'Only pending orders can be cancelled'
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Restore stock
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::where('id', $item->product_id)
                        ->increment('stock', $item->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);

            DB::commit();

            return response()->json([
                'data' => $order,
                'message' => 'Order cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
