import { useState, useMemo, useEffect } from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import {
  RotateCcw,
  CheckCircle2,
  KeyRound,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import type { Booking } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { getStoredBookings, saveBookings } from '../../services/bookingStorage';
import { updateVehicleInStore } from '../../services/vehicleStorage';
import { addVehicleReturnRecord } from '../../services/returnMaintenanceStorage';

export default function StaffDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'pickups' | 'returns' | 'verification'>('pickups');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Handover Modal State (Serah Terima)
  const [handoverBooking, setHandoverBooking] = useState<Booking | null>(null);
  const [startMileage, setStartMileage] = useState(18500);
  const [startFuel, setStartFuel] = useState(100);
  const [checklist, setChecklist] = useState({
    body_clean: true,
    interior_clean: true,
    tires_condition: true,
    spare_tire: true,
    tools_complete: true,
    stnk_present: true,
  });
  const [handoverPhoto, setHandoverPhoto] = useState(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'
  );
  const [handoverNotes, setHandoverNotes] = useState('Kunci, remote alarm, dan STNK asli telah diserahkan. Unit bersih.');

  // Return Inspection Modal State (Pengembalian)
  const [returnBooking, setReturnBooking] = useState<Booking | null>(null);
  const [returnMileage, setReturnMileage] = useState(19200);
  const [returnFuel, setReturnFuel] = useState(90);
  const [lateHours, setLateHours] = useState(0);
  const [damageFee, setDamageFee] = useState(0);
  const [returnNotes, setReturnNotes] = useState('Kondisi unit mulus dan terawat. Bensin normal.');
  const [returnPhoto, setReturnPhoto] = useState(
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'
  );

  useEffect(() => {
    setBookings(getStoredBookings());
  }, []);

  // Pickups: status 'approved'
  const pickupsList = useMemo(() => {
    return bookings.filter((b) => b.status === 'approved');
  }, [bookings]);

  // Returns: status 'ongoing'
  const returnsList = useMemo(() => {
    return bookings.filter((b) => b.status === 'ongoing');
  }, [bookings]);

  // Handover submission
  const handleCompleteHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverBooking) return;

    // 1. Update Booking status to ongoing
    const updatedBookings = bookings.map((b) => {
      if (b.id === handoverBooking.id) {
        return {
          ...b,
          status: 'ongoing' as any,
          notes: `${b.notes ? b.notes + ' • ' : ''}Serah terima selesai: KM Awal ${startMileage}, BBM ${startFuel}%.`,
        };
      }
      return b;
    });

    setBookings(updatedBookings);
    saveBookings(updatedBookings);

    // 2. Update Vehicle status to rented
    updateVehicleInStore(handoverBooking.vehicle_id, {
      status: 'rented',
      mileage: startMileage,
    });

    setHandoverBooking(null);
    setActionSuccessMsg(`Serah terima unit ${handoverBooking.vehicle?.name} berhasil! Kunci & STNK diserahkan.`);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  // Return inspection submission
  const handleCompleteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBooking) return;

    const penalty = lateHours * 50000 + damageFee + (returnFuel < 90 ? 50000 : 0);

    addVehicleReturnRecord(
      {
        booking_id: returnBooking.id,
        staff_id: 2,
        staff_name: 'Rudi Pratama (Petugas)',
        return_date: returnBooking.end_date,
        actual_return_date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        end_mileage: returnMileage,
        fuel_level: returnFuel,
        late_hours: lateHours,
        late_fee: lateHours * 50000,
        damage_fee: damageFee,
        fuel_charge: returnFuel < 90 ? 50000 : 0,
        total_penalty: penalty,
        damage_notes: returnNotes,
        photos: [returnPhoto],
        status: damageFee > 0 ? 'needs_maintenance' : 'settled',
      },
      returnBooking.vehicle_id
    );

    // Refresh bookings
    setBookings(getStoredBookings());
    setReturnBooking(null);
    setActionSuccessMsg(
      damageFee > 0
        ? `Pengembalian selesai dengan catatan kerusakan (Denda ${formatCurrency(penalty)}). Mobil masuk antrean maintenance.`
        : `Pengembalian sukses! Unit kembali siap jalan di garasi.`
    );
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  return (
    <StaffLayout pageTitle="Pusat Operasional Petugas Lapangan">
      
      {/* 1. Header & Quick Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Operasional Serah Terima & Inspeksi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lakukan checklist fisik 6-titik, verifikasi KTP/SIM penyewa, catat odometer awal/akhir, dan serah terima kunci
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Shift Pagi: 07.00 - 16.00 WIB</span>
          </span>
        </div>
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

      {/* 2. Key Action Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => setActiveTab('pickups')}
          className={`p-5 rounded-3xl border transition cursor-pointer shadow-xs ${
            activeTab === 'pickups'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'pickups' ? 'text-blue-100' : 'text-slate-400'}`}>
              Jadwal Serah Terima (Ambil)
            </span>
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-black">{pickupsList.length} Unit</h3>
          <p className={`text-xs mt-1 ${activeTab === 'pickups' ? 'text-blue-100' : 'text-slate-500'}`}>
            Booking disetujui menunggu pengambilan
          </p>
        </div>

        <div
          onClick={() => setActiveTab('returns')}
          className={`p-5 rounded-3xl border transition cursor-pointer shadow-xs ${
            activeTab === 'returns'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-900 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'returns' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Jadwal Pengembalian (Kembali)
            </span>
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-3xl font-black">{returnsList.length} Unit</h3>
          <p className={`text-xs mt-1 ${activeTab === 'returns' ? 'text-emerald-100' : 'text-slate-500'}`}>
            Mobil sedang jalan, siap diperiksa saat kembali
          </p>
        </div>

        <div
          onClick={() => setActiveTab('verification')}
          className={`p-5 rounded-3xl border transition cursor-pointer shadow-xs ${
            activeTab === 'verification'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'verification' ? 'text-slate-300' : 'text-slate-400'}`}>
              SOP Verifikasi Fisik
            </span>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black">6-Titik Cek</h3>
          <p className={`text-xs mt-1 ${activeTab === 'verification' ? 'text-slate-300' : 'text-slate-500'}`}>
            Bodi, interior, ban, serep, tools, STNK
          </p>
        </div>
      </div>

      {/* 3. Main Operational Tab Content */}
      {activeTab === 'pickups' ? (
        /* TAB 1: JADWAL PENGAMBILAN & SERAH TERIMA */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#0f2744]">Jadwal Pengambilan & Serah Terima Unit</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pesanan sewa yang telah disetujui admin dan siap diserahterimakan kepada penyewa
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              {pickupsList.length} Unit Siap Diambil
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Kode Booking</th>
                  <th className="py-3.5 px-6">Penyewa & Kontak</th>
                  <th className="py-3.5 px-6">Kendaraan & Plat</th>
                  <th className="py-3.5 px-6">Tanggal Mulai</th>
                  <th className="py-3.5 px-6">Status Bayar</th>
                  <th className="py-3.5 px-6 text-right">Aksi Serah Terima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickupsList.length > 0 ? (
                  pickupsList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600 text-xs">
                        {b.booking_code}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block text-sm">{b.customer_name}</span>
                        <span className="text-slate-400 text-[11px]">{b.customer_phone}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 block">{b.vehicle?.name}</span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 inline-block mt-0.5">
                          {b.vehicle?.license_plate}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {formatDate(b.start_date)} ({b.total_days} Hari)
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                          {b.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setHandoverBooking(b);
                            setStartMileage(b.vehicle?.mileage || 18500);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Serah Terima Fisik</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      Tidak ada jadwal pengambilan unit yang pending saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'returns' ? (
        /* TAB 2: JADWAL PENGEMBALIAN */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#0f2744]">Jadwal Pengembalian & Check-in Armada</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Armada yang sedang disewa. Lakukan pemeriksaan kilometer akhir, cek bodi, dan deteksi denda saat mobil kembali.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              {returnsList.length} Unit Sedang Berjalan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3.5 px-6">Kode Booking</th>
                  <th className="py-3.5 px-6">Penyewa & Kontak</th>
                  <th className="py-3.5 px-6">Kendaraan & Plat</th>
                  <th className="py-3.5 px-6">Target Kembali</th>
                  <th className="py-3.5 px-6">Status Mobil</th>
                  <th className="py-3.5 px-6 text-right">Aksi Pemeriksaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returnsList.length > 0 ? (
                  returnsList.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600 text-xs">
                        {b.booking_code}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block text-sm">{b.customer_name}</span>
                        <span className="text-slate-400 text-[11px]">{b.customer_phone}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 block">{b.vehicle?.name}</span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 inline-block mt-0.5">
                          {b.vehicle?.license_plate}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {formatDate(b.end_date)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Sedang Disewa
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setReturnBooking(b);
                            setReturnMileage((b.vehicle?.mileage || 20000) + 250);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Periksa Pengembalian</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      Tidak ada armada yang sedang berjalan saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 3: STANDAR OPERASIONAL PROSEDUR (SOP) PETUGAS */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-[#0f2744]">Standar Operasional Checklist 6-Titik Petugas Rental</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instruksi baku keselamatan dan keabsahan serah terima armada DriveEase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Pencocokan KTP & SIM A Asli
              </span>
              <p className="leading-relaxed">
                Pastikan nama di KTP dan SIM A fisik identik dengan data reservasi di sistem. Foto fisik penyewa bersama mobil saat kunci diserahkan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Odometer & Level Bahan Bakar
              </span>
              <p className="leading-relaxed">
                Catat angka speedometer kilometer secara presisi. Pastikan bahan bakar awal diisi penuh (100%) dan jelaskan aturan pengembalian dengan level BBM setara.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Kelengkapan STNK Asli & Tools
              </span>
              <p className="leading-relaxed">
                Periksa laci dashboard: pastikan STNK asli dengan masa berlaku pajak aktif tersedia, serta dongkrak, kunci roda, dan ban cadangan lengkap di bagasi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4. Inspeksi Bodi Keliling Bersama Penyewa
              </span>
              <p className="leading-relaxed">
                Ajak penyewa berkeliling mobil sebelum kunci diserahkan. Rekam/foto bagian bemper, spion, dan pintu agar tidak ada perselisihan lecet bodi saat kembali.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Formulir Serah Terima Kunci (Handover) */}
      {handoverBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Serah Terima Armada: {handoverBooking.booking_code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setHandoverBooking(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteHandover} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Car & Customer Brief */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Penyewa</span>
                  <span className="font-bold text-slate-900 text-sm">{handoverBooking.customer_name}</span>
                  <span className="text-slate-500 block">{handoverBooking.customer_phone}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobil</span>
                  <span className="font-bold text-slate-900 text-sm">{handoverBooking.vehicle?.name}</span>
                  <span className="font-mono font-bold text-blue-600 block">{handoverBooking.vehicle?.license_plate}</span>
                </div>
              </div>

              {/* Mileage & Fuel Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Kilometer Awal (KM) *</label>
                  <input
                    type="number"
                    required
                    value={startMileage}
                    onChange={(e) => setStartMileage(Number(e.target.value))}
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
                    value={startFuel}
                    onChange={(e) => setStartFuel(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* 6-Titik Checklist Fisik */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Checklist Fisik Serah Terima 6-Titik
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.body_clean}
                      onChange={(e) => setChecklist({ ...checklist, body_clean: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Bodi luar bersih & bebas lecet baru</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.interior_clean}
                      onChange={(e) => setChecklist({ ...checklist, interior_clean: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Kabin interior wangi & higienis</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.tires_condition}
                      onChange={(e) => setChecklist({ ...checklist, tires_condition: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Kondisi ban 4 roda tebal & angin cukup</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.spare_tire}
                      onChange={(e) => setChecklist({ ...checklist, spare_tire: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Ban cadangan / serep tersedia</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.tools_complete}
                      onChange={(e) => setChecklist({ ...checklist, tools_complete: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>Dongkrak & kunci roda lengkap</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.stnk_present}
                      onChange={(e) => setChecklist({ ...checklist, stnk_present: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>STNK Asli tersimpan di laci mobil</span>
                  </label>
                </div>
              </div>

              {/* Photo & Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL Foto Serah Terima Fisik Mobil *</label>
                <input
                  type="url"
                  required
                  value={handoverPhoto}
                  onChange={(e) => setHandoverPhoto(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Catatan Tambahan Serah Terima *</label>
                <textarea
                  rows={2}
                  required
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHandoverBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Sahkan & Serahkan Kunci
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. Modal Pemeriksaan Pengembalian Mobil */}
      {returnBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">Pemeriksaan Pengembalian: {returnBooking.booking_code}</h3>
              </div>
              <button
                type="button"
                onClick={() => setReturnBooking(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteReturn} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{returnBooking.customer_name}</span>
                  <span className="text-slate-500 block">{returnBooking.customer_phone}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm">{returnBooking.vehicle?.name}</span>
                  <span className="font-mono font-bold text-blue-600 block">{returnBooking.vehicle?.license_plate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Kilometer Akhir (KM) *</label>
                  <input
                    type="number"
                    required
                    value={returnMileage}
                    onChange={(e) => setReturnMileage(Number(e.target.value))}
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
                    value={returnFuel}
                    onChange={(e) => setReturnFuel(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Keterlambatan (Jam)</label>
                  <input
                    type="number"
                    min="0"
                    value={lateHours}
                    onChange={(e) => setLateHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Rp 50.000 / jam</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Denda Kerusakan Bodi (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={damageFee}
                    onChange={(e) => setDamageFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL Foto Kondisi Pengembalian *</label>
                <input
                  type="url"
                  required
                  value={returnPhoto}
                  onChange={(e) => setReturnPhoto(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Catatan Hasil Pemeriksaan *</label>
                <textarea
                  rows={2}
                  required
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  Selesaikan Pemeriksaan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </StaffLayout>
  );
}
