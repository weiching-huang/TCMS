import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

interface Course {
  _id: string;
  title: string;
  description: string;
  fee: number;
  totalSessions: number;
  maxStudents: number;
}

export default function NewCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchNewCourses() {
      try {
        const res = await axios.get(`${API_URL}/courses/ads`);
        setCourses(res.data.data);
      } catch (err) {
        console.error(err);
        alert("無法取得新開課程");
      } finally {
        setLoading(false);
      }
    }
    fetchNewCourses();
  }, []);

  async function handleEnroll(courseId: string) {
    if (!confirm("確定要報名這門課程嗎？")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("請先登入學生帳號");
        return;
      }

      const res = await axios.post(
        `${API_URL}/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "報名成功！");
      } else {
        toast.error(res.data.message || "報名失敗");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        alert("報名失敗");
      }
    }
  }

  if (loading) return <p className="p-6">載入中...</p>;

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 xl:h-[100%] xl:min-h-full px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎉 新開課程列表</h1>

      {courses.length === 0 ? (
        <p>目前沒有新開課程。</p>
      ) : (
         <div className="flex flex-col justify-between h-[96%]">
          {/* 課程卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col justify-between h-full p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-1">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

                  <div className="space-y-1 text-sm text-gray-500">
                    <p>堂數：{course.totalSessions}</p>
                    <p>上限人數：{course.maxStudents}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-lg font-bold text-blue-600 mb-3">
                    NT$ {course.fee.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-gradient-to-r from-stone-600 to-blue-300 text-white font-medium py-2.5 rounded-xl hover:from-stone-700 hover:to-blue-600 transition-colors cursor-pointer"
                  >
                    報名課程
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 📍分頁按鈕 */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-stone-100"
            >
              上一頁
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === i + 1
                    ? "bg-stone-600 text-white border-stone-600"
                    : "hover:bg-stone-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-stone-100"
            >
              下一頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
