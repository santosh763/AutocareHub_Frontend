import { useState, useCallback } from 'react';
import vehicleService from '../api/vehicleService';
import type { Vehicle, CreateVehiclePayload } from '../types';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [useVehicles]);

  const addVehicle = async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const vehicle = await vehicleService.create(payload);
    setVehicles((prev) => [vehicle, ...prev]);
    return vehicle;
  };

  const updateVehicle = async (id: string|number, payload: Partial<CreateVehiclePayload>): Promise<Vehicle> => {
    const updated = await vehicleService.update(id, payload);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
    return updated;
  };

  const deleteVehicle = async (id: string|number): Promise<void> => {
    await vehicleService.delete(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return { vehicles, loading, error, fetchVehicles, addVehicle, updateVehicle, deleteVehicle };
}
