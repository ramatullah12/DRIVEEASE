import { useState } from 'react';
import { X, Users, Fuel, Calendar, ShieldCheck, CheckCircle2, Gauge, Car, ArrowRight, Info } from 'lucide-react';
import type { Vehicle } from '../../types';
import { formatCurrency, getStatusBadge, calculateDays } from '../../utils/format';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  startDate: string;
  endDate: string;
  onClose: () => void;
  onProceedToBooking: (vehicle: Vehicle) => void;
}

export default function VehicleDetailModal({
  vehicle,
  startDate,
  endDate,
  onClose,
  onProceedToBooking,
}: VehicleDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!vehicle) return null;

  const images = [vehicle.image_url, ...(vehicle.additional_images || [])];
  const statusInfo = getStatusBadge(vehicle.status);
  const isAvailable = vehicle.status === 'available';
  const totalDays = calculateDays(startDate, endDate);
  const estimatedTotal = vehicle.price_per_day * totalDays;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
              {vehicle.category_name}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              {statusInfo.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={images[activeImageIndex] || vehicle.image_url}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Vehicle Description */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Deskripsi Kendaraan
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* Standard Included Checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Fasilitas & Jaminan Rental
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unit 100% Bersih & Disinfeksi</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Bebas Servis & Perawatan</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Bantuan Darurat 24 Jam</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Proteksi Asuransi Resmi</span>
                </div>
              </div>
            </div>

            {/* Info & Specifications Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">{vehicle.name}</h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">{vehicle.model_type}</p>

                {/* Specs Box */}
                <div className="mt-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Spesifikasi Teknis
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 divide-y divide-slate-200/80 text-xs">
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" /> Kapasitas
                      </span>
                      <span className="font-bold text-slate-900">{vehicle.passenger_capacity} Penumpang</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-slate-400" /> Transmisi
                      </span>
                      <span className="font-bold text-slate-900 capitalize">
                        {vehicle.transmission === 'automatic' ? 'Otomatis (AT/CVT)' : 'Manual (MT)'}
                      </span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Fuel className="w-4 h-4 text-slate-400" /> Bahan Bakar
                      </span>
                      <span className="font-bold text-slate-900 capitalize">{vehicle.fuel_type}</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" /> Tahun Rakit
                      </span>
                      <span className="font-bold text-slate-900">{vehicle.year}</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-slate-400" /> Odometer
                      </span>
                      <span className="font-bold text-slate-900">{vehicle.mileage.toLocaleString()} KM</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <span className="text-slate-500">Nomor Polisi</span>
                      <span className="font-mono font-bold text-slate-900">{vehicle.license_plate}</span>
                    </div>
                  </div>
                </div>

                {/* Features Badges */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Fitur Unggulan
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-blue-50/80 text-blue-800 text-xs font-medium border border-blue-100"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Calculation & Pricing Box */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0f2744] text-white p-5 rounded-2xl shadow-lg space-y-4">
                <div className="flex items-baseline justify-between border-b border-slate-700/80 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Tarif Harian</span>
                    <span className="text-2xl font-black text-blue-400">{formatCurrency(vehicle.price_per_day)}</span>
                    <span className="text-xs text-slate-400 ml-1">/ hari</span>
                  </div>
                  {startDate && endDate && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Estimasi {totalDays} Hari</span>
                      <span className="text-lg font-bold text-emerald-400">{formatCurrency(estimatedTotal)}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-300 flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Biaya sudah termasuk asuransi dasar & surat jalan resmi STNK aktif.</span>
                </div>

                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onProceedToBooking(vehicle)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                    isAvailable
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{isAvailable ? 'Lanjut Pesan Kendaraan Ini' : 'Unit Saat Ini Sedang Disewa'}</span>
                  {isAvailable && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

