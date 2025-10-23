import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  course: {
    _id: string;
    title: string;
  };
}

interface AnnouncementState {
  announcements: Announcement[];
  selectedAnnouncement: Announcement | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: AnnouncementState = {
  announcements: [],
  selectedAnnouncement: null,
  loading: false,
  error: null,
  totalPages: 1,
};
//取得公告
export const fetchAnnouncements = createAsyncThunk(
  "announcement/fetchAnnouncements",
  async (
    { page = 1, limit = 12 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${API_URL}/announcement?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "無法獲取公告資料";
      return rejectWithValue(errorMessage);
    }
  }
);
//取得公告詳情
export const fetchSingleAnnouncement = createAsyncThunk(
  "announcement/fetchSingleAnnouncement",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/announcement/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue("無法獲取公告詳情");
    }
  }
);
//新增公告
export const createAnnouncement = createAsyncThunk(
  "announcement/createAnnouncement",
  async (
    {
      courseId,
      title,
      content,
    }: { courseId?: string; title: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("尚未登入或缺少 token");
      const res = await axios.post(
        `${API_URL}/announcement`,
        {
          courseId,
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "新增公告失敗";
      return rejectWithValue(errorMessage);
    }
  }
);

// 刪除公告
export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/announcement/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// 取得學生自己的公告
export const fetchMyAnnouncements = createAsyncThunk(
  "announcement/fetchMyAnnouncements",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("尚未登入或缺少 token");

      const res = await axios.get(`${API_URL}/announcement/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "無法獲取個人公告";
      return rejectWithValue(errorMessage);
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSingleAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnnouncement = action.payload.data;
      })
      .addCase(fetchSingleAnnouncement.pending, (state) => {
        state.loading = true;
        state.selectedAnnouncement = null;
      })
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements.unshift(action.payload.data);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(
          (a) => a._id !== action.payload
        );
        state.selectedAnnouncement = null;
      })
      .addCase(fetchMyAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload.data;
      })
      .addCase(fetchMyAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default announcementSlice.reducer;
