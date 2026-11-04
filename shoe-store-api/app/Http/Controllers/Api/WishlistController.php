<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // Get logged-in user's wishlist
    public function index(Request $request)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'wishlist' => $wishlist,
        ]);
    }

    // Add product to wishlist
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:2000',
        ]);

        $wishlist = Wishlist::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $validated['product_id'],
            ],
            [
                'name' => $validated['name'],
                'category' => $validated['category'] ?? null,
                'price' => $validated['price'],
                'image' => $validated['image'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Product added to wishlist.',
            'wishlist' => $wishlist,
        ], 201);
    }

    // Remove product from wishlist
    public function destroy(Request $request, $productId)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'message' => 'Product not found in wishlist.',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'message' => 'Product removed from wishlist.',
        ]);
    }
}
