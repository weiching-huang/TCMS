import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import announcementReducer from "./slices/announcementSlice";
import courseReducer from "./slices/courseSlice";
import teacherReducer from "./slices/teacherSlice";
import studentReducer from "./slices/studentSlice";
import payoutReducer from "./slices/payoutSlice";

// import 其他 slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    announcement: announcementReducer,
    course:courseReducer,
    teacher:teacherReducer,
    student:studentReducer,
    payout:payoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
