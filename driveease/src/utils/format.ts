export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return String(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return String(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

export const getStatusBadge = (status: string): { label: string; bg: string; text: string; border: string } => {
  switch (status) {
    case 'available':
      return { label: 'Tersedia', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'rented':
    case 'ongoing':
      return { label: 'Disewa', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'maintenance':
      return { label: 'Perawatan', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'reserved':
      return { label: 'Dipesan', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'pending':
      return { label: 'Menunggu', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'approved':
      return { label: 'Disetujui', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    case 'rejected':
      return { label: 'Ditolak', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'completed':
      return { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'cancelled':
      return { label: 'Dibatalkan', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' };
    case 'verified':
    case 'paid':
      return { label: 'Terverifikasi', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'partial':
      return { label: 'DP Dibayar', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'unpaid':
      return { label: 'Belum Bayar', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { label: status, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

