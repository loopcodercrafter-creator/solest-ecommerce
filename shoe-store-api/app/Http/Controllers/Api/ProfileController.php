<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\ProfileController;

class ProfileController extends Controller
{
    // Upload or update profile photo
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'profile_photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        // Delete old profile photo
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        // Save new photo
        $path = $request->file('profile_photo')
            ->store('profile-photos', 'public');

        $user->profile_photo = $path;
        $user->save();

        return response()->json([
            'message' => 'Profile photo updated successfully.',
            'profile_photo' => $path,
            'profile_photo_url' => asset('storage/' . $path),
            'user' => $user,
        ]);
    }

    // Remove profile photo
    public function deletePhoto(Request $request)
    {
        $user = $request->user();

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);

            $user->profile_photo = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Profile photo removed successfully.',
            'profile_photo' => null,
            'user' => $user,
        ]);
    }
}
