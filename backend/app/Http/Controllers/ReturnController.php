<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\VehicleHandover;
use App\Models\VehicleReturn;
use Carbon\Carbon;

class ReturnController extends Controller
{
    /**
     * Serah terima kendaraan (Handover) oleh Petugas
     */
    public function handover(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id|unique:vehicle_handover,booking_id',
            'start_mileage' => 'required|integer|min:0',
            'fuel_level' => 'required|integer|min:0|max:100',
            'body_clean' => 'required|boolean',
            'interior_clean' => 'required|boolean',
            'tires_condition' => 'required|boolean',
            'spare_tire' => 'required|boolean',
            'tools_complete' => 'required|boolean',
            'stnk_present' => 'required|boolean',
            'condition_notes' => 'nullable|string',
            'photo_url' => 'nullable|url',
        ]);

        $booking = Booking::with('vehicle')->findOrFail($validated['booking_id']);

        $handover = VehicleHandover::create([
            'booking_id' => $booking->id,
            'staff_id' => auth()->id() ?? 2,
            'handover_date' => now(),
            'start_mileage' => $validated['start_mileage'],
            'fuel_level' => $validated['fuel_level'],
            'body_clean' => $validated['body_clean'],
            'interior_clean' => $validated['interior_clean'],
            'tires_condition' => $validated['tires_condition'],
            'spare_tire' => $validated['spare_tire'],
            'tools_complete' => $validated['tools_complete'],
            'stnk_present' => $validated['stnk_present'],
            'condition_notes' => $validated['condition_notes'] ?? null,
            'photo_url' => $validated['photo_url'] ?? null,
        ]);

        // Update status booking ke 'ongoing' dan armada ke 'rented'
        $booking->update(['status' => 'ongoing']);
        $booking->vehicle->update([
            'status' => 'rented',
            'mileage' => $validated['start_mileage'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Serah terima kunci selesai. Status booking kini sedang berjalan.',
            'data' => $handover
        ], 201);
    }

    /**
     * Pengembalian & Inspeksi Kendaraan (Return) oleh Petugas / Admin
     */
    public function returnCar(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id|unique:vehicle_returns,booking_id',
            'end_mileage' => 'required|integer|min:0',
            'fuel_level' => 'required|integer|min:0|max:100',
            'late_hours' => 'nullable|integer|min:0',
            'damage_fee' => 'nullable|numeric|min:0',
            'damage_notes' => 'nullable|string',
            'photo_url' => 'nullable|url',
            'status' => 'required|in:inspected,settled,needs_maintenance',
        ]);

        $booking = Booking::with('vehicle')->findOrFail($validated['booking_id']);
        $scheduledReturn = Carbon::parse($booking->end_date . ' 12:00:00');
        $actualReturn = now();

        $lateHours = $validated['late_hours'] ?? max(0, $actualReturn->diffInHours($scheduledReturn, false) * -1);
        $lateFee = $lateHours * 50000; // Rp 50.000 / jam denda telat
        $fuelCharge = ($validated['fuel_level'] < 90) ? 50000 : 0;
        $damageFee = $validated['damage_fee'] ?? 0;
        $totalPenalty = $lateFee + $fuelCharge + $damageFee;

        $returnRecord = VehicleReturn::create([
            'booking_id' => $booking->id,
            'staff_id' => auth()->id() ?? 2,
            'scheduled_return_date' => $scheduledReturn,
            'actual_return_date' => $actualReturn,
            'end_mileage' => $validated['end_mileage'],
            'fuel_level' => $validated['fuel_level'],
            'late_hours' => $lateHours,
            'late_fee' => $lateFee,
            'fuel_charge' => $fuelCharge,
            'damage_fee' => $damageFee,
            'total_penalty' => $totalPenalty,
            'damage_notes' => $validated['damage_notes'] ?? null,
            'status' => $validated['status'],
            'photo_url' => $validated['photo_url'] ?? null,
        ]);

        // Selesaikan booking
        $booking->update(['status' => 'completed']);

        // Sinkronisasi status armada
        if ($validated['status'] === 'needs_maintenance') {
            $booking->vehicle->update([
                'status' => 'maintenance',
                'mileage' => $validated['end_mileage'],
            ]);
        } else {
            $booking->vehicle->update([
                'status' => 'available',
                'mileage' => $validated['end_mileage'],
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pencatatan pengembalian unit berhasil diproses.',
            'data' => $returnRecord
        ], 201);
    }
}

