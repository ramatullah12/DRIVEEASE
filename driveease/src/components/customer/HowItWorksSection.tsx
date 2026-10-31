import { Search, CalendarCheck, CreditCard, KeyRound } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Pilih Mobil',
      desc: 'Jelajahi armada kami, gunakan filter kategori, transmisi, dan harga sesuai preferensi Anda.',
      icon: <Search className="w-6 h-6 text-blue-600" />,
    },
    {
      step: '02',
      title: 'Tentukan Tanggal & Dokumen',
      desc: 'Pilih rentang tanggal mulai dan selesai. Isi data identitas KTP & SIM A untuk verifikasi keamanan.',
      icon: <CalendarCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '03',
      title: 'Verifikasi & Pembayaran',
      desc: 'Admin memverifikasi pesanan. Lakukan pembayaran uang muka (DP) melalui Transfer Bank atau QRIS resmi.',
      icon: <CreditCard className="w-6 h-6 text-amber-600" />,
    },
    {
      step: '04',
      title: 'Serah Terima Kunci',
      desc: 'Petugas melakukan inspeksi fisik digital, serah terima kunci & STNK, dan mobil siap menemani perjalanan Anda.',
      icon: <KeyRound className="w-6 h-6 text-sky-600" />,
    },
  ];

  return (
    <section id="cara-sewa" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Alur Praktis
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2744] tracking-tight mt-3">
            Cara Sewa Mobil di DriveEase
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Hanya butuh 4 langkah mudah untuk mendapatkan mobil berkualitas prima tanpa proses birokrasi berbelit.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:bg-blue-50 transition">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition font-mono">
                  {item.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0f2744] mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

