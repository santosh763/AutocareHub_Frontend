import api from './axios';
import BASE_URL from './config';
import type { Booking, CreateBookingPayload } from '../types';

const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await api.get<{ bookings: Booking[] }>(`${BASE_URL}/bookings/my`);
    return data.bookings;
  },

  create: async (payload: CreateBookingPayload): Promise<{ booking: Booking; payment: any }> => {
    const { data } = await api.post<{ booking: Booking; payment: any }>(`${BASE_URL}/bookings`, payload);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/bookings/${id}`);
  },
};

export default bookingService;
