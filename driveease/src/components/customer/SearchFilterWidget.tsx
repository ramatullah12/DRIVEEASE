import { useState } from 'react';
import { Search, Calendar, Users, SlidersHorizontal, RotateCcw, Shield } from 'lucide-react';
import type { TransmissionType } from '../../types';
import { calculateDays, formatCurrency } from '../../utils/format';

export interface FilterState {
  searchQuery: string;
  category: string;
  transmission: string;
  capacity: string;
  maxPrice: number;
  startDate: string;
  endDate: string;
}

interface SearchFilterWidgetProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: { id: string | number; name: string; slug: string }[];
}

export default function SearchFilterWidget({
  filters,
  onFilterChange,
  onReset,
  categories,
}: SearchFilterWidgetProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStartDateChange = (date: string) => {
    let nextEndDate = filters.endDate;
    if (filters.endDate && new Date(date) > new Date(filters.endDate)) {
      nextEndDate = date;
    }
    onFilterChange({
      ...filters,
      startDate: date,
      endDate: nextEndDate,
    });
  };

  const handleEndDateChange = (date: string) => {
    onFilterChange({
      ...filters,
      endDate: date,
    });
  };

  const rentalDays = calculateDays(filters.startDate, filters.endDate);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-7 -mt-12 relative z-20 transition-all">
      <div className="flex flex-col gap-5">
        
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search by Car Name / Brand */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cari Nama / Merek Mobil
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: Fortuner, Zenix, Avanza..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Rental Start Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Mulai Rental</span>
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={filters.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Rental End Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Selesai Rental</span>
              {filters.startDate && filters.endDate && (
                <span className="text-blue-600 font-extrabold text-[11px] bg-blue-50 px-2 py-0.5 rounded">
                  {rentalDays} Hari
                </span>
              )}
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={filters.endDate}
                min={filters.startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Advanced Filter Toggle & Reset Buttons */}
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex-1 py-3 px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                showAdvanced
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Reset Filter"
              className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Kategori Mobil
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Transmisi
              </label>
              <select
                value={filters.transmission}
                onChange={(e) => onFilterChange({ ...filters, transmission: e.target.value as TransmissionType | 'all' })}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Transmisi</option>
                <option value="automatic">Automatic (AT / CVT)</option>
                <option value="manual">Manual (MT)</option>
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Kapasitas Penumpang
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => onFilterChange({ ...filters, capacity: e.target.value })}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kapasitas</option>
                <option value="4-5">4 - 5 Kursi (City Car & Sedan)</option>
                <option value="7">7 Kursi (MPV & SUV)</option>
                <option value="8+">&gt; 7 Kursi (Minivan / Commuter)</option>
              </select>
            </div>

            {/* Price Budget Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>Harga Maksimal / Hari</span>
                <span className="text-blue-600 font-bold">{formatCurrency(filters.maxPrice)}</span>
              </div>
              <input
                type="range"
                min="300000"
                max="1500000"
                step="50000"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
            </div>

          </div>
        )}

        {/* Quick Features Assurance */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> Bebas biaya pembatalan hingga 24 jam sebelum jadwal
          </span>
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setShowAdvanced(true)}>
            Butuh unit khusus untuk korporat atau sewa bulanan? Hubungi Kami
          </span>
        </div>

      </div>
    </div>
  );
}

