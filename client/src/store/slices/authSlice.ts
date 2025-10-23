import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  users: [],
  token: null,
  loading: false,
  error: null,
};
//register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/auth/register`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  }
);

// 登入 API
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      return res.data as { user: User; token: string };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "登入失敗");
    }
  }
);
//抓個人資料
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "取得個人資料失敗");
    }
  }
);
//updateUser
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, data }: { userId: string; data: Partial<User> }) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(`${API_URL}/users/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }
);
//deleteUser
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userId;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("userRole", action.payload.user.role);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "註冊失敗";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "更新失敗";
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "刪除失敗";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
