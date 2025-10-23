import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, UserCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface Course {
  _id: string;
  title: string;
  teacher?: { name: string };
}

interface AttendanceRecord {
  course: string;
  date: string;
  status: "present" | "absent" | "leave";
}

export default function StudentAttendance() {
  const dispatch = useDispatch<AppDispatch>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 取得學生報名課程
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [dispatch]);

  // 查看出缺勤
  const handleViewAttendance = async (courseId: string) => {
    if (expanded === courseId) {
      setExpanded(null); // 關閉
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/attendance/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 篩出該課程的出缺勤
      const filtered = res.data.filter((r: any) => r.course === courseId);
      setAttendanceData((prev) => ({ ...prev, [courseId]: filtered }));
      setExpanded(courseId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 學生請假
  const handleLeave = async (courseId: string, courseTitle: string) => {
    const confirmLeave = window.confirm(`確定要請假「${courseTitle}」嗎？`);
    if (!confirmLeave) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/attendance/${courseId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "請假失敗");
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8 flex items-center">
          <CalendarDays className="mr-3 text-stone-700" />
          我的課程出缺勤管理
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500">目前尚無報名的課程。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                layout
                className="bg-white border border-stone-200 shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-stone-800 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-sm text-stone-600">
                    👩‍🏫 {course.teacher?.name || "未指定老師"}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleLeave(course._id, course.title)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition font-medium cursor-pointer"
                  >
                    📝 請假
                  </button>
                  <button
                    onClick={() => handleViewAttendance(course._id)}
                    className="flex-1 bg-stone-700 hover:bg-stone-800 text-white py-2 rounded-xl transition font-medium cursor-pointer"
                  >
                    🕒 查看出缺勤
                  </button>
                </div>

                {/* 出缺勤區塊 */}
                <AnimatePresence>
                  {expanded === course._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm"
                    >
                      <h3 className="font-semibold text-stone-700 mb-2 flex items-center">
                        <UserCheck className="mr-2 h-4 w-4" />
                        出缺勤紀錄
                      </h3>
                      {loading ? (
                        <p className="text-gray-500 text-center">載入中...</p>
                      ) : attendanceData[course._id]?.length > 0 ? (
                        <table className="w-full text-left border-t border-stone-200">
                          <thead>
                            <tr className="text-stone-600">
                              <th className="py-2">日期</th>
                              <th>狀態</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceData[course._id].map((rec, i) => (
                              <tr key={i} className="border-t border-stone-100">
                                <td className="py-2">
                                  {new Date(rec.date).toLocaleDateString()}
                                </td>
                                <td>
                                  {rec.status === "present" && (
                                    <span className="text-green-600 font-medium">
                                      出席
                                    </span>
                                  )}
                                  {rec.status === "absent" && (
                                    <span className="text-red-500 font-medium">
                                      缺席
                                    </span>
                                  )}
                                  {rec.status === "leave" && (
                                    <span className="text-yellow-600 font-medium">
                                      請假
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500 text-center">
                          尚無出缺勤資料
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
