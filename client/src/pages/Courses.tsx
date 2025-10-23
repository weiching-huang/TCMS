import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import type { AppDispatch, RootState } from "../store/store";
import { fetchAllCourses, deleteCourse } from "../store/slices/courseSlice";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { fetchAllStudents } from "../store/slices/studentSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, pagination, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const { teachers } = useSelector((state: RootState) => state.teacher);
  const { students } = useSelector((state: RootState) => state.student);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchAllStudents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllCourses({
        page: currentPage,
        limit: 6,
        search: searchQuery,
        teacherId,
        studentId,
      })
    );
  }, [dispatch, currentPage, searchQuery, teacherId, studentId]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchTerm);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/editcourse/${id}`);
  };
  const handleCourseClick = (courseId: string) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("確定要刪除這門課程嗎？")) {
      dispatch(deleteCourse(id))
        .unwrap()
        .then(() => {
          alert("刪除成功！");
        })
        .catch((err) => {
          alert("刪除失敗：" + err);
        });
    }
  };

  if (loading) return <p className="text-center mt-20">載入中...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  return (
    <div className="xl:h-[100%] xl:min-h-full px-4 min-h-screen">
      <div className="flex justify-between items-center mb-5 mx-auto mt-2 ">
        <h1 className=" text-4xl font-bold text-center p-1">所有課程</h1>
        <div className="relative flex">
          {/* 老師選單 */}
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="border rounded px-2 py-1 mx-2"
          >
            <option value="">選擇老師</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* 學生選單 */}
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border rounded px-2 py-1 mx-2"
          >
            <option value="">選擇學生</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="搜尋課程或老師..."
            className="w-50 px-4 py-2 pl-10 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-stone-500 bg-stone-100"
          />
          <button
            onClick={handleSearch}
            className="bg-stone-500 text-white px-4 rounded-r-lg hover:bg-stone-600 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <Link
          to="/dashboard/addcourse"
          className="p-1 bg-stone-500 text-white rounded-full hover:bg-stone-600 transition"
        >
          <Plus className="w-8 h-8" />
        </Link>
      </div>
      <div className="flex flex-col justify-between h-[92%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {courses.map((course) => (
            <motion.div
              key={course._id}
              className="relative bg-stone-100 rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col justify-between cursor-pointer"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onClick={() => handleCourseClick(course._id)}
            >
              <span
                className={`absolute top-1 right-1 px-3 py-1 rounded-full text-white text-sm font-semibold ${
                  course.status === "upcoming" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {course.status === "upcoming" ? "尚未開始" : "已開課"}
              </span>
              <h2 className="mt-3 text-2xl font-semibold mb-2">
                {course.title}
              </h2>

              {/* 老師 */}
              <p className="text-gray-700 mb-2">
                <span className="font-medium">老師：</span>
                {course.teacher?.name || "暫無"}
              </p>

              {/* 費用 & 總堂數 */}
              <p className="text-gray-700 mb-4">
                <span className="font-medium">費用：</span>NT${course.fee || 0}{" "}
                /<span className="font-medium ml-2">總堂數：</span>
                {course.totalSessions || 0} 堂
              </p>

              {/* 課程簡介 */}
              <p className="text-gray-700 mb-4">
                <span className="font-medium">課程簡介：</span>
                {course.description || "暫無描述"}
              </p>

              <div className="w-[100%] flex justify-around space-x-2">
                {/* 更新按鈕 */}
                <button
                  className="flex-1 py-2 bg-stone-500 text-white rounded-lg hover:bg-stone-400 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(course._id);
                  }}
                >
                  編輯
                </button>
                {/* 刪除按鈕 */}
                <button
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(course._id);
                  }}
                >
                  刪除
                </button>
              </div>
            </motion.div>
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
};

export default Courses;
