import type { Vehicle } from '../types';
import { MOCK_VEHICLES } from './mockData';

const VEHICLES_STORAGE_KEY = 'driveease_vehicles_data';

export const getStoredVehicles = (): Vehicle[] => {
  const data = localStorage.getItem(VEHICLES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(MOCK_VEHICLES));
    return MOCK_VEHICLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_VEHICLES;
  }
};

export const saveVehicles = (vehicles: Vehicle[]): void => {
  localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
};

export const addVehicleToStore = (newVehicle: Omit<Vehicle, 'id'>): Vehicle => {
  const current = getStoredVehicles();
  const created: Vehicle = {
    ...newVehicle,
    id: Date.now(),
  };
  const updated = [created, ...current];
  saveVehicles(updated);
  return created;
};

export const updateVehicleInStore = (id: string | number, updatedData: Partial<Vehicle>): Vehicle[] => {
  const current = getStoredVehicles();
  const updated = current.map((v) => (String(v.id) === String(id) ? { ...v, ...updatedData } : v));
  saveVehicles(updated);
  return updated;
};

export const deleteVehicleFromStore = (id: string | number): Vehicle[] => {
  const current = getStoredVehicles();
  const updated = current.filter((v) => String(v.id) !== String(id));
  saveVehicles(updated);
  return updated;
};

