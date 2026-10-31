import { Car, Shield, Truck, Compass, Sparkles } from 'lucide-react';
import type { VehicleCategory } from '../../types';

interface CategorySectionProps {
  categories: VehicleCategory[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function CategorySection({
  categories,
  activeCategory,
  onSelectCategory,
}: CategorySectionProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'suv':
        return <Compass className="w-6 h-6" />;
      case 'mpv':
        return <Car className="w-6 h-6" />;
      case 'city-car':
        return <Sparkles className="w-6 h-6" />;
      case 'sedan':
        return <Shield className="w-6 h-6" />;
      case 'van':
        return <Truck className="w-6 h-6" />;
      default:
        return <Car className="w-6 h-6" />;
    }
  };

  return (
    <section id="kategori" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Kategori Armada
          </span>
          <h2 className="text-3xl font-black text-[#0f2744] tracking-tight mt-3">
            Pilihan Kendaraan Sesuai Kebutuhan Anda
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Dari city car hemat lincah hingga SUV tangguh dan MPV keluarga lapang, temukan mobil yang paling pas.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`p-5 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-3 group cursor-pointer ${
                  isActive
                    ? 'bg-[#0f2744] border-[#0f2744] text-white shadow-lg shadow-slate-900/10 scale-102'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-[#0f2744] group-hover:bg-blue-50 group-hover:text-blue-600 shadow-xs'
                  }`}
                >
                  {getCategoryIcon(cat.slug)}
                </div>

                <div>
                  <h4 className="text-sm font-bold truncate max-w-[120px]">{cat.name}</h4>
                  <p className={`text-[11px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    Pilih Unit
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

