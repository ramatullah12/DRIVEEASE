import { ShieldCheck, Sparkles, Award, ArrowRight, Zap } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0f2744] via-[#102d4f] to-[#0a192f] text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background Glow Decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Solusi Rental Kendaraan & Armada Modern No. 1
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Sewa Kendaraan Nyaman, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Aman & Terpercaya
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Nikmati kebebasan bepergian dengan armada mobil keluaran terbaru yang selalu higienis, terawat berkala di bengkel resmi, tanpa biaya tersembunyi, serta inspeksi digital serah terima transparan.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Cari & Sewa Mobil Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="#cara-sewa"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                Pelajari Prosedur
              </a>
            </div>

            {/* Micro Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">50+</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Unit Armada Siap Jalan</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Asuransi Komprehensif</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">4.9 / 5</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Review Kepuasan Klien</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Car Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Highlight Badge Card */}
              <div className="absolute -top-4 -left-4 z-20 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Kondisi Terverifikasi</p>
                  <p className="text-sm font-bold text-slate-900">100% Layak Jalan</p>
                </div>
              </div>

              {/* Main Visual Box */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/90 backdrop-blur-md p-3">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=900"
                  alt="DriveEase Armada Unggulan"
                  className="w-full h-72 sm:h-80 object-cover rounded-2xl"
                />

                <div className="p-4 bg-slate-900/90 rounded-2xl mt-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Armada Paling Diminati</span>
                    <h4 className="text-base font-bold text-white">Toyota Fortuner GR Sport 2024</h4>
                    <p className="text-xs text-slate-400">Mulai dari Rp 850.000 / hari</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <Zap className="w-3.5 h-3.5" /> Unit Siap
                  </div>
                </div>
              </div>

              {/* Floating Bottom Badge */}
              <div className="absolute -bottom-5 -right-4 z-20 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Pelayanan</p>
                  <p className="text-sm font-bold text-slate-900">Serah Terima &lt; 15 Mnt</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

