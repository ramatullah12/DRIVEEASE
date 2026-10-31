<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReturnController;

/*
|--------------------------------------------------------------------------
| DRIVEEASE - REST API ROUTES
| Powered by Laravel Sanctum & Role-Based Access Control
|--------------------------------------------------------------------------
*/

// ==============================
// PUBLIC ENDPOINTS (Tanpa Login)
// ==============================
Route::prefix('v1')->group(function () {
    // Autentikasi
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Katalog Kendaraan Publik
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
});

// ============================================
// PROTECTED ENDPOINTS (Wajib Token Sanctum)
// ============================================
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Profil Pengguna Aktif & Logout
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ------------------------------------
    // PORTAL CUSTOMER & GENERAL BOOKINGS
    // ------------------------------------
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']); // Dengan Pencegahan Booking Ganda
    Route::post('/payments', [PaymentController::class, 'store']); // Upload Bukti Bayar

    // ------------------------------------
    // OPERASIONAL PETUGAS RENTAL (Staff)
    // ------------------------------------
    Route::middleware('role:staff,admin')->group(function () {
        Route::post('/handover', [ReturnController::class, 'handover']); // Serah terima kunci
        Route::post('/returns', [ReturnController::class, 'returnCar']); // Cek fisik pengembalian
    });

    // ------------------------------------
    // ADMINISTRATOR SYSTEM (Admin Only)
    // ------------------------------------
    Route::middleware('role:admin')->group(function () {
        // Kelola Kendaraan
        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
        Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

        // Kelola Booking
        Route::put('/bookings/{id}/approve', [BookingController::class, 'approve']);
        Route::put('/bookings/{id}/reject', [BookingController::class, 'reject']);
        Route::put('/bookings/{id}/reschedule', [BookingController::class, 'reschedule']);

        // Verifikasi Pembayaran
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::put('/payments/{id}/verify', [PaymentController::class, 'verify']);
        Route::put('/payments/{id}/reject', [PaymentController::class, 'reject']);
    });
});

