import { useState, useMemo, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  Calendar,
  CreditCard,
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/format';
import { getStoredBookings } from '../../services/bookingStorage';
import { addManualPayment } from '../../services/paymentStorage';
import type { Booking } from '../../types';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'payment' | 'profile' | 'password'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Profile Edit State
  const [name, setName] = useState(user?.name || 'Budi Santoso');
  const [email, setEmail] = useState(user?.email || 'customer@driveease.com');
  const [phone, setPhone] = useState(user?.phone || '081377889900');
  const [nik, setNik] = useState('3171012345670001');
  const [simNumber, setSimNumber] = useState('9901-2345-6789');
  const [address, setAddress] = useState('Jl. Kebon Jeruk No. 12, Jakarta Barat');

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Payment Upload State
  const [uploadBookingId, setUploadBookingId] = useState<string | number>(1);
  const [uploadBank, setUploadBank] = useState('BCA Transfer (Bank Central Asia)');
  const [uploadProofUrl, setUploadProofUrl] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'
  );
  const [uploadRef, setUploadRef] = useState(`TRX-CUST-${Date.now().toString().slice(-6)}`);

  useEffect(() => {
    const all = getStoredBookings();
    setBookings(all);
    if (all.length > 0) {
      setUploadBookingId(all[0].id);
    }
  }, []);

  // Filter user bookings
  const myBookings = useMemo(() => {
    return bookings;
  }, [bookings]);

  // Selected booking for payment info
  const selectedBookingForPayment = useMemo(() => {
    return bookings.find((b) => String(b.id) === String(uploadBookingId)) || bookings[0];
  }, [bookings, uploadBookingId]);

  // Handle Profile Update
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccessMsg('Data profil dan identitas berhasil diperbarui!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Handle Password Update
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('Password baru harus minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setActionSuccessMsg('Password akun Anda berhasil diubah dengan aman!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Handle Payment Upload
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForPayment) return;

    addManualPayment({
      booking_id: selectedBookingForPayment.id,
      booking_code: selectedBookingForPayment.booking_code,
      customer_name: name,
      amount: selectedBookingForPayment.down_payment_required || 765000,
      payment_type: 'down_payment',
      payment_method: 'bank_transfer',
      payment_status: 'pending',
      proof_url: uploadProofUrl,
      bank_name: uploadBank,
      transaction_ref: uploadRef,
    });

    setActionSuccessMsg('Bukti transfer berhasil diunggah! Admin sedang memverifikasi pembayaran Anda.');
    setActiveTab('bookings');
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-[#0f2744] via-blue-900 to-[#0a192f] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Penyewa Terverifikasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{name}</h2>
              <p className="text-xs text-slate-300">{email} • {phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> KTP & SIM A Sah
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Riwayat & Status Sewa ({myBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'payment'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Upload Bukti Bayar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Edit Profil & Identitas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Ubah Password</span>
          </button>
        </div>

        {/* Tab 1: Bookings & Status */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0f2744]">Daftar Pemesanan Kendaraan Saya</h3>

            <div className="grid grid-cols-1 gap-4">
              {myBookings.map((b) => {
                const statusInfo = getStatusBadge(b.status);

                return (
                  <div
                    key={b.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
                  >
                    {/* Left Car & Code */}
                    <div className="flex items-start gap-4">
                      <img
                        src={b.vehicle?.image_url}
                        alt={b.vehicle?.name}
                        className="w-24 h-18 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 text-xs">{b.booking_code}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{b.vehicle?.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{b.vehicle?.license_plate}</p>
                      </div>
                    </div>

                    {/* Middle Dates */}
                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Periode Rental</span>
                      <span className="font-bold text-slate-800 block">
                        {formatDate(b.start_date)} s/d {formatDate(b.end_date)}
                      </span>
                      <span className="text-slate-500 block">Durasi Total: {b.total_days} Hari</span>
                    </div>

                    {/* Right Amount & Actions */}
                    <div className="space-y-2 text-left md:text-right">
                      <span className="text-slate-400 block font-semibold uppercase text-[10px]">Total Tagihan</span>
                      <span className="text-xl font-black text-blue-600 block">{formatCurrency(b.total_amount)}</span>
                      
                      <div className="flex items-center gap-2 justify-start md:justify-end">
                        {b.status === 'pending' || b.payment_status === 'unpaid' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setUploadBookingId(b.id);
                              setActiveTab('payment');
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" /> Bayar / Upload DP
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pembayaran DP Sah
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload Proof of Payment */}
        {activeTab === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Payment Instructions Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0f2744] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Instruksi Pembayaran</span>
                <h3 className="text-xl font-black tracking-tight">Rekening Resmi DriveEase</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Silakan transfer pembayaran uang muka (DP 30%) atau pelunasan ke rekening resmi berikut:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">Bank Central Asia (BCA)</span>
                    <span className="text-[10px] bg-blue-500/30 px-2 py-0.5 rounded">Otomatis</span>
                  </div>
                  <span className="text-base font-mono font-black text-white block">8890-1234-5678</span>
                  <span className="text-slate-400 block">a.n. PT DriveEase Indonesia</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Bank Mandiri</span>
                    <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded">Virtual Account</span>
                  </div>
                  <span className="text-base font-mono font-black text-white block">137-00-9988112-2</span>
                  <span className="text-slate-400 block">a.n. PT DriveEase Indonesia</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Catatan Verifikasi:</span>
                <p>Verifikasi pembayaran diproses maksimal 15 menit setelah bukti transfer berhasil Anda kirimkan.</p>
              </div>
            </div>

            {/* Upload Form Box */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-[#0f2744]">Formulir Konfirmasi Pembayaran</h3>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pilih Booking yang Dibayar *</label>
                  <select
                    value={uploadBookingId}
                    onChange={(e) => setUploadBookingId(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    {myBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.booking_code} - {b.vehicle?.name} (Tagihan: {formatCurrency(b.total_amount)})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBookingForPayment && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Uang Muka (DP 30%) Wajib:</span>
                      <span className="text-base font-black text-blue-600 block">
                        {formatCurrency(selectedBookingForPayment.down_payment_required || 765000)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Status Saat Ini:</span>
                      <span className="font-bold text-amber-700 capitalize">
                        {selectedBookingForPayment.payment_status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Bank Pengirim *</label>
                    <select
                      value={uploadBank}
                      onChange={(e) => setUploadBank(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BCA Transfer">BCA Transfer</option>
                      <option value="Mandiri Transfer">Mandiri Transfer</option>
                      <option value="BNI Transfer">BNI Transfer</option>
                      <option value="BRI Transfer">BRI Transfer</option>
                      <option value="QRIS Nasional">QRIS Pembayaran</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Referensi Transaksi *</label>
                    <input
                      type="text"
                      required
                      value={uploadRef}
                      onChange={(e) => setUploadRef(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">URL / File Bukti Transfer *</label>
                  <input
                    type="url"
                    required
                    value={uploadProofUrl}
                    onChange={(e) => setUploadProofUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Masukkan URL bukti tangkapan layar m-Banking atau struk ATM.</p>
                </div>

                {uploadProofUrl && (
                  <div className="h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={uploadProofUrl} alt="Preview Bukti" className="w-full h-full object-contain" />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Kirim Bukti Pembayaran
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* Tab 3: Edit Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-5">
            <h3 className="text-lg font-bold text-[#0f2744]">Pengaturan Profil & Dokumen Identitas</h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nama Lengkap Sesuai KTP *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">NIK (KTP) *</label>
                  <input
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nomor SIM A Aktif *</label>
                  <input
                    type="text"
                    required
                    value={simNumber}
                    onChange={(e) => setSimNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Domisili *</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition cursor-pointer"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Change Password */}
        {activeTab === 'password' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-5">
            <h3 className="text-lg font-bold text-[#0f2744]">Ubah Kata Sandi (Password)</h3>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Password Saat Ini *</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Password Baru (Minimal 8 Karakter) *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Konfirmasi Password Baru *</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0f2744] hover:bg-blue-600 text-white font-bold shadow-md transition cursor-pointer"
                >
                  Perbarui Password Akun
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
