import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Booking, CreateBookingPayload } from '../../types';
import bookingService from '../../api/bookingService';

interface BookingsState {
  items: Booking[];
  loading: boolean;
  error: string | null;
  currentBooking: Booking | null;
}

const initialState: BookingsState = {
  items: [],
  loading: false,
  error: null,
  currentBooking: null,
};

export const fetchBookingsThunk = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getAll();
    } catch {
      return rejectWithValue('Failed to fetch bookings');
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  'bookings/create',
  async (payload: CreateBookingPayload, { rejectWithValue }) => {
    try {
      return await bookingService.create(payload);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Booking failed';
      return rejectWithValue(msg);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => { state.currentBooking = action.payload; },
    clearCurrentBooking: (state) => { state.currentBooking = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsThunk.pending,    (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchBookingsThunk.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchBookingsThunk.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(createBookingThunk.pending,    (s) => { s.loading = true;  s.error = null; })
      .addCase(createBookingThunk.fulfilled,  (s, a) => { s.loading = false; s.items.unshift(a.payload); s.currentBooking = a.payload; })
      .addCase(createBookingThunk.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { setCurrentBooking, clearCurrentBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
