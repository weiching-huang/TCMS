import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import { fetchAllCourses } from "../store/slices/courseSlice";

export default function TeacherCourses() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { courses, pagination, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const handleCourseClick = (courseId: string) => {
    if (from === "attendance") {
      navigate(`/dashboard/attendance/${courseId}`);
    } else {
      navigate(`/dashboard/courses/${courseId}`);
    }
  };
  const handleAddAnnouncement = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/teacheraddannounce/${courseId}`);
  };

  useEffect(() => {
    dispatch(fetchAllCourses({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤：{error}</p>;

  return (
    <div className="xl:h-[100%] xl:min-h-full px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-3">
        {from === "attendance" ? "點名系統 - 課程列表" : "我的課程"}
      </h1>

      <div className="flex flex-col justify-between h-[92%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-5 border border-stone-300 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer bg-white flex flex-col justify-between"
              onClick={() => handleCourseClick(course._id)}
            >
              <div className="flex flex-col justify-between h-50">
                <h2 className="text-2xl font-extrabold text-stone-800 mb-1">
                  {course.title}
                </h2>
                <p className="text-stone-600 text-sm mb-3 line-clamp-2">
                  {course.description || "無課程描述"}
                </p>
                <p className="text-sm text-stone-500 font-medium bg-stone-100 px-2 py-1 rounded inline-block mt-2">
                  總堂數：{course.totalSessions}
                </p>
              </div>
              {from === "myCourses" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddAnnouncement(course._id, e);
                    }}
                    className="px-4 py-2 text-sm font-semibold bg-zinc-500 text-white rounded-lg shadow-md hover:bg-zinc-700 transition duration-150 flex items-center cursor-pointer"
                  >
                    <BellRing className="mr-3" />
                    新增公告
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* 分頁按鈕 */}
        {pagination && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg  hover:cursor-pointer ${
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
    </div>
  );
}
