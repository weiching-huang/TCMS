import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// 引入更多 Lucide icons 來美化資訊顯示
import {
  Users,
  BookOpen,
  Info,
  User,
  DollarSign,
  CalendarDays,
  Percent,
  Clock,
  FileText,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  teacher?: Teacher;
  totalSessions?: number;
  maxStudents?: number;
  fee?: number;
  status?: "upcoming" | "completed";
  teacherShareRatio?: number;
  adminShareRatio?: number;
  materials?: string[];
  announcements?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const [userRole, setUserRole] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const authHeader = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const roleFromStorage = localStorage.getItem("userRole");
      setUserRole(roleFromStorage);

      const isAuthorized = roleFromStorage !== "student";

      try {
        const resCourse = await axios.get(`${API_URL}/courses/${courseId}`, {
          headers: authHeader,
        });
        setCourse(resCourse.data.data);
      } catch (courseErr) {
        console.error("獲取課程資料失敗:", courseErr);
        throw courseErr;
      }

      if (isAuthorized) {
        try {
          const resStudents = await axios.get(
            `${API_URL}/courses/${courseId}/students`,
            { headers: authHeader }
          );
          const studentList: Student[] = resStudents.data.data.map(
            (s: any) => ({
              _id: s.student._id,
              name: s.student.name,
              email: s.student.email,
            })
          );
          setStudents(studentList);
        } catch (studentErr: any) {
          if (studentErr.response?.status !== 403) {
            console.error("獲取學生名單失敗:", studentErr);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "載入資料失敗");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        資料載入中...
      </p>
    );
  if (error)
    return <p className="text-red-600 text-center mt-10">⚠️ 錯誤：{error}</p>;
  if (!course)
    return (
      <p className="text-center text-gray-500 mt-10">無法找到課程資料。</p>
    );
  const isAuthorized = userRole !== "student";
  const getStatusClasses = (status: "upcoming" | "completed" | undefined) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 border border-gray-100">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 flex items-center">
            <BookOpen className="w-9 h-9 mr-4 text-blue-600" />
            {course.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* 基本資訊區塊 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
            <Info className="w-6 h-6 mr-3 text-blue-600" /> 課程詳情
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 任課老師 */}
            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-200 hover:shadow-lg hover:border-blue-300">
              <p className="text-gray-500 text-sm flex items-center mb-1">
                <User className="w-4 h-4 mr-2 text-blue-500" /> 任課老師
              </p>
              <p className="text-gray-800 font-semibold text-lg">
                {course.teacher?.name || "未指定老師"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {course.teacher?.email}
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-200 hover:shadow-lg hover:border-blue-300">
              <p className="text-gray-500 text-sm flex items-center mb-1">
                <CalendarDays className="w-4 h-4 mr-2 text-blue-500" /> 堂數 /
                上限
              </p>
              <p className="text-gray-800 font-semibold text-lg">
                {course.totalSessions ?? "未設定"} 堂 /{" "}
                {course.maxStudents ?? "未設定"} 人
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-200 hover:shadow-lg hover:border-blue-300">
              <p className="text-gray-500 text-sm flex items-center mb-1">
                <DollarSign className="w-4 h-4 mr-2 text-blue-500" /> 課程費用
              </p>
              <p className="text-gray-800 font-bold text-xl">
                {course.fee ? `NT$${course.fee.toLocaleString()}` : "未設定"}
              </p>
            </div>

            <div
              className={`p-5 rounded-xl shadow-md border ${getStatusClasses(
                course.status
              )} transition duration-200 hover:shadow-lg`}
            >
              <p className="text-sm font-medium flex items-center mb-1">
                <Clock className="w-4 h-4 mr-2" /> 課程狀態
              </p>
              <p className="text-xl font-extrabold mt-1">
                {course.status === "upcoming"
                  ? "即將開課"
                  : course.status === "completed"
                  ? "已開課"
                  : "未知"}
              </p>
            </div>

            {isAuthorized && (
              <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-200 hover:shadow-lg hover:border-blue-300">
                <p className="text-gray-500 text-sm flex items-center mb-1">
                  <Percent className="w-4 h-4 mr-2 text-blue-500" /> 收入分配
                </p>
                <p className="text-gray-800 font-semibold text-lg">
                  教師: {course.teacherShareRatio ?? 0}% / 管理員:{" "}
                  {course.adminShareRatio ?? 0}%
                </p>
              </div>
            )}

            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 transition duration-200 hover:shadow-lg hover:border-blue-300">
              <p className="text-gray-500 text-sm flex items-center mb-1">
                <FileText className="w-4 h-4 mr-2 text-blue-500" /> 輔助資料
              </p>
              <p className="text-gray-800 font-semibold text-lg">
                教材: {course.materials?.length || 0} 份 / 公告:{" "}
                {course.announcements?.length ?? 0} 則
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200 col-span-full md:col-span-2 lg:col-span-2 transition duration-200 hover:shadow-lg hover:border-blue-300">
              <p className="text-gray-500 text-sm flex items-center mb-1">
                <Clock className="w-4 h-4 mr-2 text-blue-500" /> 時間軸
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-800 font-semibold text-base">
                    建立於:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(course.createdAt || "").toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-base">
                    最近更新:
                  </p>
                  <p className="text-gray-600 text-sm">
                    {new Date(course.updatedAt || "").toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAuthorized && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-7 h-7 mr-3 text-blue-600" />
                已報名學生名單 ({students.length} 人)
              </div>

              {students.length > 0 && (
                <button
                  onClick={toggleExpand}
                  className="px-4 py-1.5 text-sm font-medium rounded-full transition duration-150 ease-in-out 
                                 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isExpanded ? "▲ 收合名單" : "▼ 展開名單"}
                </button>
              )}
            </h2>

            {students.length > 0 ? (
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          姓名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {students.map((s, index) => (
                        <tr
                          key={s._id}
                          className={
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50 hover:bg-blue-50 transition duration-150 ease-in-out"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {s.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {s.email}
                          </td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 p-5 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center shadow-sm">
                <Info className="w-5 h-5 mr-3 text-yellow-500" />
                目前沒有學生報名此課程。
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
