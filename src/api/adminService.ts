import api from './axios';
import type { Booking, BookingStatus } from '../types';
import BASE_URL from './config';

const adminService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const { data } = await api.get<{ bookings: Booking[] }>(`${BASE_URL}/bookings`);
    return data.bookings;
  },

  updateBookingStatus: async (
    id: string,
    status: BookingStatus
  ): Promise<Booking> => {
    const { data } = await api.patch<{ booking: Booking }>(
      `${BASE_URL}/bookings/${id}/status`,
      { status }
    );
    return data.booking;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/bookings/admin/${id}`);
  }
};

export default adminService;



