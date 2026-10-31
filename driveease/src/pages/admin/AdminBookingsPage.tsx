import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Search,
  Check,
  X,
  Calendar,
  Eye,
  AlertTriangle,
  RotateCcw,
  Clock,
  User,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import type { Booking } from '../../types';
import { formatCurrency, formatDate, getStatusBadge, calculateDays } from '../../utils/format';
import {
  getStoredBookings,
  updateBookingStatus,
  rescheduleBooking,
} from '../../services/bookingStorage';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');

  // Modals state
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    setBookings(getStoredBookings());
  }, []);

  // Filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchCode = b.booking_code.toLowerCase().includes(q);
        const matchCustomer = b.customer_name.toLowerCase().includes(q);
        const matchVehicle = b.vehicle?.name?.toLowerCase().includes(q);
        const matchPlate = b.vehicle?.license_plate?.toLowerCase().includes(q);
        if (!matchCode && !matchCustomer && !matchVehicle && !matchPlate) return false;
      }
      if (selectedStatusTab !== 'all') {
        if (b.status !== selectedStatusTab) return false;
      }
      return true;
    });
  }, [bookings, searchQuery, selectedStatusTab]);

  // Status counts for tab badges
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      approved: bookings.filter((b) => b.status === 'approved').length,
      ongoing: bookings.filter((b) => b.status === 'ongoing').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      rejected: bookings.filter((b) => b.status === 'rejected').length,
    };
  }, [bookings]);

  // Actions
  const handleApprove = (bookingId: string | number) => {
    const updated = updateBookingStatus(bookingId, 'approved');
    setBookings(updated);
    setActionSuccessMsg('Booking berhasil diverifikasi dan disetujui!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleOpenRejectModal = (booking: Booking) => {
    setRejectingBooking(booking);
    setRejectionReason('Dokumen identitas penyewa tidak lengkap atau tidak dapat diverifikasi.');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingBooking) return;
    const updated = updateBookingStatus(rejectingBooking.id, 'rejected', rejectionReason);
    setBookings(updated);
    setRejectingBooking(null);
    setActionSuccessMsg('Booking telah ditolak.');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleOpenRescheduleModal = (booking: Booking) => {
    setReschedulingBooking(booking);
    setNewStartDate(booking.start_date);
    setNewEndDate(booking.end_date);
    setRescheduleError('');
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking) return;

    const res = rescheduleBooking(reschedulingBooking.id, newStartDate, newEndDate);
    if (!res.success) {
      setRescheduleError(res.message || 'Gagal mengubah jadwal karena bentrok ketersediaan armada.');
    } else {
      if (res.updatedBookings) {
        setBookings(res.updatedBookings);
      }
      setReschedulingBooking(null);
      setActionSuccessMsg('Jadwal rental berhasil diperbarui tanpa bentrok armada!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  return (
    <AdminLayout pageTitle="Manajemen Reservasi & Booking">
      
      {/* 1. Header & Quick Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Daftar Seluruh Booking Rental</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi permohonan sewa, setujui/tolak pemesanan, atur ulang jadwal sewa, dan cegah bentrok ganda
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{counts.pending} Permintaan Menunggu Review</span>
          </span>
        </div>
      </div>

      {/* Action Notification Toast */}
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

      {/* 2. Status Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedStatusTab('all')}
          className={`px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
            selectedStatusTab === 'all'
              ? 'bg-[#0f2744] border-[#0f2744] text-white shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua Booking ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('pending')}
          className={`px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
            selectedStatusTab === 'pending'
              ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
              : 'bg-white border-slate-200 text-amber-700 hover:bg-amber-50'
          }`}
        >
          Menunggu Review ({counts.pending})
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('approved')}
          className={`px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
            selectedStatusTab === 'approved'
              ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
              : 'bg-white border-slate-200 text-sky-700 hover:bg-sky-50'
          }`}
        >
          Disetujui ({counts.approved})
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('ongoing')}
          className={`px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
            selectedStatusTab === 'ongoing'
              ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
              : 'bg-white border-slate-200 text-blue-700 hover:bg-blue-50'
          }`}
        >
          Sedang Disewa ({counts.ongoing})
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('completed')}
          className={`px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
            selectedStatusTab === 'completed'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          Selesai ({counts.completed})
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('rejected')}
          className={`px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
            selectedStatusTab === 'rejected'
              ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
              : 'bg-white border-slate-200 text-rose-700 hover:bg-rose-50'
          }`}
        >
          Ditolak ({counts.rejected})
        </button>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode booking, nama penyewa, mobil, atau plat nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4. Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Kode & Pelanggan</th>
                <th className="py-3.5 px-6">Mobil & Plat</th>
                <th className="py-3.5 px-6">Jadwal Sewa</th>
                <th className="py-3.5 px-6">Total Biaya</th>
                <th className="py-3.5 px-6">Status Booking</th>
                <th className="py-3.5 px-6 text-right">Aksi & Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const statusInfo = getStatusBadge(b.status);

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Code & Customer */}
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-blue-600 block text-xs">
                          {b.booking_code}
                        </span>
                        <span className="font-bold text-slate-900 block text-sm mt-0.5">
                          {b.customer_name}
                        </span>
                        <span className="text-[11px] text-slate-400">{b.customer_phone}</span>
                      </td>

                      {/* Vehicle & Plate */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 block text-xs">
                          {b.vehicle?.name}
                        </span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 inline-block mt-0.5">
                          {b.vehicle?.license_plate}
                        </span>
                      </td>

                      {/* Rental Schedule */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            {formatDate(b.start_date)} - {formatDate(b.end_date)}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-medium">
                            Durasi: {b.total_days} Hari
                          </span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-blue-600 block">
                          {formatCurrency(b.total_amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize block">
                          Status Bayar: <strong className={b.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>{b.payment_status}</strong>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Approve Button (If pending) */}
                          {b.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(b.id)}
                              title="Setujui Booking Ini"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold transition flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span className="hidden xl:inline">Setujui</span>
                            </button>
                          )}

                          {/* Reject Button (If pending) */}
                          {b.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(b)}
                              title="Tolak Booking"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span className="hidden xl:inline">Tolak</span>
                            </button>
                          )}

                          {/* Reschedule Button */}
                          {b.status !== 'completed' && b.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleOpenRescheduleModal(b)}
                              title="Ubah Jadwal Sewa"
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                          )}

                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForDetail(b)}
                            title="Rincian Lengkap Booking"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-700 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada reservasi booking yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>Menampilkan <strong>{filteredBookings.length}</strong> data reservasi</span>
          <span className="font-semibold text-emerald-600">Sistem Pemeriksaan Bentrok Aktif</span>
        </div>
      </div>

      {/* 5. Modal Detail Lengkap Penyewaan */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">
                  Detail Rincian Booking: {selectedBookingForDetail.booking_code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Customer Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" /> Informasi Data Penyewa
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div><span className="text-slate-400 block">Nama:</span> <strong className="text-slate-800">{selectedBookingForDetail.customer_name}</strong></div>
                  <div><span className="text-slate-400 block">WhatsApp:</span> <strong className="text-slate-800">{selectedBookingForDetail.customer_phone}</strong></div>
                  <div><span className="text-slate-400 block">Email:</span> <strong className="text-slate-800">{selectedBookingForDetail.customer_email}</strong></div>
                  <div><span className="text-slate-400 block">Tanggal Pesan:</span> <strong className="text-slate-800">{selectedBookingForDetail.created_at}</strong></div>
                </div>
              </div>

              {/* Vehicle Box */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-4">
                <img
                  src={selectedBookingForDetail.vehicle?.image_url}
                  alt={selectedBookingForDetail.vehicle?.name}
                  className="w-24 h-18 rounded-xl object-cover border border-blue-200"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                    {selectedBookingForDetail.vehicle?.category_name}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{selectedBookingForDetail.vehicle?.name}</h4>
                  <p className="font-mono font-bold text-slate-700">{selectedBookingForDetail.vehicle?.license_plate}</p>
                </div>
              </div>

              {/* Schedule Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Jadwal Pemakaian Kendaraan
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block">Tanggal Mulai:</span>
                    <strong className="text-slate-800">{selectedBookingForDetail.start_date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tanggal Selesai:</span>
                    <strong className="text-slate-800">{selectedBookingForDetail.end_date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Durasi Total:</span>
                    <strong className="text-blue-600 text-sm font-black">{selectedBookingForDetail.total_days} Hari</strong>
                  </div>
                </div>
              </div>

              {/* Financial Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" /> Rincian Finansial & Pembayaran
                </h4>
                <div className="space-y-1 divide-y divide-slate-200">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Tarif Sewa Harian:</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(selectedBookingForDetail.daily_rate)} / hari</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Subtotal Sewa ({selectedBookingForDetail.total_days} hari):</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(selectedBookingForDetail.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Deposit Jaminan (Refundable):</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(selectedBookingForDetail.deposit_amount)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-sm text-slate-900 pt-2">
                    <span>Total Tagihan:</span>
                    <span className="text-blue-600 font-black">{formatCurrency(selectedBookingForDetail.total_amount)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-700 font-semibold bg-emerald-50 px-2 rounded mt-1">
                    <span>Total Telah Dibayar:</span>
                    <span>{formatCurrency(selectedBookingForDetail.paid_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBookingForDetail.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <span className="font-bold block">Catatan / Status Khusus:</span>
                  <p className="mt-0.5">{selectedBookingForDetail.notes}</p>
                </div>
              )}

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-500">
                Status Saat Ini: <strong className="uppercase text-slate-800">{selectedBookingForDetail.status}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="px-5 py-2 rounded-xl bg-[#0f2744] text-white font-bold text-xs"
              >
                Tutup Rincian
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Modal Tolak Booking */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Tolak Permintaan Booking</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tolak pemesanan <strong>{rejectingBooking.booking_code}</strong> atas nama <strong>{rejectingBooking.customer_name}</strong>.
              </p>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs text-left">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Alasan Penolakan Booking *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Dokumen SIM kadaluarsa, unit dialokasikan untuk maintenance..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal Ubah Jadwal (Reschedule) dengan Deteksi Bentrok Armada */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Ubah Jadwal Rental</h3>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div>Mobil: <strong className="text-slate-800">{reschedulingBooking.vehicle?.name}</strong></div>
              <div>Plat: <span className="font-mono font-bold text-slate-700">{reschedulingBooking.vehicle?.license_plate}</span></div>
            </div>

            {rescheduleError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tanggal Mulai Sewa Baru *
                </label>
                <input
                  type="date"
                  required
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>Tanggal Selesai Sewa Baru *</span>
                  <span className="text-blue-600 font-bold">{calculateDays(newStartDate, newEndDate)} Hari</span>
                </label>
                <input
                  type="date"
                  required
                  min={newStartDate}
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800">
                Sistem akan secara otomatis memeriksa ketersediaan kendaraan pada periode baru untuk mencegah pemesanan ganda.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Simpan Jadwal Baru
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
