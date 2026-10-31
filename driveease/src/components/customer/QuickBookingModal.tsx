import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Car, ArrowRight, User } from 'lucide-react';
import type { Vehicle } from '../../types';
import { formatCurrency, calculateDays } from '../../utils/format';

interface QuickBookingModalProps {
  vehicle: Vehicle | null;
  initialStartDate: string;
  initialEndDate: string;
  onClose: () => void;
  onBookingSuccess?: (bookingCode: string) => void;
}

export default function QuickBookingModal({
  vehicle,
  initialStartDate,
  initialEndDate,
  onClose,
  onBookingSuccess,
}: QuickBookingModalProps) {
  const [startDate, setStartDate] = useState(
    initialStartDate || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    initialEndDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );

  // Customer Form state
  const [name, setName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi.santoso@gmail.com');
  const [phone, setPhone] = useState('081377889900');
  const [nik, setNik] = useState('3171012345670001');
  const [simNumber, setSimNumber] = useState('9901-2345-6789');
  const [address, setAddress] = useState('Jl. Kebon Jeruk No. 12, Jakarta Barat');
  const [notes, setNotes] = useState('');

  // Flow State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  if (!vehicle) return null;

  const totalDays = calculateDays(startDate, endDate);
  const subtotal = vehicle.price_per_day * totalDays;
  const deposit = 500000; // Deposit jaminan (refundable)
  const downPayment = Math.round(subtotal * 0.3); // 30% DP
  const totalAmount = subtotal + deposit;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `DRV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;
    setGeneratedCode(code);
    setIsSubmitted(true);
    if (onBookingSuccess) {
      onBookingSuccess(code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
          <div className="flex items-center gap-2.5">
            <Car className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold">
              {isSubmitted ? 'Permintaan Booking Berhasil' : 'Formulir Reservasi Kendaraan'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Selected Vehicle Summary */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-20 h-16 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {vehicle.category_name}
                </span>
                <h4 className="text-base font-bold text-slate-900 truncate mt-0.5">{vehicle.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{vehicle.license_plate} • {formatCurrency(vehicle.price_per_day)}/hari</p>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tanggal Mulai Sewa
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>Tanggal Selesai Sewa</span>
                  <span className="text-blue-600 font-bold text-xs">{totalDays} Hari</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Customer Personal Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" /> Data Identitas Penyewa
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Sesuai KTP *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan) *</label>
                  <input
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor SIM A *</label>
                  <input
                    type="text"
                    required
                    value={simNumber}
                    onChange={(e) => setSimNumber(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Konfirmasi *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili *</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Butuh child car seat, serah terima di bandara..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Rincian Perhitungan Biaya</h4>
              
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Sewa {totalDays} Hari ({formatCurrency(vehicle.price_per_day)} x {totalDays})</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-600">Deposit Jaminan (Dikembalikan saat unit kembali aman)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(deposit)}</span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
                <span>Total Biaya Sewa</span>
                <span className="text-blue-600 font-black">{formatCurrency(totalAmount)}</span>
              </div>

              <div className="flex justify-between py-1 bg-amber-50 p-2 rounded-lg text-amber-800 font-semibold border border-amber-200 mt-2">
                <span>Minimal Uang Muka (DP 30%):</span>
                <span>{formatCurrency(downPayment)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#0f2744] hover:bg-blue-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Kirim Permintaan Reservasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Data pribadi Anda terenkripsi aman dan hanya digunakan untuk verifikasi rental.
              </p>
            </div>

          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                Kode Booking: {generatedCode}
              </span>
              <h3 className="text-2xl font-black text-[#0f2744] mt-2">Permintaan Berhasil Dikirim!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Terima kasih, <strong>{name}</strong>. Tim admin kami sedang memeriksa ketersediaan dan dokumen Anda.
                Instruksi pembayaran uang muka sebesar <strong>{formatCurrency(downPayment)}</strong> telah dikirimkan ke email <strong>{email}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Kendaraan:</span>
                <span className="font-bold text-slate-800">{vehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Periode:</span>
                <span className="font-semibold text-slate-800">{startDate} s/d {endDate} ({totalDays} Hari)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Total:</span>
                <span className="font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-[#0f2744] hover:bg-blue-600 text-white font-bold text-sm transition"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
