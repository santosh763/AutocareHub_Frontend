import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginPayload, RegisterPayload, User } from '../../types';
import authService from '../../api/authService';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  token: storedToken || null,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
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
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Login failed';

      return rejectWithValue(msg);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authService.register(payload);

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Registration failed';

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
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to fetch profile';

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
      state.user = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ─── Login ───────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;

        // Clear old auth state
        state.user = null;
        state.token = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;

        state.user = null;
        state.token = null;

        state.error = action.payload as string;

        // Clear invalid old storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });

    // ─── Register ────────────────────────────────────────────
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ─── Profile ─────────────────────────────────────────────
    builder.addCase(fetchProfileThunk.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

export default authSlice.reducer;