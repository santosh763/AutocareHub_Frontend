import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginPayload, RegisterPayload, User } from '../../types';
import authService from '../../api/authService';

const storedToken = localStorage.getItem('token');
const storedUser  = localStorage.getItem('user');

const initialState: AuthState = {
  token: storedToken || null,
  user:  storedUser ? (JSON.parse(storedUser) as User) : null,
  loading: false,
  error: null,
};

// ─── Thunks ──────────────────────────────────────────────────────────────────
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {

    try {
      const res = await authService.login(payload);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authService.register(payload);
      // localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

export const fetchProfileThunk = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch profile';
      return rejectWithValue(msg);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user  = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
    setUser: (state, action: PayloadAction<User>) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending,    (s) => { s.loading = true;  s.error = null; })
      .addCase(loginThunk.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(loginThunk.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string; })
    // Register
      .addCase(registerThunk.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(registerThunk.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(registerThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; })
    // Profile
      .addCase(fetchProfileThunk.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
