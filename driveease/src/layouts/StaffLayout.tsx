import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Car,
  UserCheck,
  CalendarCheck,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
} from 'lucide-react';

interface StaffLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function StaffLayout({ children, pageTitle = 'Dashboard Petugas Rental' }: StaffLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, switchRolePreview } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Petugas */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a192f] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Drive<span className="text-emerald-400">Ease</span>
                </span>
                <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-widest">
                  Staff Operations
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mini Profile Petugas */}
          <div className="px-5 py-4 m-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'}
              alt={user?.name || 'Petugas'}
              className="w-11 h-11 rounded-xl object-cover border border-slate-600"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Rudi Pratama'}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Petugas Serah Terima
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <nav className="px-3 space-y-1 mt-2 text-sm font-semibold">
            <Link
              to="/staff/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Operasional Serah Terima</span>
            </Link>

            <Link
              to="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Car className="w-5 h-5 text-slate-400" />
              <span>Beralih ke Admin Panel</span>
            </Link>
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" /> Halaman Utama Publik
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition text-left"
          >
            <LogOut className="w-4 h-4" /> Keluar Sesi Petugas
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-xl font-black text-[#0f2744] tracking-tight">{pageTitle}</h1>
              <p className="hidden sm:block text-xs text-slate-400 font-medium">
                Pusat Serah Terima, Pemeriksaan Fisik & Inspeksi Pengembalian Armada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Role Tester Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
              <span className="px-2 text-slate-400 text-[10px] uppercase">Mode Uji:</span>
              <button
                type="button"
                onClick={() => { switchRolePreview('customer'); navigate('/'); }}
                className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                Cust
              </button>
              <button
                type="button"
                onClick={() => switchRolePreview('staff')}
                className="px-2 py-1 rounded-lg bg-white text-emerald-600 shadow-xs font-bold"
              >
                Petugas
              </button>
              <button
                type="button"
                onClick={() => { switchRolePreview('admin'); navigate('/admin/dashboard'); }}
                className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                Admin
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 relative transition cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </button>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'}
                alt={user?.name || 'Petugas'}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden xl:block text-left text-xs">
                <span className="font-bold text-slate-800 block">{user?.name}</span>
                <span className="text-emerald-600 font-semibold">Petugas Lapangan</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
