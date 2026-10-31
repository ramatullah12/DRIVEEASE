<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Customer;

class AuthController extends Controller
{
    /**
     * Register customer baru
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|string|email|max:150|unique:users',
            'phone' => 'required|string|max:25',
            'password' => 'required|string|min:8',
            'nik' => 'nullable|string|max:20|unique:customers',
            'sim_number' => 'nullable|string|max:30',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => 'customer',
            'password' => Hash::make($validated['password']),
        ]);

        // Buat profil customer
        Customer::create([
            'user_id' => $user->id,
            'nik' => $validated['nik'] ?? '317' . rand(1000000000000, 9999999999999),
            'sim_number' => $validated['sim_number'] ?? 'SIM-' . rand(10000000, 99999999),
            'address' => $validated['address'] ?? '-',
            'phone' => $validated['phone'],
            'verified_status' => 'pending',
        ]);

        $token = $user->createToken('driveease_auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi akun pelanggan berhasil.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }

    /**
     * Login kredensial & penerbitan token Sanctum
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kombinasi email dan kata sandi tidak cocok.'],
            ]);
        }

        // Hapus token lama untuk keamanan sesi tunggal jika diperlukan
        $user->tokens()->delete();

        $token = $user->createToken('driveease_auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Profil pengguna aktif
     */
    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()->load('customerProfile')
        ]);
    }

    /**
     * Logout & pencabutan token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sesi berhasil diakhiri.'
        ]);
    }
}

