<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class AuthController extends Controller
{
    // 1. Register customer
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'mobile' => 'required|string|max:20|unique:users,mobile',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Please check your details.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim($request->email));

        $user = User::create([
            'name' => $request->name,
            'email' => $email,
            'mobile' => $request->mobile,
            'password' => Hash::make(Str::random(40)),
        ]);

        return response()->json([
            'message' => 'Registration successful. You can now log in with OTP.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'mobile' => $user->mobile,
            ],
        ], 201);
    }

    // 2. Generate OTP; no SMTP required for local development
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Enter a valid email address.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim($request->email));

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Account not found. Please register first.',
            ], 404);
        }

        $record = DB::table('login_otps')
            ->where('email', $email)
            ->first();

        // Enforce a 30-second resend cooldown on the server
        if ($record && $record->last_sent_at) {
            $lastSentTimestamp = Carbon::parse(
                $record->last_sent_at
            )->timestamp;

            $elapsed = now()->timestamp - $lastSentTimestamp;

            if ($elapsed < 30) {
                $remaining = 30 - max(0, $elapsed);

                return response()->json([
                    'message' => "Please wait {$remaining} seconds before requesting another OTP.",
                    'retry_after' => $remaining,
                ], 429);
            }
        }

        $otp = (string) random_int(100000, 999999);

        DB::table('login_otps')->updateOrInsert(
            ['email' => $email],
            [
                'otp_hash' => Hash::make($otp),
                'expires_at' => now()->addMinutes(10),
                'last_sent_at' => now(),
                'attempts' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Local testing only: OTP appears in Laravel's log file
        Log::info('Shoe Store OTP generated', [
            'email' => $email,
            'otp' => $otp,
        ]);

        return response()->json([
            'message' => 'OTP generated. Check the Laravel log file.',
            'expires_in' => 600,
            'retry_after' => 30,
        ]);
    }

    // 3. Verify OTP and create login token
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Enter your email and six-digit OTP.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = strtolower(trim($request->email));

        $record = DB::table('login_otps')
            ->where('email', $email)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'OTP not found. Please request a new OTP.',
            ], 422);
        }

        if (now()->greaterThanOrEqualTo(
            Carbon::parse($record->expires_at)
        )) {
            DB::table('login_otps')->where('email', $email)->delete();

            return response()->json([
                'message' => 'OTP expired. Please request a new one.',
            ], 422);
        }

        if ($record->attempts >= 5) {
            DB::table('login_otps')->where('email', $email)->delete();

            return response()->json([
                'message' => 'Too many attempts. Please request a new OTP.',
            ], 429);
        }

        if (!Hash::check($request->otp, $record->otp_hash)) {
            $attempts = $record->attempts + 1;

            if ($attempts >= 5) {
                DB::table('login_otps')->where('email', $email)->delete();

                return response()->json([
                    'message' => 'Too many incorrect attempts. Please request a new OTP.',
                ], 429);
            }

            DB::table('login_otps')
                ->where('email', $email)
                ->update([
                    'attempts' => $attempts,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'message' => 'Incorrect OTP. Please try again.',
                'attempts_remaining' => 5 - $attempts,
            ], 422);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            DB::table('login_otps')->where('email', $email)->delete();

            return response()->json([
                'message' => 'Account not found.',
            ], 404);
        }

        DB::table('login_otps')->where('email', $email)->delete();

        $token = $user->createToken('shoe-store-web')->plainTextToken;

       return response()->json([
    'message' => 'Login successful.',
    'token' => $token,
    'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'mobile' => $user->mobile,
        'profile_photo' => $user->profile_photo,
        'profile_photo_url' => $user->profile_photo
            ? asset('storage/' . $user->profile_photo)
            : null,
    ],
]);
    }

    // 4. Get logged-in customer's profile
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'profile_photo' => $user->profile_photo,
                'profile_photo_url' => $user->profile_photo
                   ? asset('storage/' . $user->profile_photo)
                  : null,
            ],
        ]);
    }

    // 5. Logout current token
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
