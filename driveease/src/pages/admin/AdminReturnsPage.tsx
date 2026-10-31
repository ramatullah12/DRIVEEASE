import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  RotateCcw,
  Search,
  Plus,
  CheckCircle2,
  Gauge,
  Fuel,
  Eye,
  X,
  Wrench,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import type { VehicleReturn } from '../../types';
import { formatCurrency } from '../../utils/format';
import {
  getStoredReturns,
  addVehicleReturnRecord,
} from '../../services/returnMaintenanceStorage';
import { getStoredBookings } from '../../services/bookingStorage';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<VehicleReturn[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReturnDetail, setSelectedReturnDetail] = useState<VehicleReturn | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Form State
  const activeBookings = useMemo(() => {
    return getStoredBookings().filter((b) => b.status === 'ongoing' || b.status === 'approved');
  }, []);

  const [selectedBookingId, setSelectedBookingId] = useState<string | number>(
    activeBookings.length > 0 ? activeBookings[0].id : 1
  );
  const [returnDate, setReturnDate] = useState('2026-11-01 12:00');
  const [actualReturnDate, setActualReturnDate] = useState('2026-11-01 14:00');
  const [endMileage, setEndMileage] = useState(25100);
  const [fuelLevel, setFuelLevel] = useState(90);
  const [lateHours, setLateHours] = useState(2);
  const [lateFee, setLateFee] = useState(100000); // 2 x 50.000
  const [damageFee, setDamageFee] = useState(0);
  const [fuelCharge, setFuelCharge] = useState(50000);
  const [damageNotes, setDamageNotes] = useState('Kondisi bodi dan mesin aman. Ada sedikit kekurangan bahan bakar 10%.');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'
  );
  const [inspectionStatus, setInspectionStatus] = useState<'inspected' | 'settled' | 'needs_maintenance'>('settled');

  useEffect(() => {
    setReturns(getStoredReturns());
  }, []);

  // Recalculate late fee when hours change
  const handleLateHoursChange = (hours: number) => {
    setLateHours(hours);
    setLateFee(hours * 50000); // Rp 50.000 / jam keterlambatan
  };

  const totalCalculatedPenalty = lateFee + damageFee + fuelCharge;

  // Filtered
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNotes = r.damage_notes?.toLowerCase().includes(q);
        const matchStaff = r.staff_name?.toLowerCase().includes(q);
        if (!matchNotes && !matchStaff) return false;
      }
      if (selectedStatus !== 'all') {
        if (r.status !== selectedStatus) return false;
      }
      return true;
    });
  }, [returns, searchQuery, selectedStatus]);

  // Submit new return
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const allBookings = getStoredBookings();
    const booking = allBookings.find((b) => String(b.id) === String(selectedBookingId));
    const vehicleId = booking ? booking.vehicle_id : 1;

    const newRecord = addVehicleReturnRecord(
      {
        booking_id: selectedBookingId,
        staff_id: 2,
        staff_name: 'Rudi Pratama (Petugas)',
        return_date: returnDate,
        actual_return_date: actualReturnDate,
        end_mileage: endMileage,
        fuel_level: fuelLevel,
        late_hours: lateHours,
        late_fee: lateFee,
        damage_fee: damageFee,
        fuel_charge: fuelCharge,
        total_penalty: totalCalculatedPenalty,
        damage_notes: damageNotes,
        photos: [photoUrl],
        status: inspectionStatus,
      },
      vehicleId
    );

    setReturns([newRecord, ...returns]);
    setIsAddModalOpen(false);
    setActionSuccessMsg(
      inspectionStatus === 'needs_maintenance'
        ? 'Pengembalian dicatat! Unit dialihkan ke jadwal maintenance bengkel.'
        : 'Pengembalian berhasil dicatat! Kendaraan kini kembali berstatus Tersedia.'
    );
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  return (
    <AdminLayout pageTitle="Manajemen Pengembalian Kendaraan">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Pencatatan & Inspeksi Pengembalian</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Periksa kilometer akhir, deteksi keterlambatan, hitung denda otomatis, dan inspeksi fisik pasca sewa
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Catat Pengembalian Mobil
        </button>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Pengembalian</span>
          <h3 className="text-2xl font-black text-slate-900">{returns.length} Unit Selesai</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Inspeksi fisik terverifikasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Terlambat Kembali</span>
          <h3 className="text-2xl font-black text-amber-600">
            {returns.filter((r) => r.late_hours > 0).length} Kasus
          </h3>
          <p className="text-xs text-amber-700 font-semibold mt-1">Dikenakan denda jam sewa</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Memerlukan Servis</span>
          <h3 className="text-2xl font-black text-rose-600">
            {returns.filter((r) => r.status === 'needs_maintenance').length} Unit
          </h3>
          <p className="text-xs text-rose-700 font-semibold mt-1">Dialihkan ke bengkel rekanan</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Denda Terkumpul</span>
          <h3 className="text-2xl font-black text-blue-600">
            {formatCurrency(returns.reduce((acc, r) => acc + r.total_penalty, 0))}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Keterlambatan + BBM + Baret</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari catatan kondisi, petugas pemeriksa, atau detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Kondisi Pengembalian</option>
            <option value="settled">Selesai & Bersih (Tanpa Masalah)</option>
            <option value="needs_maintenance">Butuh Perbaikan / Servis Bengkel</option>
          </select>
        </div>
      </div>

      {/* 4. Returns Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">ID & Booking</th>
                <th className="py-3.5 px-6">Waktu Kembali (Jadwal vs Aktual)</th>
                <th className="py-3.5 px-6">Kondisi & Odometer</th>
                <th className="py-3.5 px-6">Keterlambatan & BBM</th>
                <th className="py-3.5 px-6">Total Denda</th>
                <th className="py-3.5 px-6">Status Unit</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-blue-600 block text-xs">
                        RTN-00{r.id}
                      </span>
                      <span className="text-[11px] text-slate-500">Booking #{r.booking_id}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{r.staff_name}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-slate-500 block">Jadwal: {r.return_date}</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">Aktual: {r.actual_return_date}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-blue-600" /> {r.end_mileage.toLocaleString()} KM
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <Fuel className="w-3.5 h-3.5 text-amber-500" /> Tangki {r.fuel_level}%
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {r.late_hours > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                          Terlambat {r.late_hours} Jam
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                          Tepat Waktu
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 block text-xs">
                        {r.total_penalty > 0 ? formatCurrency(r.total_penalty) : 'Rp 0 (Bebas Denda)'}
                      </span>
                      {r.damage_fee > 0 && (
                        <span className="text-[10px] text-rose-600 block font-semibold">
                          Kerusakan: {formatCurrency(r.damage_fee)}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {r.status === 'needs_maintenance' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" /> Butuh Servis
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kembali Bersih
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReturnDetail(r)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada catatan pengembalian kendaraan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Catat Pengembalian Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Catat Pengembalian & Checklist Kendaraan</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Select Active Booking */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Pilih Booking Aktif / Disewa *
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {activeBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.booking_code} - {b.customer_name} ({b.vehicle?.name} - {b.vehicle?.license_plate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Jadwal Seharusnya *</label>
                  <input
                    type="text"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Waktu Kembali Aktual *</label>
                  <input
                    type="text"
                    required
                    value={actualReturnDate}
                    onChange={(e) => setActualReturnDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Odometer & Fuel */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Odometer Akhir (KM) *</label>
                  <input
                    type="number"
                    required
                    value={endMileage}
                    onChange={(e) => setEndMileage(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Level Bahan Bakar (%) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Penalty Calculator Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" /> Perhitungan Keterlambatan & Denda Otomatis
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Keterlambatan (Jam)</label>
                    <input
                      type="number"
                      min="0"
                      value={lateHours}
                      onChange={(e) => handleLateHoursChange(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Rp 50.000 / jam</span>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Biaya Kurang BBM (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      step="25000"
                      value={fuelCharge}
                      onChange={(e) => setFuelCharge(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Denda Kerusakan / Lecet (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      value={damageFee}
                      onChange={(e) => setDamageFee(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-rose-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                  <span>Total Denda & Penalti:</span>
                  <span className="text-rose-600 text-base font-black">{formatCurrency(totalCalculatedPenalty)}</span>
                </div>
              </div>

              {/* Photo & Damage Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL Foto Kondisi Fisik Mobil *</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Catatan Hasil Pemeriksaan Fisik *</label>
                <textarea
                  rows={2}
                  required
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              {/* Inspection Status */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Status Pasca Pemeriksaan *</label>
                <select
                  value={inspectionStatus}
                  onChange={(e) => setInspectionStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="settled">Selesai & Bersih (Kembali Berstatus Tersedia)</option>
                  <option value="needs_maintenance">Membutuhkan Servis / Bengkel (Status Jadi Maintenance)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Selesaikan Pengembalian
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Modal Detail Pengembalian */}
      {selectedReturnDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Hasil Pemeriksaan Pengembalian</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReturnDetail(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Photo */}
              {selectedReturnDetail.photos && selectedReturnDetail.photos.length > 0 && (
                <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedReturnDetail.photos[0]}
                    alt="Foto Pengembalian"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Petugas Pemeriksa:</span>
                  <span className="font-bold text-slate-800">{selectedReturnDetail.staff_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Odometer Akhir:</span>
                  <span className="font-bold text-slate-800">{selectedReturnDetail.end_mileage.toLocaleString()} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Keterlambatan:</span>
                  <span className="font-bold text-amber-700">{selectedReturnDetail.late_hours} Jam</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span>Total Denda:</span>
                  <span className="text-blue-600 font-black">{formatCurrency(selectedReturnDetail.total_penalty)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
                <span className="font-bold block mb-1">Catatan Kondisi Fisik:</span>
                <p>{selectedReturnDetail.damage_notes}</p>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedReturnDetail(null)}
                className="px-5 py-2 rounded-xl bg-[#0f2744] text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
