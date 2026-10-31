import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Car, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, switchRolePreview, isAdmin, isStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isStaff) return '/staff/dashboard';
    return '/customer/profile';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0f2744] to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#0f2744] tracking-tight">
                Drive<span className="text-blue-600">Ease</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Fleet & Rental System</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#katalog" className="hover:text-blue-600 transition-colors">Armada Mobil</a>
            <a href="#kategori" className="hover:text-blue-600 transition-colors">Kategori</a>
            <a href="#keunggulan" className="hover:text-blue-600 transition-colors">Keunggulan</a>
            <a href="#cara-sewa" className="hover:text-blue-600 transition-colors">Cara Sewa</a>
            <a href="#testimoni" className="hover:text-blue-600 transition-colors">Testimoni</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Quick Persona Tester (For Reviewing All Roles) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <span className="px-2 text-slate-500">Role:</span>
              <button
                type="button"
                onClick={() => switchRolePreview('customer')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  user?.role === 'customer'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => switchRolePreview('staff')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  user?.role === 'staff'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Petugas
              </button>
              <button
                type="button"
                onClick={() => switchRolePreview('admin')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  user?.role === 'admin'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* User Account / Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 transition bg-slate-50"
                >
                  <span className="text-sm font-semibold text-[#0f2744] max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Masuk Sebagai</p>
                      <p className="text-sm font-bold text-[#0f2744] truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      Dashboard {user.role === 'customer' ? 'Saya' : user.role === 'admin' ? 'Admin' : 'Petugas'}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#0f2744] hover:text-blue-600 transition"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-[#0f2744] hover:bg-blue-900 text-white text-sm font-bold shadow-md shadow-slate-900/10 transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-600 px-2">
              <a
                href="#katalog"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Armada Mobil
              </a>
              <a
                href="#kategori"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Kategori
              </a>
              <a
                href="#keunggulan"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Keunggulan
              </a>
              <a
                href="#cara-sewa"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Cara Sewa
              </a>
              <a
                href="#testimoni"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50"
              >
                Testimoni
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 px-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-xl">
                <span>Pilih Mode Uji:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => { switchRolePreview('customer'); setMobileMenuOpen(false); }}
                    className={`px-2 py-1 rounded text-xs ${user?.role === 'customer' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                  >
                    Cust
                  </button>
                  <button
                    onClick={() => { switchRolePreview('staff'); setMobileMenuOpen(false); }}
                    className={`px-2 py-1 rounded text-xs ${user?.role === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                  >
                    Petugas
                  </button>
                  <button
                    onClick={() => { switchRolePreview('admin'); setMobileMenuOpen(false); }}
                    className={`px-2 py-1 rounded text-xs ${user?.role === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Buka Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-bold hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-[#0f2744] text-sm font-bold"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-[#0f2744] text-white text-sm font-bold"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
