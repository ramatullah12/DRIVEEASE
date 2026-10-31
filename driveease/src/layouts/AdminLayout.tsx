import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Car,
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  RotateCcw,
  Wrench,
  FileBarChart,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function AdminLayout({ children, pageTitle = 'Dashboard Admin' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, switchRolePreview } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Data Kendaraan', path: '/admin/vehicles', icon: Car },
    { name: 'Data Pelanggan', path: '/admin/customers', icon: Users },
    { name: 'Manajemen Booking', path: '/admin/bookings', icon: CalendarCheck, badge: '5 Baru' },
    { name: 'Transaksi & Bayar', path: '/admin/payments', icon: CreditCard, badge: '3 DP' },
    { name: 'Pengembalian Mobil', path: '/admin/returns', icon: RotateCcw },
    { name: 'Servis & Maintenance', path: '/admin/maintenance', icon: Wrench },
    { name: 'Laporan & Ekspor', path: '/admin/reports', icon: FileBarChart },
  ];

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

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f2744] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Drive<span className="text-blue-400">Ease</span>
                </span>
                <span className="block text-[10px] text-blue-300 font-bold uppercase tracking-widest">
                  Admin Panel
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Mini Profile */}
          <div className="px-5 py-4 m-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'}
              alt={user?.name || 'Admin'}
              className="w-11 h-11 rounded-xl object-cover border border-slate-600"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin DriveEase'}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Administrator
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-white text-blue-700' : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-400" /> Kunjungi Homepage
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition text-left"
          >
            <LogOut className="w-4 h-4" /> Keluar Sesi Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar Header */}
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
                Pusat Kontrol Sistem Informasi Rental & Armada DriveEase
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Cari data sewa, mobil, customer..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium w-64 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

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
                onClick={() => { switchRolePreview('staff'); navigate('/staff/dashboard'); }}
                className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900"
              >
                Petugas
              </button>
              <button
                type="button"
                onClick={() => switchRolePreview('admin')}
                className="px-2 py-1 rounded-lg bg-white text-blue-600 shadow-xs font-bold"
              >
                Admin
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 relative transition cursor-pointer"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>

            {/* User Mini Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'}
                alt={user?.name || 'Admin'}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden xl:block text-left text-xs">
                <span className="font-bold text-slate-800 block">{user?.name}</span>
                <span className="text-slate-400">admin@driveease.com</span>
              </div>
            </div>

          </div>

        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

