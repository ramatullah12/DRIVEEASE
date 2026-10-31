import type { Booking, BookingStatus } from '../types';
import { MOCK_VEHICLES } from './mockData';

const BOOKINGS_STORAGE_KEY = 'driveease_bookings_data';

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 1,
    booking_code: 'DRV-202610-8912',
    customer_id: 1,
    customer_name: 'Budi Santoso',
    customer_email: 'budi.santoso@gmail.com',
    customer_phone: '081377889900',
    vehicle_id: 1,
    vehicle: MOCK_VEHICLES[0], // Toyota Fortuner
    start_date: '2026-11-05',
    end_date: '2026-11-08',
    total_days: 3,
    daily_rate: 850000,
    subtotal: 2550000,
    downPaymentRequired: 765000,
    paid_amount: 765000,
    remaining_payment: 1785000,
    deposit_amount: 500000,
    total_amount: 3050000,
    status: 'pending',
    payment_status: 'partial',
    notes: 'Perjalanan dinas luar kota. Mohon siapkan unit bersih.',
    created_at: '2026-10-31 09:30',
  } as any,
  {
    id: 2,
    booking_code: 'DRV-202610-7762',
    customer_id: 2,
    customer_name: 'Siti Rahmawati',
    customer_email: 'siti.rahma@yahoo.com',
    customer_phone: '081299887766',
    vehicle_id: 3,
    vehicle: MOCK_VEHICLES[2], // Toyota Innova Zenix
    start_date: '2026-11-02',
    end_date: '2026-11-05',
    total_days: 3,
    daily_rate: 700000,
    subtotal: 2100000,
    downPaymentRequired: 630000,
    paid_amount: 2600000,
    remaining_payment: 0,
    deposit_amount: 500000,
    total_amount: 2600000,
    status: 'approved',
    payment_status: 'paid',
    notes: 'Liburan bersama keluarga ke Bandung.',
    created_at: '2026-10-30 14:15',
  } as any,
  {
    id: 3,
    booking_code: 'DRV-202610-6601',
    customer_id: 3,
    customer_name: 'Hendrawan Kusuma',
    customer_email: 'hendra.kusuma@pt-indocitra.co.id',
    customer_phone: '081188223344',
    vehicle_id: 2,
    vehicle: MOCK_VEHICLES[1], // Mitsubishi Pajero Sport
    start_date: '2026-10-29',
    end_date: '2026-11-01',
    total_days: 3,
    daily_rate: 800000,
    subtotal: 2400000,
    downPaymentRequired: 720000,
    paid_amount: 2900000,
    remaining_payment: 0,
    deposit_amount: 500000,
    total_amount: 2900000,
    status: 'ongoing',
    payment_status: 'paid',
    notes: 'Kunjungan proyek operasional Cilegon.',
    created_at: '2026-10-28 11:20',
  } as any,
  {
    id: 4,
    booking_code: 'DRV-202610-5541',
    customer_id: 4,
    customer_name: 'Dr. Dimas Anggoro',
    customer_email: 'dimas.anggoro@rspusat.org',
    customer_phone: '081234567111',
    vehicle_id: 8,
    vehicle: MOCK_VEHICLES[7], // Toyota Camry
    start_date: '2026-10-25',
    end_date: '2026-10-27',
    total_days: 2,
    daily_rate: 1200000,
    subtotal: 2400000,
    downPaymentRequired: 720000,
    paid_amount: 2900000,
    remaining_payment: 0,
    deposit_amount: 500000,
    total_amount: 2900000,
    status: 'completed',
    payment_status: 'paid',
    notes: 'Tamu VIP pembicara simposium medis.',
    created_at: '2026-10-24 16:45',
  } as any,
  {
    id: 5,
    booking_code: 'DRV-202610-4419',
    customer_id: 5,
    customer_name: 'Maya Anggraini',
    customer_email: 'maya.ang@gmail.com',
    customer_phone: '085612348899',
    vehicle_id: 7,
    vehicle: MOCK_VEHICLES[6], // Honda Brio RS
    start_date: '2026-10-20',
    end_date: '2026-10-21',
    total_days: 1,
    daily_rate: 350000,
    subtotal: 350000,
    downPaymentRequired: 105000,
    paid_amount: 0,
    remaining_payment: 850000,
    deposit_amount: 500000,
    total_amount: 850000,
    status: 'rejected',
    payment_status: 'unpaid',
    notes: 'Ditolak: Dokumen foto SIM A tidak dapat diverifikasi keasliannya.',
    created_at: '2026-10-19 10:10',
  } as any,
];

