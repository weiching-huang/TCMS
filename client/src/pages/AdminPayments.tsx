import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { toast } from "react-toastify";
import { fetchAllCourses } from "../store/slices/courseSlice";

const API_URL = import.meta.env.VITE_API_URL;


interface Payment {
  _id: string;
  status: "completed" | "pending" | "refunded";
  amount: number;
  teacherShare: number;
  adminShare: number;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminPayments = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    courses,
    loading: courseLoading,
    error,
  } = useSelector((state: RootState) => state.course);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    dispatch(fetchAllCourses({ limit: 0 }));
  }, [dispatch]);

  const fetchPayments = async (courseId: string) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/courses/${courseId}/payments`, {
        headers: authHeader,
      });
      setPayments(res.data.data);
    } catch (err) {
      toast.error("❌ 取得付款紀錄失敗");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (studentId: string) => {
    const confirmPay = window.confirm(
      "⚠️確定已繳款完成?"
    );
    if (!confirmPay) return;
    try {
      await axios.put(
        `${API_URL}/courses/${selectedCourse}/pay`,
        { studentId },
        { headers: authHeader }
      );
      toast.success("✅ 已標記繳費");
      fetchPayments(selectedCourse);
    } catch {
      toast.error("繳費失敗");
    }
  };


  const handleRefund = async (studentId: string) => {
    const confirmRefund = window.confirm(
      "⚠️確定要替這位學生退款嗎？此操作不可逆！"
    );
    if (!confirmRefund) return;
    try {
      await axios.put(
        `${API_URL}/courses/${selectedCourse}/refund`,
        { studentId },
        { headers: authHeader }
      );
      toast.info("💸 已退款");
      fetchPayments(selectedCourse);
    } catch {
      toast.error("退款失敗");
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "未繳費";
      case "refunded":
        return "已退未上費用";
      case "completed":
        return "完成繳費";
      default:
        return "未知";
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        💰 學生繳費管理系統
      </h1>

      {/* 課程選擇 */}
      <div className="flex justify-center mb-6">
        {courseLoading ? (
          <p className="text-gray-500">載入課程中...</p>
        ) : error ? (
          <p className="text-red-500">無法載入課程：{error}</p>
        ) : (
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchPayments(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">請選擇課程</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 學生清單 */}
      {loading ? (
        <p className="text-center text-gray-500">載入中...</p>
      ) : payments.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">學生姓名</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-center">金額</th>
                <th className="px-6 py-3 text-center">狀態</th>
                <th className="px-6 py-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr
                  key={pay._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3">{pay.student.name}</td>
                  <td className="px-6 py-3">{pay.student.email}</td>
                  <td className="px-6 py-3 text-center">${pay.amount}</td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pay.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : pay.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : pay.status === "refunded"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusText(pay.status)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center space-x-2">
                    {pay.status === "pending" && (
                      <button
                        onClick={() => handlePay(pay.student._id)}
                        className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition cursor-pointer"
                      >
                        標記已繳
                      </button>
                    )}
                    {pay.status === "completed" && (

                        <button
                          onClick={() => handleRefund(pay.student._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
                        >
                          退款
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedCourse ? (
        <p className="text-center text-gray-500">目前沒有付款紀錄。</p>
      ) : (
        <p className="text-center text-gray-500">請先選擇課程。</p>
      )}
    </div>
  );
};

export default AdminPayments;
