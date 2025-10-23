import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchAllCourses } from "../store/slices/courseSlice";

export default function StudentCourses() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { courses, pagination, loading, error } = useSelector(
    (state: RootState) => state.course
  );

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    dispatch(fetchAllCourses({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/dashboard/courses/${courseId}`);
  };
  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤：{error}</p>;

  return (
    <div className="p-6 xl:h-[100%] xl:min-h-full px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">我報名的課程</h1>
      {courses.length === 0 ? (
        <p className="text-gray-500">目前沒有報名任何課程</p>
      ) : (
        <div className="flex flex-col justify-between h-[92%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-4 border rounded-lg shadow bg-white hover:bg-stone-100 cursor-pointer"
                onClick={() => handleCourseClick(course._id)}
              >
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-gray-600 mb-1">{course.description}</p>
                <p className="text-gray-500 mb-1">
                  老師：{course.teacher?.name || "未指定"}
                </p>
                <p className="text-gray-500">總堂數：{course.totalSessions}</p>
              </div>
            ))}
          </div>

          {/* 分頁按鈕 */}
          {pagination && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-stone-500 text-white"
                      : "bg-stone-200 text-gray-700 hover:bg-stone-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
