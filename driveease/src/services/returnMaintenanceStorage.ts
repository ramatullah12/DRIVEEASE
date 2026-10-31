import type { VehicleReturn, MaintenanceRecord } from '../types';
import { updateVehicleInStore } from './vehicleStorage';
import { updateBookingStatus } from './bookingStorage';

const RETURNS_STORAGE_KEY = 'driveease_returns_data';
const MAINTENANCE_STORAGE_KEY = 'driveease_maintenance_data';

const INITIAL_RETURNS: VehicleReturn[] = [
  {
    id: 1,
    booking_id: 4,
    staff_id: 2,
    staff_name: 'Rudi Pratama (Petugas)',
    return_date: '2026-10-27 15:00',
    actual_return_date: '2026-10-27 14:30',
    end_mileage: 16000,
    fuel_level: 100,
    late_hours: 0,
    late_fee: 0,
    damage_fee: 0,
    fuel_charge: 0,
    total_penalty: 0,
    damage_notes: 'Kondisi kendaraan sangat bersih dan mulus tanpa lecet baru.',
    photos: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600',
    ],
    status: 'settled',
  },
  {
    id: 2,
    booking_id: 3,
    staff_id: 2,
    staff_name: 'Rudi Pratama (Petugas)',
    return_date: '2026-10-20 12:00',
    actual_return_date: '2026-10-20 15:00',
    end_mileage: 24300,
    fuel_level: 85,
    late_hours: 3,
    late_fee: 150000, // 3 jam x 50.000
    damage_fee: 0,
    fuel_charge: 75000,
    total_penalty: 225000,
    damage_notes: 'Terlambat 3 jam karena macet tol cikampek. Bahan bakar berkurang 15%. Denda telah diselesaikan.',
    photos: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600',
    ],
    status: 'settled',
  },
  {
    id: 3,
    booking_id: 2,
    staff_id: 2,
    staff_name: 'Rudi Pratama (Petugas)',
    return_date: '2026-10-15 17:00',
    actual_return_date: '2026-10-15 17:15',
    end_mileage: 14500,
    fuel_level: 100,
    late_hours: 0,
    late_fee: 0,
    damage_fee: 350000,
    fuel_charge: 0,
    total_penalty: 350000,
    damage_notes: 'Baret halus pada bumper belakang kiri kena trotoar saat parkir. Direkomendasikan poles & cat ringan.',
    photos: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600',
    ],
    status: 'needs_maintenance',
  },
];

const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 1,
    vehicle_id: 6,
    vehicle_name: 'Toyota Avanza 1.5 G CVT',
    license_plate: 'B 4120 AVZ',
    service_date: '2026-10-16',
    service_type: 'repair',
    cost: 450000,
    workshop_name: 'Auto2000 Sahardjo Jakarta',
    description: 'Cat & poles bumper belakang lecet pasca sewa. Pengecekan kampas rem belakang.',
    status: 'completed',
    odometer_at_service: 14500,
    next_service_mileage: 19500,
  },
  {
    id: 2,
    vehicle_id: 4,
    vehicle_name: 'Honda CR-V Turbo',
    license_plate: 'B 8899 CRV',
    service_date: '2026-11-03',
    service_type: 'periodic',
    cost: 850000,
    workshop_name: 'Honda Megatama Kalimalang',
    description: 'Servis berkala 30.000 KM: Ganti oli mesin sintetis, filter oli, rotasi ban, dan general check.',
    status: 'scheduled',
    odometer_at_service: 31200,
    next_service_mileage: 36000,
  },
  {
    id: 3,
    vehicle_id: 5,
    vehicle_name: 'Honda HR-V RS Turbo',
    license_plate: 'B 1042 HRV',
    service_date: '2026-10-30',
    service_type: 'oil_change',
    cost: 550000,
    workshop_name: 'Bengkel Resmi Honda Permata',
    description: 'Penggantian oli transmisi CVT & filter AC kabin.',
    status: 'in_progress',
    odometer_at_service: 19800,
    next_service_mileage: 25000,
  },
];

// Returns helpers
export const getStoredReturns = (): VehicleReturn[] => {
  const data = localStorage.getItem(RETURNS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(INITIAL_RETURNS));
    return INITIAL_RETURNS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_RETURNS;
  }
};

export const saveReturns = (returns: VehicleReturn[]): void => {
  localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(returns));
};

export const addVehicleReturnRecord = (
  returnRecord: Omit<VehicleReturn, 'id'>,
  vehicleId: string | number
): VehicleReturn => {
  const current = getStoredReturns();
  const created: VehicleReturn = {
    ...returnRecord,
    id: Date.now(),
  };

  const updated = [created, ...current];
  saveReturns(updated);

  // Update Booking status to completed
  updateBookingStatus(returnRecord.booking_id, 'completed');

  // If needs maintenance, update vehicle status to 'maintenance'
  if (returnRecord.status === 'needs_maintenance') {
    updateVehicleInStore(vehicleId, {
      status: 'maintenance',
      mileage: returnRecord.end_mileage,
    });

    // Auto schedule a maintenance record
    addMaintenanceRecord({
      vehicle_id: vehicleId,
      vehicle_name: 'Armada Kembali Butuh Servis',
      license_plate: '-',
      service_date: new Date().toISOString().split('T')[0],
      service_type: 'repair',
      cost: returnRecord.damage_fee || 500000,
      workshop_name: 'Bengkel Rekanan Resmi',
      description: `Perbaikan kerusakan pasca pengembalian: ${returnRecord.damage_notes || 'Poles/perbaikan bodi'}`,
      status: 'scheduled',
      odometer_at_service: returnRecord.end_mileage,
      next_service_mileage: returnRecord.end_mileage + 5000,
    });
  } else {
    // Return to available status!
    updateVehicleInStore(vehicleId, {
      status: 'available',
      mileage: returnRecord.end_mileage,
    });
  }

  return created;
};

// Maintenance helpers
export const getStoredMaintenance = (): MaintenanceRecord[] => {
  const data = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(INITIAL_MAINTENANCE));
    return INITIAL_MAINTENANCE;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MAINTENANCE;
  }
};

export const saveMaintenance = (records: MaintenanceRecord[]): void => {
  localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(records));
};

export const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>): MaintenanceRecord => {
  const current = getStoredMaintenance();
  const created: MaintenanceRecord = {
    ...record,
    id: Date.now(),
  };
  const updated = [created, ...current];
  saveMaintenance(updated);

  // Set vehicle status to maintenance if scheduled or in_progress
  if (record.status !== 'completed') {
    updateVehicleInStore(record.vehicle_id, { status: 'maintenance' });
  }

  return created;
};

export const updateMaintenanceStatus = (
  id: string | number,
  status: 'scheduled' | 'in_progress' | 'completed'
): MaintenanceRecord[] => {
  const current = getStoredMaintenance();
  let targetVehicleId: string | number | null = null;

  const updated = current.map((m) => {
    if (String(m.id) === String(id)) {
      targetVehicleId = m.vehicle_id;
      return { ...m, status };
    }
    return m;
  });

  saveMaintenance(updated);

  // If maintenance is completed, return vehicle status to available
  if (status === 'completed' && targetVehicleId) {
    updateVehicleInStore(targetVehicleId, { status: 'available' });
  }

  return updated;
};

