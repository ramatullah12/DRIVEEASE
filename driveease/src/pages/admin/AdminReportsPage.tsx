import { useState, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  FileSpreadsheet,
  Printer,
  CalendarCheck,
  CreditCard,
  Car,
  Users,
  Clock,
  Wrench,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import { exportToCSV, triggerPrintReport } from '../../utils/exportHelpers';
import { getStoredBookings } from '../../services/bookingStorage';
import { getStoredPayments } from '../../services/paymentStorage';
import { getStoredVehicles } from '../../services/vehicleStorage';
import { getStoredCustomers } from '../../services/customerStorage';
import { getStoredReturns, getStoredMaintenance } from '../../services/returnMaintenanceStorage';

type ReportCategory = 'bookings' | 'revenue' | 'vehicles' | 'customers' | 'delays' | 'maintenance';

export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportCategory>('bookings');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-11-30');

  // Load stores
  const bookings = useMemo(() => getStoredBookings(), []);
  const payments = useMemo(() => getStoredPayments(), []);
  const vehicles = useMemo(() => getStoredVehicles(), []);
  const customers = useMemo(() => getStoredCustomers(), []);
  const returns = useMemo(() => getStoredReturns(), []);
  const maintenance = useMemo(() => getStoredMaintenance(), []);

  // 1. Laporan Penyewaan
  const bookingsReportData = useMemo(() => {
    return bookings.map((b) => ({
      'Kode Booking': b.booking_code,
      'Nama Pelanggan': b.customer_name,
      'No HP': b.customer_phone || '-',
      'Kendaraan': b.vehicle?.name || '-',
      'Nomor Polisi': b.vehicle?.license_plate || '-',
      'Tanggal Mulai': b.start_date,
      'Tanggal Selesai': b.end_date,
      'Total Hari': b.total_days,
      'Tarif Harian': b.daily_rate,
      'Subtotal': b.subtotal,
      'Deposit': b.deposit_amount,
      'Total Tagihan': b.total_amount,
      'Status Booking': b.status,
      'Status Bayar': b.payment_status,
    }));
  }, [bookings]);

  // 2. Laporan Pendapatan
  const revenueReportData = useMemo(() => {
    return payments.map((p) => ({
      'No Referensi': p.transaction_ref || '-',
      'Kode Booking': p.booking_code || '-',
      'Pelanggan': p.customer_name || '-',
      'Jenis Pembayaran': p.payment_type,
      'Metode Bayar': p.payment_method,
      'Bank / Kasir': p.bank_name || '-',
      'Nominal (Rp)': p.amount,
      'Status Verifikasi': p.payment_status,
      'Tanggal Transaksi': p.created_at,
      'Verifikator': p.verified_by || '-',
    }));
  }, [payments]);

  // 3. Laporan Armada Kendaraan
  const vehiclesReportData = useMemo(() => {
    return vehicles.map((v) => ({
      'Nama Kendaraan': v.name,
      'Merek': v.brand,
      'Tipe / Model': v.model_type,
      'Kategori': v.category_name || 'SUV',
      'Nomor Polisi': v.license_plate,
      'Tahun': v.year,
      'Transmisi': v.transmission,
      'Kapasitas': `${v.passenger_capacity} Kursi`,
      'Bahan Bakar': v.fuel_type,
      'Tarif Sewa / Hari': v.price_per_day,
      'Odometer (KM)': v.mileage,
      'Status Ketersediaan': v.status,
    }));
  }, [vehicles]);

  // 4. Laporan Pelanggan
  const customersReportData = useMemo(() => {
    return customers.map((c) => ({
      'Nama Lengkap': c.name,
      'NIK KTP': c.nik,
      'Nomor SIM A': c.sim_number,
      'Email': c.email,
      'No Telepon / WA': c.phone,
      'Alamat Domisili': c.address,
      'Status Verifikasi': c.verified_status,
      'Total Riwayat Sewa': `${c.rental_history?.length || 0} Kali`,
      'Tanggal Registrasi': c.registered_at,
    }));
  }, [customers]);

  // 5. Laporan Keterlambatan & Denda
  const delaysReportData = useMemo(() => {
    return returns.map((r) => ({
      'ID Pengembalian': `RTN-00${r.id}`,
      'Booking ID': `#${r.booking_id}`,
      'Jadwal Kembali': r.return_date,
      'Aktual Kembali': r.actual_return_date,
      'Keterlambatan (Jam)': r.late_hours,
      'Denda Telat': r.late_fee,
      'Denda Kurang BBM': r.fuel_charge,
      'Denda Kerusakan': r.damage_fee,
      'Total Denda (Rp)': r.total_penalty,
      'Odometer Akhir': `${r.end_mileage} KM`,
      'Kondisi Fisik': r.status,
      'Catatan': r.damage_notes || '-',
    }));
  }, [returns]);

  // 6. Laporan Maintenance Bengkel
  const maintenanceReportData = useMemo(() => {
    return maintenance.map((m) => ({
      'Mobil': m.vehicle_name || '-',
      'Nomor Polisi': m.license_plate || '-',
      'Jenis Perawatan': m.service_type,
      'Tanggal Servis': m.service_date,
      'Nama Bengkel': m.workshop_name,
      'Biaya Servis (Rp)': m.cost,
      'Odometer Servis': `${m.odometer_at_service} KM`,
      'Target Servis Berikutnya': m.next_service_mileage ? `${m.next_service_mileage} KM` : '-',
      'Status Pengerjaan': m.status,
      'Rincian Pekerjaan': m.description,
    }));
  }, [maintenance]);

  // Current active dataset
  const activeDataset = useMemo(() => {
    switch (selectedReport) {
      case 'bookings':
        return { title: 'Laporan_Penyewaan_DriveEase', data: bookingsReportData, count: bookings.length };
      case 'revenue':
        return { title: 'Laporan_Pendapatan_DriveEase', data: revenueReportData, count: payments.length };
      case 'vehicles':
        return { title: 'Laporan_Armada_Kendaraan_DriveEase', data: vehiclesReportData, count: vehicles.length };
      case 'customers':
        return { title: 'Laporan_Data_Pelanggan_DriveEase', data: customersReportData, count: customers.length };
      case 'delays':
        return { title: 'Laporan_Keterlambatan_Denda_DriveEase', data: delaysReportData, count: returns.length };
      case 'maintenance':
        return { title: 'Laporan_Perawatan_Bengkel_DriveEase', data: maintenanceReportData, count: maintenance.length };
      default:
        return { title: 'Laporan_DriveEase', data: bookingsReportData, count: bookings.length };
    }
  }, [
    selectedReport,
    bookingsReportData,
    revenueReportData,
    vehiclesReportData,
    customersReportData,
    delaysReportData,
    maintenanceReportData,
    bookings.length,
    payments.length,
    vehicles.length,
    customers.length,
    returns.length,
    maintenance.length,
  ]);

  const handleExportExcel = () => {
    exportToCSV(activeDataset.data, activeDataset.title);
  };

  const handlePrintPDF = () => {
    triggerPrintReport();
  };

  return (
    <AdminLayout pageTitle="Pusat Laporan & Ekspor Dokumen">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Laporan Rekapitulasi & Ekspor</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh laporan berkala format Excel spreadsheet (.csv) atau cetak dokumen PDF resmi dengan kop surat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel (.csv)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-[#0f2744] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Report Type Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => setSelectedReport('bookings')}
          className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
            selectedReport === 'bookings'
              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CalendarCheck className="w-5 h-5 mb-2" />
          <div>
            <span className="font-bold text-xs block">Laporan Sewa</span>
            <span className={`text-[10px] ${selectedReport === 'bookings' ? 'text-blue-100' : 'text-slate-400'}`}>
              {bookings.length} Pesanan
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('revenue')}
          className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
            selectedReport === 'revenue'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-2" />
          <div>
            <span className="font-bold text-xs block">Pendapatan</span>
            <span className={`text-[10px] ${selectedReport === 'revenue' ? 'text-emerald-100' : 'text-slate-400'}`}>
              {payments.length} Mutasi
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('vehicles')}
          className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
            selectedReport === 'vehicles'
              ? 'bg-[#0f2744] border-[#0f2744] text-white shadow-md'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Car className="w-5 h-5 mb-2" />
          <div>
            <span className="font-bold text-xs block">Data Armada</span>
            <span className={`text-[10px] ${selectedReport === 'vehicles' ? 'text-slate-300' : 'text-slate-400'}`}>
              {vehicles.length} Mobil
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('customers')}
          className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
            selectedReport === 'customers'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5 mb-2" />
          <div>
            <span className="font-bold text-xs block">Data Pelanggan</span>
            <span className={`text-[10px] ${selectedReport === 'customers' ? 'text-indigo-100' : 'text-slate-400'}`}>
              {customers.length} Penyewa
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('delays')}
          className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
            selectedReport === 'delays'
              ? 'bg-amber-600 border-amber-600 text-white shadow-md'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-5 h-5 mb-2" />
          <div>
            <span className="font-bold text-xs block">Denda & Telat</span>
            <span className={`text-[10px] ${selectedReport === 'delays' ? 'text-amber-100' : 'text-slate-400'}`}>
              {returns.length} Kasus
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedReport('maintenance')}
          className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between cursor-pointer ${
            selectedReport === 'maintenance'
              ? 'bg-rose-600 border-rose-600 text-white shadow-md'
              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Wrench className="w-5 h-5 mb-2" />
          <div>
            <span className="font-bold text-xs block">Maintenance</span>
            <span className={`text-[10px] ${selectedReport === 'maintenance' ? 'text-rose-100' : 'text-slate-400'}`}>
              {maintenance.length} Servis
            </span>
          </div>
        </button>
      </div>

      {/* 3. Filter Controls: Date Range */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter Rentang Tanggal:
          </span>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Periode Data Terkini Sinkron</span>
        </div>
      </div>

      {/* 4. Report Print-Ready Container */}
      <div id="printable-report" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Printable Official Header (Shown during print / PDF) */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0f2744] flex items-center justify-center text-white font-black text-xl">
              DE
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f2744] tracking-tight">DRIVEEASE INDONESIA</h1>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Informasi Rental Kendaraan & Manajemen Armada Terpadu
              </p>
              <p className="text-[11px] text-slate-400">
                Jl. Sudirman No. 88, Jakarta Pusat • Telp: (021) 555-8900 • Email: report@driveease.com
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600">
            <span className="font-bold block uppercase text-slate-900">
              {activeDataset.title.replace(/_/g, ' ')}
            </span>
            <span className="block text-slate-400">Periode: {formatDate(startDate)} - {formatDate(endDate)}</span>
            <span className="block text-[11px] text-slate-400 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Dynamic Summary KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Total Entitas Data:</span>
            <span className="text-xl font-black text-slate-900">{activeDataset.count} Catatan</span>
          </div>

          {selectedReport === 'bookings' && (
            <div>
              <span className="text-slate-400 block font-semibold">Akumulasi Nilai Sewa:</span>
              <span className="text-xl font-black text-blue-600">
                {formatCurrency(bookings.reduce((acc, b) => acc + b.total_amount, 0))}
              </span>
            </div>
          )}

          {selectedReport === 'revenue' && (
            <div>
              <span className="text-slate-400 block font-semibold">Total Kas Masuk:</span>
              <span className="text-xl font-black text-emerald-600">
                {formatCurrency(payments.filter((p) => p.payment_status === 'verified').reduce((acc, p) => acc + p.amount, 0))}
              </span>
            </div>
          )}

          {selectedReport === 'vehicles' && (
            <div>
              <span className="text-slate-400 block font-semibold">Armada Siap Pakai:</span>
              <span className="text-xl font-black text-emerald-600">
                {vehicles.filter((v) => v.status === 'available').length} Unit
              </span>
            </div>
          )}

          {selectedReport === 'delays' && (
            <div>
              <span className="text-slate-400 block font-semibold">Total Denda Terkumpul:</span>
              <span className="text-xl font-black text-amber-600">
                {formatCurrency(returns.reduce((acc, r) => acc + r.total_penalty, 0))}
              </span>
            </div>
          )}

          {selectedReport === 'maintenance' && (
            <div>
              <span className="text-slate-400 block font-semibold">Total Pengeluaran Bengkel:</span>
              <span className="text-xl font-black text-rose-600">
                {formatCurrency(maintenance.reduce((acc, m) => acc + m.cost, 0))}
              </span>
            </div>
          )}

          <div>
            <span className="text-slate-400 block font-semibold">Otorisasi Sistem:</span>
            <span className="text-xs font-bold text-slate-800">Admin Utama (Verified)</span>
          </div>
        </div>

        {/* Dynamic Table Preview */}
        <div className="overflow-x-auto">
          {activeDataset.data.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                  {Object.keys(activeDataset.data[0]).map((header) => (
                    <th key={header} className="py-3 px-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeDataset.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    {Object.values(row).map((val: any, colIdx) => (
                      <td key={colIdx} className="py-3 px-4 text-slate-700 font-medium">
                        {typeof val === 'number' && String(Object.keys(row)[colIdx]).toLowerCase().includes('biaya')
                          ? formatCurrency(val)
                          : typeof val === 'number' && String(Object.keys(row)[colIdx]).toLowerCase().includes('tarif')
                          ? formatCurrency(val)
                          : typeof val === 'number' && String(Object.keys(row)[colIdx]).toLowerCase().includes('total')
                          ? formatCurrency(val)
                          : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada data laporan untuk ditampilkan.
            </div>
          )}
        </div>

        {/* Printable Signature Block (Shown on Print) */}
        <div className="pt-12 flex justify-between items-end text-xs text-slate-700">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400">Catatan:</p>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Dokumen laporan ini dihasilkan otomatis secara sah melalui Sistem Informasi Manajemen Armada DriveEase dan diakui secara digital.
            </p>
          </div>

          <div className="text-center space-y-12">
            <div>
              <p className="text-slate-500">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold text-slate-900 mt-0.5">Penanggung Jawab Operasional,</p>
            </div>
            <div>
              <p className="font-black text-slate-900 underline">Administrator DriveEase</p>
              <p className="text-[11px] text-slate-400">Direktorat Fleet & Keuangan</p>
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
}
