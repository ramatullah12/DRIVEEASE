import { Car, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0a192f] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Drive<span className="text-blue-400">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sistem informasi rental kendaraan modern dan manajemen armada terintegrasi. Menyediakan armada berkualitas prima, transparan, higienis, serta proses serah terima cepat tanpa ribet.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Asuransi All-Risk
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                <Clock className="w-4 h-4 text-sky-400" /> Bantuan 24/7
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#katalog" className="hover:text-white transition">Katalog Kendaraan</a></li>
              <li><a href="#kategori" className="hover:text-white transition">Pilihan Kategori</a></li>
              <li><a href="#cara-sewa" className="hover:text-white transition">Prosedur Rental</a></li>
              <li><a href="#keunggulan" className="hover:text-white transition">Keunggulan Layanan</a></li>
              <li><a href="#testimoni" className="hover:text-white transition">Testimoni Klien</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Armada Favorit</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#katalog" className="hover:text-white transition">SUV Premium (Fortuner, Pajero)</a></li>
              <li><a href="#katalog" className="hover:text-white transition">MPV Keluarga (Innova Zenix)</a></li>
              <li><a href="#katalog" className="hover:text-white transition">City Car Irit (Brio RS)</a></li>
              <li><a href="#katalog" className="hover:text-white transition">Sedan Eksekutif VIP (Camry)</a></li>
              <li><a href="#katalog" className="hover:text-white transition">Minivan Rombongan (HiAce)</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Jl. Sudirman No. 88, Kawasan Bisnis Jakarta Pusat</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+62 (021) 555-8900</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>layanan@driveease.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Buka Setiap Hari: 06.00 - 23.00 WIB</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DriveEase Inc. Sistem Informasi Rental Kendaraan & Manajemen Armada.</p>
          <p className="flex items-center gap-1">
            Dirancang dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk kenyamanan perjalanan Anda.
          </p>
        </div>
      </div>
    </footer>
  );
}

