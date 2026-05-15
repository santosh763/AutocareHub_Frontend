import api from './axios';
import type { Booking, BookingStatus } from '../types';
import BASE_URL from './config';

const adminService = {
  getAllBookings: async (): Promise<any> => {
  const response: any = await api.get(`${BASE_URL}/bookings`);

  return response.data.bookings;
},

updateBookingStatus: async (
  id: string,
  status: BookingStatus
): Promise<any> => {
  const response: any = await api.put(
    `${BASE_URL}/bookings/${id}/status`,
    { status }
  );
}
};

export default adminService;



