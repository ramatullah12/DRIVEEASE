import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Wrench,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Gauge,
  Building,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import type { MaintenanceRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import {
  getStoredMaintenance,
  addMaintenanceRecord,
  updateMaintenanceStatus,
} from '../../services/returnMaintenanceStorage';
import { getStoredVehicles } from '../../services/vehicleStorage';

export default function AdminMaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Form State
  const vehicles = useMemo(() => getStoredVehicles(), []);

  const [formData, setFormData] = useState({
    vehicle_id: vehicles.length > 0 ? vehicles[0].id : 1,
    service_date: new Date().toISOString().split('T')[0],
    service_type: 'periodic' as any,
    cost: 750000,
    workshop_name: 'Bengkel Resmi Auto2000 Sudirman',
    description: 'Servis berkala: Penggantian oli mesin sintetis, filter oli, balancing & spooring.',
    status: 'scheduled' as any,
    odometer_at_service: 20000,
    next_service_mileage: 25000,
  });

  useEffect(() => {
    setRecords(getStoredMaintenance());
  }, []);

  // Filtered
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchVeh = r.vehicle_name?.toLowerCase().includes(q);
        const matchPlate = r.license_plate?.toLowerCase().includes(q);
        const matchWorkshop = r.workshop_name?.toLowerCase().includes(q);
        const matchDesc = r.description?.toLowerCase().includes(q);
        if (!matchVeh && !matchPlate && !matchWorkshop && !matchDesc) return false;
      }
      if (selectedStatus !== 'all') {
        if (r.status !== selectedStatus) return false;
      }
      if (selectedType !== 'all') {
        if (r.service_type !== selectedType) return false;
      }
      return true;
    });
  }, [records, searchQuery, selectedStatus, selectedType]);

  // Statistics
  const stats = useMemo(() => {
    const totalCost = records.reduce((acc, r) => acc + r.cost, 0);
    const inProgressCount = records.filter((r) => r.status === 'in_progress').length;
    const scheduledCount = records.filter((r) => r.status === 'scheduled').length;
    const completedCount = records.filter((r) => r.status === 'completed').length;

    return { totalCost, inProgressCount, scheduledCount, completedCount };
  }, [records]);

  // Actions
  const handleMarkCompleted = (id: string | number) => {
    const updated = updateMaintenanceStatus(id, 'completed');
    setRecords(updated);
    setActionSuccessMsg('Servis ditandai selesai! Status kendaraan telah kembali menjadi Tersedia (Siap Sewa).');
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find((item) => String(item.id) === String(formData.vehicle_id));

    const created = addMaintenanceRecord({
      vehicle_id: formData.vehicle_id,
      vehicle_name: v ? v.name : 'Armada DriveEase',
      license_plate: v ? v.license_plate : '-',
      service_date: formData.service_date,
      service_type: formData.service_type,
      cost: formData.cost,
      workshop_name: formData.workshop_name,
      description: formData.description,
      status: formData.status,
      odometer_at_service: formData.odometer_at_service,
      next_service_mileage: formData.next_service_mileage,
    });

    setRecords([created, ...records]);
    setIsAddModalOpen(false);
    setActionSuccessMsg('Jadwal perawatan berhasil disimpan ke dalam sistem armada!');
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case 'periodic':
        return { label: 'Servis Berkala', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'oil_change':
        return { label: 'Ganti Oli & Filter', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'repair':
        return { label: 'Perbaikan / Bodi', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'tire':
        return { label: 'Ganti Ban / Spooring', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: type, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <AdminLayout pageTitle="Manajemen Perawatan Armada (Maintenance)">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Perawatan & Riwayat Servis Bengkel</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwalkan servis berkala, catat biaya perbaikan, riwayat bengkel resmi, dan kontrol kesiapan fisik armada
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Input Jadwal Servis Baru
        </button>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Biaya Perawatan</span>
          <h3 className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalCost)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Investasi keandalan armada</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Sedang di Bengkel</span>
          <h3 className="text-2xl font-black text-amber-600">{stats.inProgressCount} Unit</h3>
          <p className="text-xs text-amber-700 font-semibold mt-1">Dalam proses pengerjaan montir</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Jadwal Servis Mendatang</span>
          <h3 className="text-2xl font-black text-blue-600">{stats.scheduledCount} Unit</h3>
          <p className="text-xs text-blue-700 font-semibold mt-1">Servis rutin terjadwal</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Servis Selesai</span>
          <h3 className="text-2xl font-black text-emerald-600">{stats.completedCount} Unit</h3>
          <p className="text-xs text-emerald-700 font-semibold mt-1">Unit telah kembali beroperasi</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kendaraan, nomor polisi, bengkel, atau part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status Servis</option>
            <option value="scheduled">Terjadwal</option>
            <option value="in_progress">Sedang Dikerjakan</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Jenis Perawatan</option>
            <option value="periodic">Servis Berkala</option>
            <option value="oil_change">Ganti Oli Mesin</option>
            <option value="repair">Perbaikan / Kerusakan</option>
            <option value="tire">Ban & Roda</option>
          </select>
        </div>

        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedType('all');
            }}
            title="Reset Filter"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Maintenance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Mobil & Plat</th>
                <th className="py-3.5 px-6">Jenis Servis & Bengkel</th>
                <th className="py-3.5 px-6">Tanggal & Odometer</th>
                <th className="py-3.5 px-6">Keterangan Pekerjaan</th>
                <th className="py-3.5 px-6">Biaya Servis</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((m) => {
                  const typeInfo = getServiceTypeBadge(m.service_type);

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition">
                      
                      {/* Vehicle & Plate */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block text-sm">{m.vehicle_name}</span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 inline-block mt-0.5">
                          {m.license_plate}
                        </span>
                      </td>

                      {/* Type & Workshop */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border mb-1 ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className="font-semibold text-slate-800 block text-xs flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" /> {m.workshop_name}
                        </span>
                      </td>

                      {/* Date & Odometer */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 block flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" /> {formatDate(m.service_date)}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Gauge className="w-3 h-3 text-slate-400" /> {m.odometer_at_service.toLocaleString()} KM
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-slate-600 line-clamp-2">{m.description}</p>
                      </td>

                      {/* Cost */}
                      <td className="py-4 px-6">
                        <span className="font-black text-blue-600 block text-xs">
                          {formatCurrency(m.cost)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {m.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai
                          </span>
                        ) : m.status === 'in_progress' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Dikerjakan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Terjadwal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {m.status !== 'completed' ? (
                          <button
                            type="button"
                            onClick={() => handleMarkCompleted(m.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Selesai
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold">Tersimpan</span>
                        )}
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada catatan servis kendaraan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Input Servis Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Jadwalkan Perawatan / Servis Armada</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Pilih Armada Kendaraan *</label>
                <select
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.license_plate}) - KM: {v.mileage.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Jenis Perawatan *</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="periodic">Servis Berkala Rutin</option>
                    <option value="oil_change">Ganti Oli & Filter Mesin</option>
                    <option value="repair">Perbaikan / Bodi Kendaraan</option>
                    <option value="tire">Ganti Ban & Balancing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status Pengerjaan *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Terjadwal (Akan Datang)</option>
                    <option value="in_progress">Sedang Dikerjakan di Bengkel</option>
                    <option value="completed">Selesai Dikerjakan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nama Bengkel Rekanan Resmi *</label>
                <input
                  type="text"
                  required
                  value={formData.workshop_name}
                  onChange={(e) => setFormData({ ...formData, workshop_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tanggal Servis *</label>
                  <input
                    type="date"
                    required
                    value={formData.service_date}
                    onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Estimasi / Biaya Servis (Rp) *</label>
                  <input
                    type="number"
                    required
                    step="25000"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Odometer Saat Servis (KM) *</label>
                  <input
                    type="number"
                    required
                    value={formData.odometer_at_service}
                    onChange={(e) => setFormData({ ...formData, odometer_at_service: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Odometer Servis Berikutnya *</label>
                  <input
                    type="number"
                    required
                    value={formData.next_service_mileage}
                    onChange={(e) => setFormData({ ...formData, next_service_mileage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Rincian Part / Pekerjaan *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Simpan Jadwal Servis
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
