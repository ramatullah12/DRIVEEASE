<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Booking;

class PaymentController extends Controller
{
    /**
     * Daftar transaksi pembayaran
     */
    public function index(Request $request)
    {
        $query = Payment::with('booking.customer.user');

        if ($request->has('status') && $request->status != 'all') {
            $query->where('payment_status', $request->status);
        }

        if ($request->has('type') && $request->type != 'all') {
            $query->where('payment_type', $request->type);
        }

        $payments = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $payments
        ]);
    }

    /**
     * Upload bukti pembayaran / Catat pembayaran baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:10000',
            'payment_type' => 'required|in:down_payment,settlement,full_payment,penalty',
            'payment_method' => 'required|in:bank_transfer,qris,credit_card,cash',
            'bank_name' => 'nullable|string|max:100',
            'proof_url' => 'nullable|url',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);
        $transactionRef = 'TRX-' . strtoupper(substr($validated['payment_method'], 0, 3)) . '-' . rand(100000, 999999);

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'transaction_ref' => $transactionRef,
            'amount' => $validated['amount'],
            'payment_type' => $validated['payment_type'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'bank_name' => $validated['bank_name'] ?? 'Bank Transfer',
            'proof_url' => $validated['proof_url'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bukti pembayaran berhasil diunggah dan sedang diverifikasi admin.',
            'data' => $payment
        ], 201);
    }

    /**
     * Verifikasi & Sahkan pembayaran (Admin only)
     */
    public function verify($id)
    {
        $payment = Payment::with('booking')->findOrFail($id);

        $payment->update([
            'payment_status' => 'verified',
            'verified_at' => now(),
            'verified_by' => auth()->user()->name ?? 'Administrator',
        ]);

        // Perbarui status pembayaran pada booking
        $booking = $payment->booking;
        if ($payment->payment_type === 'down_payment') {
            $booking->update(['payment_status' => 'partial']);
        } elseif ($payment->payment_type === 'settlement' || $payment->payment_type === 'full_payment') {
            $booking->update(['payment_status' => 'paid']);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pembayaran telah disahkan.',
            'data' => $payment
        ]);
    }

    /**
     * Tolak bukti pembayaran (Admin only)
     */
    public function reject($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'payment_status' => 'rejected',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bukti pembayaran ditolak.'
        ]);
    }
}

