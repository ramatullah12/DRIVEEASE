import type { Payment, PaymentStatus } from '../types';

const PAYMENTS_STORAGE_KEY = 'driveease_payments_data';

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 1,
    booking_id: 1,
    booking_code: 'DRV-202610-8912',
    customer_name: 'Budi Santoso',
    amount: 765000,
    payment_type: 'down_payment',
    payment_method: 'bank_transfer',
    payment_status: 'pending',
    proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    bank_name: 'BCA (Bank Central Asia)',
    transaction_ref: 'TRX-BCA-8891023',
    created_at: '2026-10-31 10:15',
  },
  {
    id: 2,
    booking_id: 2,
    booking_code: 'DRV-202610-7762',
    customer_name: 'Siti Rahmawati',
    amount: 630000,
    payment_type: 'down_payment',
    payment_method: 'qris',
    payment_status: 'verified',
    proof_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    bank_name: 'QRIS BCA',
    transaction_ref: 'QRS-20261030-9921',
    verified_at: '2026-10-30 15:30',
    verified_by: 'Admin DriveEase',
    created_at: '2026-10-30 14:45',
  },
  {
    id: 3,
    booking_id: 2,
    booking_code: 'DRV-202610-7762',
    customer_name: 'Siti Rahmawati',
    amount: 1970000,
    payment_type: 'settlement',
    payment_method: 'bank_transfer',
    payment_status: 'verified',
    proof_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800',
    bank_name: 'Mandiri Transfer',
    transaction_ref: 'MND-20261031-1022',
    verified_at: '2026-10-31 08:00',
    verified_by: 'Admin DriveEase',
    created_at: '2026-10-31 07:45',
  },
  {
    id: 4,
    booking_id: 3,
    booking_code: 'DRV-202610-6601',
    customer_name: 'Hendrawan Kusuma',
    amount: 2900000,
    payment_type: 'full_payment',
    payment_method: 'bank_transfer',
    payment_status: 'verified',
    proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    bank_name: 'BCA Virtual Account',
    transaction_ref: 'BCA-VA-0091823',
    verified_at: '2026-10-28 12:00',
    verified_by: 'Admin DriveEase',
    created_at: '2026-10-28 11:35',
  },
  {
    id: 5,
    booking_id: 4,
    booking_code: 'DRV-202610-5541',
    customer_name: 'Dr. Dimas Anggoro',
    amount: 2900000,
    payment_type: 'full_payment',
    payment_method: 'credit_card',
    payment_status: 'verified',
    proof_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    bank_name: 'Visa Signature',
    transaction_ref: 'CC-VIS-99120',
    verified_at: '2026-10-24 17:00',
    verified_by: 'Admin DriveEase',
    created_at: '2026-10-24 16:50',
  },
  {
    id: 6,
    booking_id: 5,
    booking_code: 'DRV-202610-4419',
    customer_name: 'Maya Anggraini',
    amount: 105000,
    payment_type: 'down_payment',
    payment_method: 'bank_transfer',
    payment_status: 'rejected',
    proof_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800',
    bank_name: 'BNI Transfer',
    transaction_ref: 'BNI-INV-00129',
    created_at: '2026-10-19 10:30',
  },
];

export const getStoredPayments = (): Payment[] => {
  const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
    return INITIAL_PAYMENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PAYMENTS;
  }
};

export const savePayments = (payments: Payment[]): void => {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
};

export const verifyPaymentInStore = (paymentId: string | number, verifiedBy: string = 'Admin DriveEase'): Payment[] => {
  const current = getStoredPayments();
  const updated = current.map((p) => {
    if (String(p.id) === String(paymentId)) {
      return {
        ...p,
        payment_status: 'verified' as PaymentStatus,
        verified_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        verified_by: verifiedBy,
      };
    }
    return p;
  });
  savePayments(updated);
  return updated;
};

export const rejectPaymentInStore = (paymentId: string | number): Payment[] => {
  const current = getStoredPayments();
  const updated = current.map((p) => {
    if (String(p.id) === String(paymentId)) {
      return {
        ...p,
        payment_status: 'rejected' as PaymentStatus,
      };
    }
    return p;
  });
  savePayments(updated);
  return updated;
};

export const addManualPayment = (newPayment: Omit<Payment, 'id' | 'created_at'>): Payment => {
  const current = getStoredPayments();
  const created: Payment = {
    ...newPayment,
    id: Date.now(),
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };
  const updated = [created, ...current];
  savePayments(updated);
  return created;
};
