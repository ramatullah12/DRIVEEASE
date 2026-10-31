<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    /**
     * Menampilkan daftar armada kendaraan dengan filter
     */
    public function index(Request $request)
    {
        $query = Vehicle::with('category');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('license_plate', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category != 'all') {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('transmission') && $request->transmission != 'all') {
            $query->where('transmission', $request->transmission);
        }

        if ($request->has('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        $vehicles = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $vehicles
        ]);
    }

    /**
     * Tambah kendaraan baru (Admin only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'brand' => 'required|string|max:80',
            'model_type' => 'required|string|max:100',
            'category_id' => 'required|exists:vehicle_categories,id',
            'license_plate' => 'required|string|max:20|unique:vehicles',
            'year' => 'required|integer|min:2018|max:2026',
            'transmission' => 'required|in:automatic,manual',
            'passenger_capacity' => 'required|integer|min:2|max:16',
            'price_per_day' => 'required|numeric|min:100000',
            'fuel_type' => 'required|in:bensin,diesel,listrik,hybrid',
            'description' => 'required|string',
            'image_url' => 'required|url',
            'status' => 'required|in:available,rented,maintenance,reserved',
            'mileage' => 'required|integer|min:0',
        ]);

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kendaraan berhasil ditambahkan ke armada.',
            'data' => $vehicle
        ], 201);
    }

    /**
     * Detail kendaraan
     */
    public function show($id)
    {
        $vehicle = Vehicle::with('category')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $vehicle
        ]);
    }

    /**
     * Update kendaraan (Admin only)
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'brand' => 'sometimes|required|string|max:80',
            'model_type' => 'sometimes|required|string|max:100',
            'category_id' => 'sometimes|required|exists:vehicle_categories,id',
            'license_plate' => "sometimes|required|string|max:20|unique:vehicles,license_plate,{$id}",
            'year' => 'sometimes|required|integer|min:2018|max:2026',
            'transmission' => 'sometimes|required|in:automatic,manual',
            'passenger_capacity' => 'sometimes|required|integer|min:2|max:16',
            'price_per_day' => 'sometimes|required|numeric|min:100000',
            'fuel_type' => 'sometimes|required|in:bensin,diesel,listrik,hybrid',
            'description' => 'sometimes|required|string',
            'image_url' => 'sometimes|required|url',
            'status' => 'sometimes|required|in:available,rented,maintenance,reserved',
            'mileage' => 'sometimes|required|integer|min:0',
        ]);

        $vehicle->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kendaraan berhasil diperbarui.',
            'data' => $vehicle
        ]);
    }

    /**
     * Hapus kendaraan (Admin only)
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kendaraan berhasil dihapus dari sistem.'
        ]);
    }
}

