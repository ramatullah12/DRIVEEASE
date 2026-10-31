import { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  History,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import {
  getStoredCustomers,
  addCustomerToStore,
  updateCustomerInStore,
  deleteCustomerFromStore,
  type CustomerWithHistory,
} from '../../services/customerStorage';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerWithHistory | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerWithHistory | null>(null);
  const [viewHistoryCustomer, setViewHistoryCustomer] = useState<CustomerWithHistory | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nik: '',
    sim_number: '',
    address: '',
    avatar: '',
    verified_status: 'verified' as 'verified' | 'pending' | 'rejected',
  });

  useEffect(() => {
    setCustomers(getStoredCustomers());
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone.includes(q);
        const matchNik = c.nik.includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchNik) return false;
      }
      if (selectedStatus !== 'all') {
        if (c.verified_status !== selectedStatus) return false;
      }
      return true;
    });
  }, [customers, searchQuery, selectedStatus]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      nik: '',
      sim_number: '',
      address: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      verified_status: 'verified',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (customer: CustomerWithHistory) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      nik: customer.nik,
      sim_number: customer.sim_number,
      address: customer.address,
      avatar: customer.avatar,
      verified_status: customer.verified_status,
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      const updated = updateCustomerInStore(editingCustomer.id, formData);
      setCustomers(updated);
    } else {
      addCustomerToStore(formData);
      setCustomers(getStoredCustomers());
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deletingCustomer) return;
    const updated = deleteCustomerFromStore(deletingCustomer.id);
    setCustomers(updated);
    setDeletingCustomer(null);
  };

  return (
    <AdminLayout pageTitle="Manajemen Data Pelanggan">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f2744] tracking-tight">Data Pelanggan & Penyewa</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data identitas (KTP / SIM A), kontak penyewa, dan riwayat transaksi rental kendaraan
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Pelanggan Baru
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pelanggan, NIK, email, atau nomor telepon..."
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
            <option value="all">Semua Status Verifikasi</option>
            <option value="verified">Terverifikasi (Valid KTP & SIM)</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="rejected">Ditolak / Bermasalah</option>
          </select>
        </div>

        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
            }}
            title="Reset Filter"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 3. Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3.5 px-6">Pelanggan</th>
                <th className="py-3.5 px-6">Identitas (NIK & SIM A)</th>
                <th className="py-3.5 px-6">Kontak & Alamat</th>
                <th className="py-3.5 px-6">Status Dokumen</th>
                <th className="py-3.5 px-6">Riwayat Sewa</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition">
                    
                    {/* Customer Avatar & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{customer.name}</span>
                          <span className="text-[11px] text-slate-400">Terdaftar sejak {formatDate(customer.registered_at)}</span>
                        </div>
                      </div>
                    </td>

                    {/* NIK & SIM */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-slate-800 block text-xs">
                          NIK: {customer.nik}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px] block">
                          SIM: {customer.sim_number}
                        </span>
                      </div>
                    </td>

                    {/* Contact & Address */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Phone className="w-3 h-3 text-blue-600" /> {customer.phone}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" /> {customer.email}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {customer.address}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      {customer.verified_status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi
                        </span>
                      ) : customer.verified_status === 'pending' ? (
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Menunggu Review
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Ditolak
                        </span>
                      )}
                    </td>

                    {/* Rental History Pill */}
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => setViewHistoryCustomer(customer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition text-xs"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>{customer.rental_history.length} Transaksi</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(customer)}
                          title="Edit Pelanggan"
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCustomer(customer)}
                          title="Hapus Pelanggan"
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada pelanggan yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>Menampilkan <strong>{filteredCustomers.length}</strong> dari {customers.length} data penyewa terdaftar</span>
          <span className="font-semibold text-blue-600">Terproteksi Regulasi Data Pelanggan</span>
        </div>
      </div>

      {/* 4. Modal Form Tambah / Edit Pelanggan */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">
                  {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nama Lengkap Sesuai KTP *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email Aktif *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status Verifikasi Identitas *</label>
                  <select
                    value={formData.verified_status}
                    onChange={(e) => setFormData({ ...formData, verified_status: e.target.value as any })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="verified">Terverifikasi (KTP & SIM Sah)</option>
                    <option value="pending">Menunggu Verifikasi</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Induk Kependudukan (NIK) *</label>
                  <input
                    type="text"
                    required
                    placeholder="16 digit angka KTP"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Nomor SIM A Mengemudi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nomor SIM aktif"
                    value={formData.sim_number}
                    onChange={(e) => setFormData({ ...formData, sim_number: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Domisili Lengkap *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">URL Avatar / Foto Profil</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  {editingCustomer ? 'Simpan Perubahan' : 'Simpan Pelanggan'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 5. Modal Riwayat Penyewaan Pelanggan */}
      {viewHistoryCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">
                  Riwayat Penyewaan: {viewHistoryCustomer.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewHistoryCustomer(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              {viewHistoryCustomer.rental_history.length > 0 ? (
                viewHistoryCustomer.rental_history.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">{h.booking_code}</span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                          {h.license_plate}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{h.vehicle_name}</h4>
                      <p className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {h.start_date} s/d {h.end_date}
                      </p>
                    </div>

                    <div className="text-left sm:text-right space-y-1">
                      <span className="text-sm font-black text-blue-600 block">
                        {formatCurrency(h.total_amount)}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : h.status === 'ongoing'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {h.status === 'completed' ? 'Selesai & Dikembalikan' : h.status === 'ongoing' ? 'Sedang Berjalan' : 'Dibatalkan'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">
                  Pelanggan ini belum memiliki riwayat transaksi penyewaan sebelumnya.
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setViewHistoryCustomer(null)}
                className="px-5 py-2 rounded-xl bg-[#0f2744] text-white font-bold text-xs"
              >
                Tutup Riwayat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Modal Konfirmasi Hapus Pelanggan */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Pelanggan</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus data akun penyewa <strong>{deletingCustomer.name}</strong> ({deletingCustomer.nik})?
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Hapus Pelanggan
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

