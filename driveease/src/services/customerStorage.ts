export interface CustomerWithHistory {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  nik: string;
  sim_number: string;
  address: string;
  avatar: string;
  verified_status: 'verified' | 'pending' | 'rejected';
  registered_at: string;
  rental_history: {
    booking_code: string;
    vehicle_name: string;
    license_plate: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: 'completed' | 'ongoing' | 'cancelled';
  }[];
}

const INITIAL_CUSTOMERS: CustomerWithHistory[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phone: '081377889900',
    nik: '3171012345670001',
    sim_number: '9901-2345-6789',
    address: 'Jl. Kebon Jeruk No. 12, Jakarta Barat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    verified_status: 'verified',
    registered_at: '2026-02-15',
    rental_history: [
      {
        booking_code: 'DRV-202610-8912',
        vehicle_name: 'Toyota Fortuner GR Sport',
        license_plate: 'B 1982 EAZ',
        start_date: '2026-10-25',
        end_date: '2026-10-28',
        total_amount: 2550000,
        status: 'ongoing',
      },
      {
        booking_code: 'DRV-202607-1120',
        vehicle_name: 'Toyota Avanza 1.5 G CVT',
        license_plate: 'B 4120 AVZ',
        start_date: '2026-07-10',
        end_date: '2026-07-13',
        total_amount: 1200000,
        status: 'completed',
      },
      {
        booking_code: 'DRV-202604-0981',
        vehicle_name: 'Honda Brio RS Urbanite',
        license_plate: 'B 2209 BRI',
        start_date: '2026-04-02',
        end_date: '2026-04-04',
        total_amount: 700000,
        status: 'completed',
      },
    ],
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    email: 'siti.rahma@yahoo.com',
    phone: '081299887766',
    nik: '3275024409910003',
    sim_number: '8812-7654-3210',
    address: 'Komplek Harapan Indah Blok C2 No. 8, Bekasi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    verified_status: 'verified',
    registered_at: '2026-03-10',
    rental_history: [
      {
        booking_code: 'DRV-202609-5431',
        vehicle_name: 'Toyota Innova Zenix Hybrid',
        license_plate: 'B 1567 KZN',
        start_date: '2026-09-12',
        end_date: '2026-09-15',
        total_amount: 2100000,
        status: 'completed',
      },
      {
        booking_code: 'DRV-202605-3211',
        vehicle_name: 'Mitsubishi Pajero Sport',
        license_plate: 'B 2341 DRS',
        start_date: '2026-05-20',
        end_date: '2026-05-22',
        total_amount: 1600000,
        status: 'completed',
      },
    ],
  },
  {
    id: 3,
    name: 'Hendrawan Kusuma',
    email: 'hendra.kusuma@pt-indocitra.co.id',
    phone: '081188223344',
    nik: '3174091807850005',
    sim_number: '7723-9988-1122',
    address: 'Apartemen Sudirman Tower A Lantai 18, Jakarta Selatan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    verified_status: 'verified',
    registered_at: '2026-01-20',
    rental_history: [
      {
        booking_code: 'DRV-202610-7762',
        vehicle_name: 'Mitsubishi Pajero Sport',
        license_plate: 'B 2341 DRS',
        start_date: '2026-10-18',
        end_date: '2026-10-20',
        total_amount: 1600000,
        status: 'completed',
      },
      {
        booking_code: 'DRV-202608-4490',
        vehicle_name: 'Toyota Camry 2.5 V',
        license_plate: 'B 1 VIP',
        start_date: '2026-08-01',
        end_date: '2026-08-03',
        total_amount: 2400000,
        status: 'completed',
      },
    ],
  },
  {
    id: 4,
    name: 'Dr. Dimas Anggoro',
    email: 'dimas.anggoro@rspusat.org',
    phone: '081234567111',
    nik: '3173051212880002',
    sim_number: '6654-3321-8899',
    address: 'Jl. Cempaka Putih Tengah No. 45, Jakarta Pusat',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    verified_status: 'verified',
    registered_at: '2026-04-05',
    rental_history: [
      {
        booking_code: 'DRV-202610-9901',
        vehicle_name: 'Toyota Camry 2.5 V',
        license_plate: 'B 1 VIP',
        start_date: '2026-10-28',
        end_date: '2026-10-30',
        total_amount: 2400000,
        status: 'completed',
      },
    ],
  },
  {
    id: 5,
    name: 'Maya Anggraini',
    email: 'maya.ang@gmail.com',
    phone: '085612348899',
    nik: '3271035511970004',
    sim_number: '5543-2211-7788',
    address: 'Jl. Pajajaran No. 22, Bogor',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    verified_status: 'pending',
    registered_at: '2026-10-29',
    rental_history: [],
  },
];

const CUSTOMERS_STORAGE_KEY = 'driveease_customers_data';

export const getStoredCustomers = (): CustomerWithHistory[] => {
  const data = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomers = (customers: CustomerWithHistory[]): void => {
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
};

export const addCustomerToStore = (newCustomer: Omit<CustomerWithHistory, 'id' | 'registered_at' | 'rental_history'>): CustomerWithHistory => {
  const current = getStoredCustomers();
  const created: CustomerWithHistory = {
    ...newCustomer,
    id: Date.now(),
    registered_at: new Date().toISOString().split('T')[0],
    rental_history: [],
  };
  const updated = [created, ...current];
  saveCustomers(updated);
  return created;
};

export const updateCustomerInStore = (id: string | number, updatedData: Partial<CustomerWithHistory>): CustomerWithHistory[] => {
  const current = getStoredCustomers();
  const updated = current.map((c) => (String(c.id) === String(id) ? { ...c, ...updatedData } : c));
  saveCustomers(updated);
  return updated;
};

export const deleteCustomerFromStore = (id: string | number): CustomerWithHistory[] => {
  const current = getStoredCustomers();
  const updated = current.filter((c) => String(c.id) !== String(id));
  saveCustomers(updated);
  return updated;
};

