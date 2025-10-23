import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Payout {
  _id: string;
  month: string;
  totalSessions: number;
  totalAmount: number;
  teacherShare: number;
  adminShare: number;
  status: "pending" | "paid";
}

interface PayoutState {
  payouts: Payout[];
  loading: boolean;
  error: string | null;
}

const initialState: PayoutState = {
  payouts: [],
  loading: false,
  error: null,
};

export const fetchMyPayouts = createAsyncThunk(
  "payout/fetchMyPayouts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/payouts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "查詢失敗");
    }
  }
);

const payoutSlice = createSlice({
  name: "payout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPayouts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload;
      })
      .addCase(fetchMyPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default payoutSlice.reducer;
