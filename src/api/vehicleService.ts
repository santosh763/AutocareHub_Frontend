import api from './axios';
import type { Vehicle, CreateVehiclePayload } from '../types';
import BASE_URL from './config';

const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await api.get<{ vehicles: Vehicle[] }>(`${BASE_URL}/vehicles`);
    return data.vehicles;
  },

  create: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const { data } = await api.post<{ vehicle: Vehicle }>(`${BASE_URL}/vehicles`, payload);
    return data.vehicle;
  },

  update: async (id: string, payload: Partial<CreateVehiclePayload>): Promise<Vehicle> => {
    const { data } = await api.put<{ vehicle: Vehicle }>(`${BASE_URL}/vehicles/${id}`, payload);
    return data.vehicle;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/vehicles/${id}`);
  },
};

export default vehicleService;
