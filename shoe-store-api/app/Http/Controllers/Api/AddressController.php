<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    // Get all saved addresses
    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->latest()
            ->get();

        return response()->json([
            'addresses' => $addresses
        ]);
    }

    // Save a new address
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string|max:255',
            'landmark' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'type' => 'required|in:Home,Work,Other',
            'is_default' => 'sometimes|boolean',
        ]);

        $userId = $request->user()->id;

        $address = DB::transaction(function () use ($validated, $userId) {
            $makeDefault = $validated['is_default'] ?? false;

            if ($makeDefault) {
                Address::where('user_id', $userId)
                    ->update(['is_default' => false]);
            }

            $validated['user_id'] = $userId;

            if (Address::where('user_id', $userId)->count() === 0) {
                $validated['is_default'] = true;
            }

            return Address::create($validated);
        });

        return response()->json([
            'message' => 'Address saved successfully.',
            'address' => $address
        ], 201);
    }

    // Update an address
    public function update(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'address_line' => 'sometimes|required|string|max:255',
            'landmark' => 'nullable|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'pincode' => 'sometimes|required|string|max:10',
            'type' => 'sometimes|required|in:Home,Work,Other',
            'is_default' => 'sometimes|boolean',
        ]);

        DB::transaction(function () use ($address, $validated, $request) {
            if (($validated['is_default'] ?? false) === true) {
                Address::where('user_id', $request->user()->id)
                    ->update(['is_default' => false]);
            }

            $address->update($validated);
        });

        return response()->json([
            'message' => 'Address updated successfully.',
            'address' => $address->fresh()
        ]);
    }

    // Delete an address
    public function destroy(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $wasDefault = $address->is_default;
        $userId = $request->user()->id;

        DB::transaction(function () use ($address, $wasDefault, $userId) {
            $address->delete();

            if ($wasDefault) {
                $nextAddress = Address::where('user_id', $userId)
                    ->latest()
                    ->first();

                if ($nextAddress) {
                    $nextAddress->update(['is_default' => true]);
                }
            }
        });

        return response()->json([
            'message' => 'Address deleted successfully.'
        ]);
    }

    // Set default address
    public function setDefault(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->findOrFail($id);

        DB::transaction(function () use ($address, $request) {
            Address::where('user_id', $request->user()->id)
                ->update(['is_default' => false]);

            $address->update(['is_default' => true]);
        });

        return response()->json([
            'message' => 'Default address updated.',
            'address' => $address->fresh()
        ]);
    }
}
