import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface AddCoursePayload {
  title: string;
  description: string;
  fee: number;
  totalSessions: number;
  teacher: string; // 只傳 ID
  maxStudents?: number;
  materials?: string[];
  teacherShareRatio?: number;
  adminShareRatio?: number;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  fee?: number;
  teacher?: Teacher;
  maxStudents?: number;
  totalSessions?: number;
  materials?: string[];
  teacherShareRatio?: number;
  adminShareRatio?: number;
  status?: "upcoming" | "completed";
}
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
interface UpdateCourseData {
  title?: string;
  description?: string;
  fee?: number;
  totalSessions?: number;
  teacher?: string | Teacher;
  maxStudents?: number;
  materials?: string[];
  teacherShareRatio?: number;
  adminShareRatio?: number;
  status?: "upcoming" | "completed";
}

interface CourseState {
  courses: Course[];
  currentCourse?: Course | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchAllCourses = createAsyncThunk(
  "course/fetchAllCourses",
  async (
    {
      page = 1,
      limit: _limit = 6,
      search = "",
      teacherId = "",
      studentId = "",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      teacherId?: string;
      studentId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: _limit, search, teacherId, studentId },
      });
      return {
        data: res.data.data as Course[],
        pagination: res.data.pagination as Pagination,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "取得課程失敗");
    }
  }
);
// 取得單一課程
export const fetchCourseById = createAsyncThunk(
  "course/fetchCourseById",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data as Course;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "取得課程失敗");
    }
  }
);

// 新增課程
export const addCourse = createAsyncThunk(
  "course/addCourse",
  async (courseData: AddCoursePayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/courses`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.course;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "新增課程失敗");
    }
  }
);
// 更新課程
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async ({ id, data }: { id: string; data: UpdateCourseData }) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/courses/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as Course;
  }
);

// 刪除課程
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // 返回刪除的課程ID
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "刪除課程失敗");
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "取得課程失敗";
      })
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "新增課程失敗";
      })
      // updateCourse
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCourse.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;
          console.log(action.payload);
          state.currentCourse = action.payload;
          const index = state.courses.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) state.courses[index] = action.payload;
        }
      )
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || "更新課程失敗";
      })
      //fetchcoursebyid
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourseById.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;
          state.currentCourse = action.payload;
        }
      )
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "取得課程資料失敗";
      })
      // deleteCourse
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCourse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          // 刪除課程
          state.courses = state.courses.filter(
            (course) => course._id !== action.payload
          );
        }
      )
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "刪除課程失敗";
      });
  },
});

export default courseSlice.reducer;
