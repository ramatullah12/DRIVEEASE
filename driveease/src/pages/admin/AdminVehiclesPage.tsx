import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Car,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Fuel,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import type { Vehicle, VehicleStatus, TransmissionType, FuelType } from '../../types';
import { formatCurrency, getStatusBadge } from '../../utils/format';
import {
  getStoredVehicles,
  addVehicleToStore,
  updateVehicleInStore,
  deleteVehicleFromStore,
} from '../../services/vehicleStorage';
import { MOCK_CATEGORIES } from '../../services/mockData';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model_type: '',
    category_id: 2,
    category_name: 'SUV',
    license_plate: '',
    year: 2024,
    transmission: 'automatic' as TransmissionType,
    passenger_capacity: 7,
    price_per_day: 750000,
    fuel_type: 'bensin' as FuelType,
    status: 'available' as VehicleStatus,
    mileage: 15000,
    description: '',
    image_url: '',
  });

  // Load from store
  useEffect(() => {
    setVehicles(getStoredVehicles());
  }, []);

  // Filtered List
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchPlate = v.license_plate.toLowerCase().includes(q);
        const matchBrand = v.brand.toLowerCase().includes(q);
        if (!matchName && !matchPlate && !matchBrand) return false;
      }
      if (selectedCategory !== 'all') {
        const cat = MOCK_CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat && v.category_id !== cat.id) return false;
      }
      if (selectedStatus !== 'all') {
        if (v.status !== selectedStatus) return false;
      }
      return true;
    });
  }, [vehicles, searchQuery, selectedCategory, selectedStatus]);

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      brand: 'Toyota',
      model_type: '',
      category_id: 2,
      category_name: 'SUV',
      license_plate: '',
      year: 2024,
      transmission: 'automatic',
      passenger_capacity: 7,
      price_per_day: 700000,
      fuel_type: 'bensin',
      status: 'available',
      mileage: 12000,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      brand: vehicle.brand,
      model_type: vehicle.model_type,
      category_id: Number(vehicle.category_id),
      category_name: vehicle.category_name || 'SUV',
      license_plate: vehicle.license_plate,
      year: vehicle.year,
      transmission: vehicle.transmission,
      passenger_capacity: vehicle.passenger_capacity,
      price_per_day: vehicle.price_per_day,
      fuel_type: vehicle.fuel_type,
      status: vehicle.status,
      mileage: vehicle.mileage,
      description: vehicle.description,
      image_url: vehicle.image_url,
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = MOCK_CATEGORIES.find((c) => Number(c.id) === Number(formData.category_id));
    const catName = cat ? cat.name : 'Mobil';

    if (editingVehicle) {
      const updated = updateVehicleInStore(editingVehicle.id, {
        ...formData,
        category_name: catName,
      });
      setVehicles(updated);
    } else {
      addVehicleToStore({
        ...formData,
        category_name: catName,
      });
      setVehicles(getStoredVehicles());
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingVehicle) return;
    const updated = deleteVehicleFromStore(deletingVehicle.id);
    setVehicles(updated);
    setDeletingVehicle(null);
  };

  return (
    <AdminLayout pageTitle="Manajemen Armada Kendaraan">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Data Armada Kendaraan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola inventaris armada, spesifikasi teknis, tarif sewa harian, dan ketersediaan unit
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Kendaraan Baru
        </button>
      </div>

      {/* 2. Filter & Search Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, plat nomor, atau tipe kendaraan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kategori</option>
            {MOCK_CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status Ketersediaan</option>
            <option value="available">Tersedia (Siap Sewa)</option>
            <option value="rented">Sedang Disewa</option>
            <option value="maintenance">Perawatan / Servis</option>
          </select>
        </div>

        {/* Reset button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            title="Reset Filter"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 3. Vehicles Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Mobil & Foto</th>
                <th className="py-3.5 px-6">Kategori & Plat</th>
                <th className="py-3.5 px-6">Spesifikasi</th>
                <th className="py-3.5 px-6">Harga / Hari</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => {
                  const statusInfo = getStatusBadge(vehicle.status);

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50/50 transition">
                      {/* Name & Photo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.image_url}
                            alt={vehicle.name}
                            className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">{vehicle.name}</span>
                            <span className="text-slate-400 font-medium">{vehicle.brand} • {vehicle.model_type} ({vehicle.year})</span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Plate */}
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 block w-max mb-1">
                          {vehicle.category_name}
                        </span>
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {vehicle.license_plate}
                        </span>
                      </td>

                      {/* Specs */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5 text-slate-600">
                          <span className="flex items-center gap-1">
                            <span className="capitalize font-semibold">{vehicle.transmission}</span> • {vehicle.passenger_capacity} Kursi
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 capitalize">
                            <Fuel className="w-3 h-3" /> {vehicle.fuel_type} • {vehicle.mileage.toLocaleString()} KM
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-blue-600 block">
                          {formatCurrency(vehicle.price_per_day)}
                        </span>
                        <span className="text-[10px] text-slate-400">per hari sewa</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(vehicle)}
                            title="Edit Kendaraan"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingVehicle(vehicle)}
                            title="Hapus Kendaraan"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada kendaraan yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Stats */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>Menampilkan <strong>{filteredVehicles.length}</strong> dari {vehicles.length} total armada</span>
          <span className="font-semibold text-emerald-600">Database Inventaris Siap Operasional</span>
        </div>
      </div>

      {/* 4. Modal Form Tambah / Edit Kendaraan */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">
                  {editingVehicle ? 'Edit Data Kendaraan Armada' : 'Tambah Unit Kendaraan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Photo Preview & URL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-36 h-24 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="block font-bold text-slate-700 uppercase">
                    URL Foto / Gambar Kendaraan *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">Masukkan tautan foto eksterior mobil yang jelas & beresolusi tinggi.</p>
                </div>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nama Kendaraan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toyota Fortuner GR Sport"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Merek (Brand) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Toyota, Honda, Mitsubishi"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tipe / Varian Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2.8 VRZ AT 4x4"
                    value={formData.model_type}
                    onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Polisi (Plat) *</label>
                  <input
                    type="text"
                    required
                    placeholder="B 1234 ABC"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Kategori Armada *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {MOCK_CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tahun Perakitan *</label>
                  <input
                    type="number"
                    required
                    min="2018"
                    max="2026"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Transmisi *</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="automatic">Automatic (AT / CVT)</option>
                    <option value="manual">Manual (MT)</option>
                  </select>
                </div>
              </div>

              {/* Capacity, Fuel, Price, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Kapasitas (Kursi) *</label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="16"
                    value={formData.passenger_capacity}
                    onChange={(e) => setFormData({ ...formData, passenger_capacity: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Bahan Bakar *</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value as FuelType })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bensin">Bensin</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="listrik">Listrik (EV)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Harga Sewa / Hari (Rp) *</label>
                  <input
                    type="number"
                    required
                    step="25000"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status Ketersediaan *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Tersedia (Ready)</option>
                    <option value="rented">Sedang Disewa</option>
                    <option value="maintenance">Perawatan / Servis</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Lengkap Kendaraan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kondisi unit, fitur unggulan, kelayakan jalan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md"
                >
                  {editingVehicle ? 'Simpan Perubahan' : 'Simpan Kendaraan Baru'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. Modal Konfirmasi Hapus Kendaraan */}
      {deletingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Kendaraan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus unit <strong>{deletingVehicle.name}</strong> ({deletingVehicle.license_plate}) dari inventaris armada DriveEase?
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingVehicle(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Hapus Unit
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
