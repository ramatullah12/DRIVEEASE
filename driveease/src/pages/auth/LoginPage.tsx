import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Car, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, UserCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await loginWithCredentials(email, password);
      if (result.success) {
        if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (result.role === 'staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg(result.message || 'Gagal masuk. Periksa kembali email dan password.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Demo Fill & Login
  const handleQuickDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg('');
    setIsLoading(true);

    const result = await loginWithCredentials(demoEmail, 'password123');
    setIsLoading(false);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Mini Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f2744] flex items-center justify-center text-white shadow-xs">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-[#0f2744] tracking-tight">
              Drive<span className="text-blue-600">Ease</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 space-y-6">
            
            {/* Title */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2744] tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="text-xs text-slate-500">
                Masuk ke akun DriveEase Anda untuk mengelola sewa & armada
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Untuk demo pengujian, silakan gunakan password default: password123');
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0f2744] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
                1-Klik Masuk Sebagai Akun Demo:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@driveease.com')}
                  className="py-2 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('petugas@driveease.com')}
                  className="py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Petugas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('customer@driveease.com')}
                  className="py-2 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[11px] font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>Customer</span>
                </button>
              </div>
            </div>

            {/* Bottom Register Link */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Belum punya akun penyewa?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Daftar Akun Baru
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 DriveEase. Dilindungi oleh proteksi sesi Sanctum dan enkripsi SSL 256-bit.
      </footer>
    </div>
  );
}

