import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  FileText,
  DollarSign,
  Clock,
  RotateCcw,
  ShieldCheck,
  Building,
  Plus,
} from 'lucide-react';
import type { Payment, PaymentType, PaymentMethod } from '../../types';
import { formatCurrency, getStatusBadge } from '../../utils/format';
import {
  getStoredPayments,
  verifyPaymentInStore,
  rejectPaymentInStore,
  addManualPayment,
} from '../../services/paymentStorage';
import { getStoredBookings } from '../../services/bookingStorage';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modals
  const [previewProofPayment, setPreviewProofPayment] = useState<Payment | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Manual payment form
  const [manualForm, setManualForm] = useState({
    booking_code: 'DRV-202610-8912',
    customer_name: 'Budi Santoso',
    amount: 1785000,
    payment_type: 'settlement' as PaymentType,
    payment_method: 'cash' as PaymentMethod,
    bank_name: 'Kasir Rental (Tunai)',
    transaction_ref: `CSH-${Date.now().toString().slice(-6)}`,
  });

  useEffect(() => {
    setPayments(getStoredPayments());
  }, []);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchRef = p.transaction_ref?.toLowerCase().includes(q);
        const matchCode = p.booking_code?.toLowerCase().includes(q);
        const matchCustomer = p.customer_name?.toLowerCase().includes(q);
        const matchBank = p.bank_name?.toLowerCase().includes(q);
        if (!matchRef && !matchCode && !matchCustomer && !matchBank) return false;
      }
      if (selectedStatus !== 'all') {
        if (p.payment_status !== selectedStatus) return false;
      }
      if (selectedType !== 'all') {
        if (p.payment_type !== selectedType) return false;
      }
      return true;
    });
  }, [payments, searchQuery, selectedStatus, selectedType]);

  // Financial summary
  const summary = useMemo(() => {
    const verified = payments.filter((p) => p.payment_status === 'verified');
    const pending = payments.filter((p) => p.payment_status === 'pending');
    const totalVerified = verified.reduce((acc, p) => acc + p.amount, 0);
    const totalPending = pending.reduce((acc, p) => acc + p.amount, 0);
    const countDP = payments.filter((p) => p.payment_type === 'down_payment' && p.payment_status === 'verified').length;
    const countSettlement = payments.filter((p) => p.payment_type === 'settlement' && p.payment_status === 'verified').length;

    return {
      totalVerified,
      totalPending,
      pendingCount: pending.length,
      countDP,
      countSettlement,
    };
  }, [payments]);

  // Actions
  const handleVerify = (paymentId: string | number) => {
    const updated = verifyPaymentInStore(paymentId);
    setPayments(updated);
    setPreviewProofPayment(null);
    setActionSuccessMsg('Pembayaran berhasil diverifikasi dan disahkan!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleReject = (paymentId: string | number) => {
    const updated = rejectPaymentInStore(paymentId);
    setPayments(updated);
    setPreviewProofPayment(null);
    setActionSuccessMsg('Pembayaran ditolak (bukti tidak sah).');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addManualPayment({
      booking_id: 1,
      booking_code: manualForm.booking_code,
      customer_name: manualForm.customer_name,
      amount: manualForm.amount,
      payment_type: manualForm.payment_type,
      payment_method: manualForm.payment_method,
      payment_status: 'verified',
      bank_name: manualForm.bank_name,
      transaction_ref: manualForm.transaction_ref,
      verified_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verified_by: 'Kasir DriveEase',
    });
    setPayments([created, ...payments]);
    setIsManualModalOpen(false);
    setActionSuccessMsg('Transaksi pelunasan/kasir berhasil dicatat!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const getPaymentTypeLabel = (type: PaymentType) => {
    switch (type) {
      case 'down_payment':
        return { label: 'Uang Muka (DP 30%)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'settlement':
        return { label: 'Pelunasan Sewa', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'full_payment':
        return { label: 'Bayar Lunas 100%', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'penalty':
        return { label: 'Denda / Penalti', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: type, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <AdminLayout pageTitle="Manajemen Transaksi & Pembayaran">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Transaksi & Verifikasi Pembayaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola uang muka (DP), verifikasi bukti transfer nasabah, pelunasan di kasir, dan riwayat mutasi
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Catat Pelunasan / Kasir
        </button>
      </div>

      {/* Action Notification */}
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

      {/* 2. Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Verifikasi */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pemasukan Terverifikasi</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{formatCurrency(summary.totalVerified)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Sah masuk rekening resmi</p>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Menunggu Verifikasi</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-amber-600">{formatCurrency(summary.totalPending)}</h3>
          <p className="text-xs text-amber-700 font-semibold mt-1">{summary.pendingCount} bukti transfer perlu dicek</p>
        </div>

        {/* Uang Muka DP */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Uang Muka (DP 30%)</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-indigo-600">{summary.countDP} Transaksi</h3>
          <p className="text-xs text-slate-500 mt-1">Penguncian jadwal armada</p>
        </div>

        {/* Pelunasan Selesai */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pelunasan Unit</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-blue-600">{summary.countSettlement} Transaksi</h3>
          <p className="text-xs text-slate-500 mt-1">Lunas saat serah terima unit</p>
        </div>

      </div>

      {/* 3. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode booking, nama penyewa, nomor ref, bank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status Pembayaran</option>
            <option value="pending">Menunggu Verifikasi (Pending)</option>
            <option value="verified">Terverifikasi (Lunas Sah)</option>
            <option value="rejected">Ditolak (Tidak Valid)</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Jenis Tagihan</option>
            <option value="down_payment">Uang Muka (DP 30%)</option>
            <option value="settlement">Pelunasan Sisa</option>
            <option value="full_payment">Bayar Lunas Awal</option>
          </select>
        </div>

        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedType('all');
            }}
            title="Reset Filter"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 4. Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Transaksi & Booking</th>
                <th className="py-3.5 px-6">Pelanggan</th>
                <th className="py-3.5 px-6">Jenis Pembayaran</th>
                <th className="py-3.5 px-6">Metode & Bank</th>
                <th className="py-3.5 px-6">Nominal Transfer</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => {
                  const statusInfo = getStatusBadge(p.payment_status);
                  const typeInfo = getPaymentTypeLabel(p.payment_type);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Ref & Booking */}
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-slate-800 block text-xs">
                          {p.transaction_ref}
                        </span>
                        <span className="font-mono text-blue-600 text-[11px] font-semibold block mt-0.5">
                          {p.booking_code}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.created_at}</span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block text-sm">{p.customer_name}</span>
                      </td>

                      {/* Payment Type */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </td>

                      {/* Method & Bank */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> {p.bank_name || p.payment_method}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase capitalize">{p.payment_method.replace('_', ' ')}</span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-blue-600 block">
                          {formatCurrency(p.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                        {p.verified_at && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Oleh {p.verified_by || 'Admin'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Quick Verify */}
                          {p.payment_status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleVerify(p.id)}
                              title="Sahkan & Verifikasi Pembayaran"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold transition flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span className="hidden xl:inline">Sahkan</span>
                            </button>
                          )}

                          {/* View Proof Modal */}
                          <button
                            type="button"
                            onClick={() => setPreviewProofPayment(p)}
                            title="Pratinjau Bukti Transfer"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
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
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada transaksi pembayaran yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>Menampilkan <strong>{filteredPayments.length}</strong> catatan transaksi</span>
          <span className="font-semibold text-emerald-600">Mutasi Rekening Terkoneksi</span>
        </div>
      </div>

      {/* 5. Modal Pratinjau Bukti Pembayaran */}
      {previewProofPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">
                  Bukti Pembayaran: {previewProofPayment.transaction_ref}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProofPayment(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Slip Transfer Image */}
              <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-72 flex items-center justify-center">
                {previewProofPayment.proof_url ? (
                  <img
                    src={previewProofPayment.proof_url}
                    alt="Bukti Transfer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    Tidak ada file gambar bukti (Pembayaran kasir / EDC)
                  </div>
                )}
              </div>

              {/* Rincian Transaksi */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kode Booking:</span>
                  <span className="font-mono font-bold text-blue-600">{previewProofPayment.booking_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pelanggan:</span>
                  <span className="font-bold text-slate-800">{previewProofPayment.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank / Channel:</span>
                  <span className="font-semibold text-slate-800">{previewProofPayment.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Pembayaran:</span>
                  <span className="font-bold text-slate-800 uppercase">{previewProofPayment.payment_type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span>Nominal Transfer:</span>
                  <span className="text-blue-600 font-black">{formatCurrency(previewProofPayment.amount)}</span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                {previewProofPayment.payment_status === 'pending' ? (
                  <button
                    type="button"
                    onClick={() => handleReject(previewProofPayment.id)}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 text-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Tolak Bukti
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-500">
                    Status: <strong className="uppercase">{previewProofPayment.payment_status}</strong>
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewProofPayment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-white"
                >
                  Tutup
                </button>

                {previewProofPayment.payment_status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleVerify(previewProofPayment.id)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Sahkan Pembayaran
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. Modal Catat Pembayaran Kasir / Pelunasan Manual */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Catat Pembayaran Kasir / Pelunasan</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Kode Booking Terkait *</label>
                <select
                  value={manualForm.booking_code}
                  onChange={(e) => {
                    const bList = getStoredBookings();
                    const target = bList.find((b) => b.booking_code === e.target.value);
                    setManualForm({
                      ...manualForm,
                      booking_code: e.target.value,
                      customer_name: target ? target.customer_name : manualForm.customer_name,
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {getStoredBookings().map((b) => (
                    <option key={b.booking_code} value={b.booking_code}>
                      {b.booking_code} - {b.customer_name} ({b.vehicle?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nama Pembayar / Pelanggan *</label>
                <input
                  type="text"
                  required
                  value={manualForm.customer_name}
                  onChange={(e) => setManualForm({ ...manualForm, customer_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Jenis Pembayaran *</label>
                  <select
                    value={manualForm.payment_type}
                    onChange={(e) => setManualForm({ ...manualForm, payment_type: e.target.value as PaymentType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="settlement">Pelunasan Sisa Sewa</option>
                    <option value="down_payment">Uang Muka (DP 30%)</option>
                    <option value="full_payment">Lunas Penuh (100%)</option>
                    <option value="penalty">Denda / Kerusakan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Metode Bayar *</label>
                  <select
                    value={manualForm.payment_method}
                    onChange={(e) => setManualForm({ ...manualForm, payment_method: e.target.value as PaymentMethod })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Tunai (Cash di Kasir)</option>
                    <option value="bank_transfer">Transfer Bank</option>
                    <option value="qris">QRIS Standar</option>
                    <option value="credit_card">Mesin EDC / Kartu Kredit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nominal Pembayaran (Rp) *</label>
                  <input
                    type="number"
                    required
                    step="10000"
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Channel / Kasir *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.bank_name}
                    onChange={(e) => setManualForm({ ...manualForm, bank_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Simpan Transaksi Kasir
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}

