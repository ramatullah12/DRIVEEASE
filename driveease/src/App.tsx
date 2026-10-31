import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Car, ShieldCheck, CheckCircle2, UserCheck, Wrench, ArrowRight } from 'lucide-react';

function InitialWelcome() {
  const { user, switchRolePreview } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-[#0f2744] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">Drive<span className="text-blue-400">Ease</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-300 font-normal">Sistem Informasi Rental & Armada</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-300">Mode Uji:</span>
            <button
              onClick={() => switchRolePreview('customer')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                user?.role === 'customer' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => switchRolePreview('staff')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                user?.role === 'staff' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Petugas
            </button>
            <button
              onClick={() => switchRolePreview('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                user?.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
            <CheckCircle2 className="w-4 h-4" /> Tahap 1 Selesai: Konfigurasi & Inisialisasi Berhasil
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f2744] tracking-tight">
            DriveEase - Sistem Informasi Rental Kendaraan & Manajemen Armada
          </h1>
          <p className="mt-2 text-slate-600 text-base max-w-3xl">
            Aplikasi telah dikonfigurasi dengan React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM,
            Axios, Lucide React, dan Recharts sesuai arsitektur spesifikasi profesional.
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">Pengguna Aktif:</span> {user?.name} ({user?.role?.toUpperCase()})
            </div>
            <div>•</div>
            <div>
              <span className="font-semibold text-slate-900">Email:</span> {user?.email}
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Portal Customer</h3>
            <p className="text-sm text-slate-600 mb-4">
              Katalog kendaraan modern, pencarian cerdas, filter spesifikasi, kalkulasi biaya otomatis, dan upload bukti bayar.
            </p>
            <div className="inline-flex items-center text-sm font-semibold text-blue-600">
              Disiapkan untuk Tahap 2 <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dashboard Petugas Rental</h3>
            <p className="text-sm text-slate-600 mb-4">
              Jadwal serah terima, checklist fisik kendaraan, pencatatan kilometer awal/akhir, dan inspeksi pengembalian.
            </p>
            <div className="inline-flex items-center text-sm font-semibold text-emerald-600">
              Disiapkan untuk Tahap 9 <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dashboard Administrator</h3>
            <p className="text-sm text-slate-600 mb-4">
              Manajemen armada, pelanggan, persetujuan booking, verifikasi pembayaran, maintenance, dan laporan PDF/Excel.
            </p>
            <div className="inline-flex items-center text-sm font-semibold text-indigo-600">
              Disiapkan untuk Tahap 4 & 5 <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Tech Stack Checklist */}
        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" /> Spesifikasi Fondasi Frontend Telah Terpasang:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>React 19 & TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tailwind CSS v4</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>React Router DOM v7</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lucide React Icons</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Axios API Client</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Recharts Charting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Vercel SPA Config</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Environment (.env)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          © 2026 DriveEase. Sistem Informasi Rental Kendaraan & Manajemen Armada. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<InitialWelcome />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
