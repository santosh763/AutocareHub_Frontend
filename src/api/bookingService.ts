import api from './axios';
import BASE_URL from './config';
import type { Booking, CreateBookingPayload } from '../types';

const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await api.get<{ data: Booking[] }>(`${BASE_URL}/bookings/my`); // Updated route
    return data.bookings;
  },

  getById: async (id: string): Promise<Booking> => {
    const { data } = await api.get<{ data: Booking }>(`${BASE_URL}/bookings/${id}`);
    return data.bookings;
  },

  create: async (payload: CreateBookingPayload): Promise<Booking> => {
    const { data } = await api.post<{ data: Booking }>(`${BASE_URL}/bookings`, payload);
    return data.bookings;
  },
};

export default bookingService;