export const getStoredBookings = (): Booking[] => {
  const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveBookings = (bookings: Booking[]): void => {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
};

/**
 * PENCEGAHAN BOOKING GANDA:
 * Memeriksa apakah kendaraan sudah dipesan oleh pelanggan lain pada periode yang bersinggungan.
 * Mengembalikan boolean `isAvailable` dan booking konflik jika ada.
 */
export const checkVehicleAvailability = (
  vehicleId: string | number,
  startDateStr: string,
  endDateStr: string,
  excludeBookingId?: string | number
): { isAvailable: boolean; conflictingBooking?: Booking } => {
  const allBookings = getStoredBookings();
  const reqStart = new Date(startDateStr).getTime();
  const reqEnd = new Date(endDateStr).getTime();

  for (const b of allBookings) {
    if (excludeBookingId && String(b.id) === String(excludeBookingId)) {
      continue;
    }

    // Hanya periksa booking yang aktif (tidak ditolak / dibatalkan)
    if (
      String(b.vehicle_id) === String(vehicleId) &&
      b.status !== 'rejected' &&
      b.status !== 'cancelled'
    ) {
      const existStart = new Date(b.start_date).getTime();
      const existEnd = new Date(b.end_date).getTime();

      // Overlap formula: (reqStart <= existEnd) && (reqEnd >= existStart)
      if (reqStart <= existEnd && reqEnd >= existStart) {
        return { isAvailable: false, conflictingBooking: b };
      }
    }
  }

  return { isAvailable: true };
};

export const updateBookingStatus = (
  bookingId: string | number,
  status: BookingStatus,
  rejectionReason?: string
): Booking[] => {
  const current = getStoredBookings();
  const updated = current.map((b) => {
    if (String(b.id) === String(bookingId)) {
      const updatedNotes = rejectionReason
        ? `Ditolak: ${rejectionReason}`
        : b.notes;
      return { ...b, status, notes: updatedNotes };
    }
    return b;
  });
  saveBookings(updated);
  return updated;
};

export const rescheduleBooking = (
  bookingId: string | number,
  newStartDate: string,
  newEndDate: string
): { success: boolean; message?: string; updatedBookings?: Booking[] } => {
  const current = getStoredBookings();
  const target = current.find((b) => String(b.id) === String(bookingId));
  if (!target) {
    return { success: false, message: 'Data booking tidak ditemukan.' };
  }

  // Cek ketersediaan untuk menghindari bentrok jadwal sewa mobil yang sama
  const availability = checkVehicleAvailability(
    target.vehicle_id,
    newStartDate,
    newEndDate,
    target.id
  );

  if (!availability.isAvailable) {
    return {
      success: false,
      message: `Bentrok jadwal! Mobil ini sudah terpesan pada ${availability.conflictingBooking?.start_date} s/d ${availability.conflictingBooking?.end_date} (Kode: ${availability.conflictingBooking?.booking_code}).`,
    };
  }

  // Hitung ulang total hari dan biaya
  const start = new Date(newStartDate).getTime();
  const end = new Date(newEndDate).getTime();
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const subtotal = target.daily_rate * diffDays;
  const totalAmount = subtotal + target.deposit_amount;

  const updated = current.map((b) => {
    if (String(b.id) === String(bookingId)) {
      return {
        ...b,
        start_date: newStartDate,
        end_date: newEndDate,
        total_days: diffDays,
        subtotal,
        total_amount: totalAmount,
        notes: `${b.notes ? b.notes + ' • ' : ''}Jadwal diubah admin ke ${newStartDate} s/d ${newEndDate}.`,
      };
    }
    return b;
  });

  saveBookings(updated);
  return { success: true, updatedBookings: updated };
};

export const addManualBooking = (newBookingData: Omit<Booking, 'id'>): { success: boolean; message?: string; booking?: Booking } => {
  // Pencegahan booking ganda
  const check = checkVehicleAvailability(
    newBookingData.vehicle_id,
    newBookingData.start_date,
    newBookingData.end_date
  );

  if (!check.isAvailable) {
    return {
      success: false,
      message: `Mobil ini telah terpesan pada tanggal tersebut (${check.conflictingBooking?.start_date} s/d ${check.conflictingBooking?.end_date}). Silakan pilih tanggal atau armada lain.`,
    };
  }

  const current = getStoredBookings();
  const created: Booking = {
    ...newBookingData,
    id: Date.now(),
  };
  const updated = [created, ...current];
  saveBookings(updated);
  return { success: true, booking: created };
};

