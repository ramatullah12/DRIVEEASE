import { useState, useMemo, useRef } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/customer/HeroSection';
import SearchFilterWidget, { type FilterState } from '../../components/customer/SearchFilterWidget';
import CategorySection from '../../components/customer/CategorySection';
import VehicleCard from '../../components/customer/VehicleCard';
import VehicleDetailModal from '../../components/customer/VehicleDetailModal';
import QuickBookingModal from '../../components/customer/QuickBookingModal';
import WhyChooseUsSection from '../../components/customer/WhyChooseUsSection';
import HowItWorksSection from '../../components/customer/HowItWorksSection';
import TestimonialsSection from '../../components/customer/TestimonialsSection';
import { MOCK_VEHICLES, MOCK_CATEGORIES } from '../../services/mockData';
import type { Vehicle } from '../../types';
import { SearchX, PhoneCall, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const catalogRef = useRef<HTMLDivElement>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    transmission: 'all',
    capacity: 'all',
    maxPrice: 1500000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  // Modals State
  const [selectedVehicleForDetail, setSelectedVehicleForDetail] = useState<Vehicle | null>(null);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      transmission: 'all',
      capacity: 'all',
      maxPrice: 1500000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (categorySlug: string) => {
    setFilters((prev) => ({
      ...prev,
      category: categorySlug,
    }));
    handleScrollToCatalog();
  };

  // Filter Logic
  const filteredVehicles = useMemo(() => {
    return MOCK_VEHICLES.filter((v) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesBrand = v.brand.toLowerCase().includes(query);
        const matchesPlate = v.license_plate.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesPlate) return false;
      }

      // 2. Category
      if (filters.category && filters.category !== 'all') {
        const catObj = MOCK_CATEGORIES.find((c) => c.slug === filters.category);
        if (catObj && v.category_id !== catObj.id) return false;
      }

      // 3. Transmission
      if (filters.transmission && filters.transmission !== 'all') {
        if (v.transmission !== filters.transmission) return false;
      }

      // 4. Capacity
      if (filters.capacity && filters.capacity !== 'all') {
        if (filters.capacity === '4-5' && v.passenger_capacity > 5) return false;
        if (filters.capacity === '7' && v.passenger_capacity !== 7) return false;
        if (filters.capacity === '8+' && v.passenger_capacity < 8) return false;
      }

      // 5. Max Price
      if (v.price_per_day > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection onExploreClick={handleScrollToCatalog} />

        {/* 2. Floating Search & Filter Widget Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchFilterWidget
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            categories={MOCK_CATEGORIES}
          />
        </div>

        {/* 3. Category Selector Section */}
        <CategorySection
          categories={MOCK_CATEGORIES}
          activeCategory={filters.category}
          onSelectCategory={handleCategorySelect}
        />

        {/* 4. Vehicles Catalog Section */}
        <section ref={catalogRef} id="katalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Katalog Unit
              </span>
              <h2 className="text-3xl font-black text-[#0f2744] tracking-tight mt-2">
                Daftar Armada Siap Sewa
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan <strong className="text-slate-800">{filteredVehicles.length}</strong> pilihan mobil dari total {MOCK_VEHICLES.length} unit
              </p>
            </div>

            {/* Quick Status Info */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Unit diinspeksi rutin sebelum serah terima</span>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onViewDetail={(v) => setSelectedVehicleForDetail(v)}
                  onBookNow={(v) => setSelectedVehicleForBooking(v)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Tidak Menemukan Kendaraan</h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Tidak ada unit armada yang cocok dengan filter pencarian Anda. Silakan ubah filter atau reset pencarian.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>

        {/* 5. Why Choose Us Section */}
        <WhyChooseUsSection />

        {/* 6. How It Works Section */}
        <HowItWorksSection />

        {/* 7. Testimonials Section */}
        <TestimonialsSection />

        {/* 8. Call To Action Banner */}
        <section className="py-16 bg-[#0f2744] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Jaminan Kenyamanan Perjalanan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
              Siap Menjelajahi Destinasi Anda Bersama DriveEase?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Reservasi sekarang dalam hitungan menit. Dapatkan promo potongan tarif untuk durasi sewa mingguan dan bulanan.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleScrollToCatalog}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                Pilih Mobil Sekarang
              </button>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" /> Konsultasi via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Vehicle Detail Modal */}
      {selectedVehicleForDetail && (
        <VehicleDetailModal
          vehicle={selectedVehicleForDetail}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onClose={() => setSelectedVehicleForDetail(null)}
          onProceedToBooking={(vehicle) => {
            setSelectedVehicleForDetail(null);
            setSelectedVehicleForBooking(vehicle);
          }}
        />
      )}

      {/* Quick Booking Modal */}
      {selectedVehicleForBooking && (
        <QuickBookingModal
          vehicle={selectedVehicleForBooking}
          initialStartDate={filters.startDate}
          initialEndDate={filters.endDate}
          onClose={() => setSelectedVehicleForBooking(null)}
        />
      )}
    </div>
  );
}
