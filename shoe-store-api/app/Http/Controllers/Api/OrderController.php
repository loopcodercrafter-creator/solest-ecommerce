<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Show logged-in user's orders
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    // Place a new order
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'country' => 'required|string|max:100',

            'payment_method' => 'required|in:cod,online',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.name' => 'required|string|max:255',
            'items.*.category' => 'nullable|string|max:100',
            'items.*.image' => 'nullable|string|max:2048',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1|max:100',
        ]);

        $subtotal = collect($data['items'])->sum(
            fn ($item) => (float) $item['price'] * (int) $item['quantity']
        );

        $shipping = $subtotal >= 3000 ? 0 : 100;
        $total = $subtotal + $shipping;

        $order = DB::transaction(function () use (
            $request, $data, $subtotal, $shipping, $total
        ) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'customer_name' => $data['customer_name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'city' => $data['city'],
                'state' => $data['state'],
                'pincode' => $data['pincode'],
                'country' => $data['country'],
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'status' => 'Processing',
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'shoe_id' => $item['id'],
                    'name' => $item['name'],
                    'category' => $item['category'] ?? null,
                    'image' => $item['image'] ?? null,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $order;
        });

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order->load('items'),
        ], 201);
    }

    // Cancel an order
    public function cancel(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if ($order->status !== 'Processing') {
            return response()->json([
                'message' => 'This order cannot be cancelled.',
            ], 422);
        }

        $order->update([
            'status' => 'Cancelled',
        ]);

        return response()->json([
            'message' => 'Order cancelled successfully.',
            'order' => $order->load('items'),
        ], 200);
    }
}
