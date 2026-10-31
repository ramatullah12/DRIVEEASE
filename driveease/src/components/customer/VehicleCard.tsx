import { Users, Fuel, Sparkles, Check, ArrowRight } from 'lucide-react';
import type { Vehicle } from '../../types';
import { formatCurrency, getStatusBadge } from '../../utils/format';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetail: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onViewDetail, onBookNow }: VehicleCardProps) {
  const statusInfo = getStatusBadge(vehicle.status);
  const isAvailable = vehicle.status === 'available';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      
      {/* Image & Badges */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={vehicle.image_url}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
            {vehicle.category_name || 'Kendaraan'}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-xs shadow-xs ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Plate Number & Year Indicator on bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded font-mono">
            {vehicle.license_plate}
          </span>
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            Tahun {vehicle.year}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Brand */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-[#0f2744] group-hover:text-blue-600 transition-colors line-clamp-1">
              {vehicle.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{vehicle.model_type}</p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4 bg-slate-50/60 rounded-xl px-2">
            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Transmisi</span>
              <span className="font-bold text-slate-800 capitalize mt-0.5">
                {vehicle.transmission === 'automatic' ? 'Matic' : 'Manual'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200/80">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-0.5">
                <Users className="w-3 h-3" /> Kapasitas
              </span>
              <span className="font-bold text-slate-800 mt-0.5">
                {vehicle.passenger_capacity} Kursi
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-0.5">
                <Fuel className="w-3 h-3" /> Bahan Bakar
              </span>
              <span className="font-bold text-slate-800 capitalize mt-0.5">
                {vehicle.fuel_type}
              </span>
            </div>
          </div>

          {/* Key Features preview */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 truncate">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{vehicle.features.slice(0, 2).join(' • ')}</span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Harga Sewa:</span>
              <span className="text-xl font-black text-blue-600">
                {formatCurrency(vehicle.price_per_day)}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ hari</span>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" /> Siap Jalan
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onViewDetail(vehicle)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
            >
              Detail Unit
            </button>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => onBookNow(vehicle)}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition shadow-xs cursor-pointer ${
                isAvailable
                  ? 'bg-[#0f2744] hover:bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Sewa Sekarang' : 'Sedang Disewa'}</span>
              {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

