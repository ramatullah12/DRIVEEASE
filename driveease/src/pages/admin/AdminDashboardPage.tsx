import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Car,
  CheckCircle2,
  Clock,
  Wrench,
  Users,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Plus,
  CreditCard,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

const REVENUE_DATA = [
  { month: 'Jan', pendapatan: 94000000, rental: 68 },
  { month: 'Feb', pendapatan: 108000000, rental: 74 },
  { month: 'Mar', pendapatan: 125000000, rental: 89 },
  { month: 'Apr', pendapatan: 142000000, rental: 104 },
  { month: 'Mei', pendapatan: 138000000, rental: 98 },
  { month: 'Jun', pendapatan: 156000000, rental: 112 },
  { month: 'Jul', pendapatan: 168000000, rental: 124 },
  { month: 'Ags', pendapatan: 160000000, rental: 118 },
  { month: 'Sep', pendapatan: 172000000, rental: 129 },
  { month: 'Okt', pendapatan: 184500000, rental: 138 },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'booking',
    code: 'DRV-202610-8912',
    user: 'Budi Santoso',
    vehicle: 'Toyota Fortuner GR Sport (B 1982 EAZ)',
    amount: 2550000,
    time: '10 menit yang lalu',
    status: 'Menunggu Verifikasi',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 2,
    type: 'payment',
    code: 'PAY-88219',
    user: 'Siti Rahmawati',
    vehicle: 'Toyota Innova Zenix Hybrid (B 1567 KZN)',
    amount: 700000,
    time: '35 menit yang lalu',
    status: 'DP Terverifikasi',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 3,
    type: 'handover',
    code: 'HND-44102',
    user: 'Hendrawan Kusuma',
    vehicle: 'Mitsubishi Pajero Sport (B 2341 DRS)',
    amount: 1600000,
    time: '2 jam yang lalu',
    status: 'Unit Diserahkan',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 4,
    type: 'return',
    code: 'RTN-99014',
    user: 'Dr. Dimas Anggoro',
    vehicle: 'Toyota Camry 2.5 V (B 1 VIP)',
    amount: 2400000,
    time: '4 jam yang lalu',
    status: 'Pengembalian Selesai',
    statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 5,
    type: 'maintenance',
    code: 'MNT-1092',
    user: 'Bengkel Resmi Toyota Sudirman',
    vehicle: 'Toyota Avanza 1.5 G (B 4120 AVZ)',
    amount: 650000,
    time: 'Kemarin',
    status: 'Perawatan Rutin',
    statusColor: 'bg-orange-50 text-orange-700 border-orange-200',
  },
];

export default function AdminDashboardPage() {
  const [chartView, setChartView] = useState<'area' | 'bar'>('area');

  return (
    <AdminLayout pageTitle="Dashboard Utama Administrator">
      
      {/* 1. Quick Welcome & Action Bar */}
      <div className="bg-gradient-to-r from-[#0f2744] to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Ringkasan Operasional & Finansial Real-time
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Datang di DriveEase Command Center
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Pantau pergerakan armada kendaraan, persetujuan reservasi masuk, alur keuangan, dan kesiapan unit rental hari ini secara terpadu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/vehicles"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Mobil
          </Link>
          <Link
            to="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" /> Periksa Booking
          </Link>
        </div>
      </div>

      {/* 2. Key Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Kendaraan */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Armada</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0f2744] flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900">28</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Seluruh unit siap dalam sistem</p>
        </div>

        {/* Kendaraan Tersedia */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unit Tersedia</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-emerald-600">18</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              64.2% Kapasitas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Siap disewa kapan saja</p>
        </div>

        {/* Kendaraan Sedang Disewa */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sedang Disewa</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-blue-600">7</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              25% Utilisasi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Sedang digunakan pelanggan</p>
        </div>

        {/* Kendaraan Maintenance */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Perawatan / Servis</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-amber-600">3</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
              10.8% Di Bengkel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Perawatan berkala bengkel resmi</p>
        </div>

      </div>

      {/* 3. Secondary Metrics: Pelanggan, Booking, Total Pendapatan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Pelanggan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Pelanggan Terdaftar
            </span>
            <h3 className="text-2xl font-black text-slate-900">1.420</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +28 pelanggan bulan ini
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Total Booking */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Transaksi Booking
            </span>
            <h3 className="text-2xl font-black text-slate-900">138</h3>
            <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 18 booking aktif berjalan
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CalendarCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Total Pendapatan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Pendapatan Bulan Ini
            </span>
            <h3 className="text-2xl font-black text-blue-600">{formatCurrency(184500000)}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs bulan sebelumnya
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* 4. Chart Section & Fleet Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Chart Column: Pendapatan Bulanan */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Tren Finansial
              </span>
              <h3 className="text-xl font-black text-[#0f2744] tracking-tight mt-2">
                Grafik Pendapatan Bulanan (2026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Akumulasi pemasukan sewa kendaraan dan uang muka periode Januari - Oktober
              </p>
            </div>

            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => setChartView('area')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartView === 'area'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Area Chart
              </button>
              <button
                type="button"
                onClick={() => setChartView('bar')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartView === 'bar'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'area' ? (
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Pendapatan']}
                    labelFormatter={(label) => `Bulan: ${label} 2026`}
                    contentStyle={{
                      backgroundColor: '#0f2744',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pendapatan"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Pendapatan']}
                    labelFormatter={(label) => `Bulan: ${label} 2026`}
                    contentStyle={{
                      backgroundColor: '#0f2744',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="pendapatan" fill="#0f2744" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Distribution & Quick Stats Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Breakdown Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-[#0f2744]">Distribusi Status Unit</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Siap Sewa (Tersedia)
                  </span>
                  <span className="text-slate-900 font-bold">18 Unit (64%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Sedang Disewa
                  </span>
                  <span className="text-slate-900 font-bold">7 Unit (25%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Servis / Perbaikan
                  </span>
                  <span className="text-slate-900 font-bold">3 Unit (11%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '11%' }} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/admin/vehicles"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Kelola Status Seluruh Armada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Maintenance Notice Card */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h5 className="text-sm font-bold">Peringatan Servis Berkala</h5>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              2 kendaraan (Toyota Avanza & Honda CR-V) telah mendekati ambang batas kilometer servis 5.000 KM.
            </p>
            <Link
              to="/admin/maintenance"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
            >
              Jadwalkan Servis Bengkel <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* 5. Recent Activities Modern Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#0f2744]">Aktivitas & Transaksi Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar kegiatan pemesanan, pembayaran, dan serah terima unit secara real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/bookings"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Lihat Semua Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Kode & Pelanggan</th>
                <th className="py-3.5 px-6">Unit Mobil</th>
                <th className="py-3.5 px-6">Nominal Transaksi</th>
                <th className="py-3.5 px-6">Status Aktivitas</th>
                <th className="py-3.5 px-6">Waktu</th>
                <th className="py-3.5 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_ACTIVITIES.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-blue-600 block">{act.code}</span>
                    <span className="font-semibold text-slate-800">{act.user}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {act.vehicle}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {formatCurrency(act.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${act.statusColor}`}
                    >
                      {act.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {act.time}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Membuka rincian aktivitas: ${act.code}`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold transition text-[11px]"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </AdminLayout>
  );
}
