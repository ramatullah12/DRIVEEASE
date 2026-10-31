import { ShieldCheck, Sparkles, Clock, Zap, Headphones, DollarSign } from 'lucide-react';

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: 'Armada Bersih & Higienis',
      desc: 'Setiap unit melewati proses pembersihan komprehensif, cuci steril, dan pengecekan bau sebelum serah terima ke tangan Anda.',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      title: 'Transparansi Biaya Penuh',
      desc: 'Harga sewa harian, uang muka, dan jaminan deposit transparan tanpa ada biaya siluman atau tambahan misterius di akhir.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: 'Serah Terima Digital Cepat',
      desc: 'Proses checklist fisik, pencatatan odometer, dan foto serah terima dilakukan lewat aplikasi petugas hanya dalam 10 menit.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      title: 'Asuransi All-Risk Terjamin',
      desc: 'Tenang berkendara kemana saja. Semua armada DriveEase terdaftar dalam asuransi resmi untuk memitigasi risiko di perjalanan.',
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      title: 'Servis Rutin Berkala',
      desc: 'Kondisi mesin, rem, ban, dan fluida selalu dipelihara teratur sesuai standar pabrikan di bengkel resmi terpercaya.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-rose-600" />,
      title: 'Bantuan Darurat 24/7',
      desc: 'Customer support dan tim derek jalanan siap mendampingi Anda kapan saja jika terjadi kendala tak terduga selama masa sewa.',
    },
  ];

  return (
    <section id="keunggulan" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Standar Kualitas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f2744] tracking-tight mt-3">
            Mengapa Memilih DriveEase?
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Kami menghadirkan pengalaman rental mobil profesional dengan integrasi teknologi modern untuk kenyamanan dan keamanan Anda.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 border border-slate-100">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0f2744] mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

