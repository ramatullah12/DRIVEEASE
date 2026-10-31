<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Vehicle;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Daftar seluruh booking
     */
    public function index(Request $request)
    {
        $query = Booking::with(['customer.user', 'vehicle.category', 'payments']);

        // Jika customer, hanya tampilkan booking miliknya
        if ($request->user()->role === 'customer') {
            $query->whereHas('customer', function($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });
        }

        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search != '') {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('booking_code', 'like', "%{$s}%")
                  ->orWhereHas('customer.user', function($qu) use ($s) {
                      $qu->where('name', 'like', "%{$s}%");
                  });
            });
        }

        $bookings = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $bookings
        ]);
    }

    /**
     * Membuat reservasi sewa baru dengan PENCEGAHAN BOOKING GANDA
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
        ]);

        $vehicle = Vehicle::findOrFail($validated['vehicle_id']);
        $startDate = Carbon::parse($validated['start_date'])->toDateString();
        $endDate = Carbon::parse($validated['end_date'])->toDateString();

        // ====================================================================
        // ALGORITMA PENCEGAHAN BOOKING GANDA:
        // Memastikan tidak ada kendaraan yang dapat dipesan pada periode yang sama
        // ====================================================================
        $isOverlapping = Booking::where('vehicle_id', $vehicle->id)
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                      ->where('end_date', '>=', $startDate);
            })
            ->exists();

        if ($isOverlapping) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kendaraan ini telah dipesan oleh pelanggan lain pada rentang tanggal tersebut. Silakan pilih tanggal atau armada lain.'
            ], 422);
        }

        $totalDays = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) ?: 1;
        $dailyRate = $vehicle->price_per_day;
        $subtotal = $dailyRate * $totalDays;
        $downPayment = round($subtotal * 0.30); // 30% Uang Muka
        $deposit = 500000; // Refundable deposit
        $totalAmount = $subtotal + $deposit;

        $bookingCode = 'DRV-' . date('Ym') . '-' . rand(1000, 9999);

        // Ambil customer ID dari user aktif
        $customerId = $request->user()->customerProfile->id ?? 1;

        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'customer_id' => $customerId,
            'vehicle_id' => $vehicle->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_days' => $totalDays,
            'daily_rate' => $dailyRate,
            'subtotal' => $subtotal,
            'down_payment_required' => $downPayment,
            'deposit_amount' => $deposit,
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reservasi booking berhasil dibuat. Silakan lakukan pembayaran uang muka.',
            'data' => $booking->load(['vehicle', 'customer'])
        ], 201);
    }

    /**
     * Verifikasi & Setujui Booking (Admin only)
     */
    public function approve($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Booking {$booking->booking_code} berhasil disetujui.",
            'data' => $booking
        ]);
    }

    /**
     * Tolak Booking (Admin only)
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Booking {$booking->booking_code} telah ditolak.",
            'data' => $booking
        ]);
    }

    /**
     * Reschedule jadwal sewa
     */
    public function reschedule(Request $request, $id)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $booking = Booking::findOrFail($id);
        $newStart = Carbon::parse($request->start_date)->toDateString();
        $newEnd = Carbon::parse($request->end_date)->toDateString();

        // Cek bentrok jadwal (kecualikan booking ini sendiri)
        $isOverlapping = Booking::where('vehicle_id', $booking->vehicle_id)
            ->where('id', '!=', $booking->id)
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->where(function ($q) use ($newStart, $newEnd) {
                $q->where('start_date', '<=', $newEnd)
                  ->where('end_date', '>=', $newStart);
            })
            ->exists();

        if ($isOverlapping) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bentrok jadwal! Unit telah dipesan pada rentang tanggal baru tersebut.'
            ], 422);
        }

        $totalDays = Carbon::parse($newStart)->diffInDays(Carbon::parse($newEnd)) ?: 1;
        $subtotal = $booking->daily_rate * $totalDays;
        $totalAmount = $subtotal + $booking->deposit_amount;

        $booking->update([
            'start_date' => $newStart,
            'end_date' => $newEnd,
            'total_days' => $totalDays,
            'subtotal' => $subtotal,
            'total_amount' => $totalAmount,
            'notes' => $booking->notes . " • Jadwal diubah ke {$newStart} s/d {$newEnd}.",
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal rental berhasil disesuaikan.',
            'data' => $booking
        ]);
    }
}

