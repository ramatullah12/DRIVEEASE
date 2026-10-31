import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../../services/mockData';

export default function TestimonialsSection() {
  return (
    <section id="testimoni" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Ulasan Pelanggan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2744] tracking-tight mt-3">
            Apa Kata Mereka Tentang DriveEase?
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Ribuan pelanggan setia mempercayakan mobilitas harian, liburan keluarga, dan perjalanan bisnis kepada armada kami.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-slate-200" />
                </div>

                <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Car Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0f2744] truncate">{t.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{t.role}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t.car}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

