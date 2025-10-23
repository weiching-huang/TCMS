import { useEffect, useState, useCallback, useMemo } from "react";
import { Send, CalendarCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface AttendanceRecord {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  status: "present" | "absent" | "leave";
  date: string;
}

interface StudentAttendanceStatus {
  _id: string;
  name: string;
  email: string;
  status: "present" | "absent" | "leave";
}

interface DailyAttendanceGroup {
  date: string;
  records: AttendanceRecord[];
}

const getStatusText = (status: "present" | "absent" | "leave") => {
  switch (status) {
    case "present":
      return "✅ 出席";
    case "absent":
      return "❌ 缺席";
    case "leave":
      return "📝 請假";
    default:
      return status;
  }
};

interface AttendanceGroupProps {
  group: DailyAttendanceGroup;
}

const AttendanceGroup: React.FC<AttendanceGroupProps> = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = useMemo(
    () =>
      new Date(group.date).toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [group.date]
  );

  const totalCount = group.records.length;
  const presentCount = group.records.filter(
    (r) => r.status === "present"
  ).length;

  return (
    <div className="mb-4 border rounded shadow-md">
      <div
        className="bg-stone-100 p-4 cursor-pointer flex justify-between items-center hover:bg-stone-200 transition duration-150"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-lg">📅 {formattedDate}</h3>
        <div className="text-sm text-gray-600 flex items-center">
          <span className="mr-3">
            出席：{presentCount} / 總人數：{totalCount}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* 展開的詳細表格 (Expanded Content) */}
      {isExpanded && (
        <div className="p-4 bg-white overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  學生姓名
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody>
              {group.records.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{r.student.name}</td>
                  <td className="px-4 py-2">{r.student.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-medium ${
                        r.status === "present"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {getStatusText(r.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function CourseAttendance() {
  const { courseId } = useParams<{ courseId: string }>();

  const [records, setRecords] = useState<DailyAttendanceGroup[]>([]);
  const [students, setStudents] = useState<StudentAttendanceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayTaken, setTodayTaken] = useState(false);
  const [courseName, setCourseName] = useState("載入中...");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const authHeader = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      //取得課程名稱和歷史紀錄
      const [resCourse, resRecords] = await Promise.all([
        axios.get(`${API_URL}/courses/${courseId}`, { headers: authHeader }),
        axios.get(`${API_URL}/attendance/${courseId}`, { headers: authHeader }),
      ]);

      setCourseName(resCourse.data.data.title);
      const historyRecords: DailyAttendanceGroup[] = resRecords.data;
      if (!Array.isArray(historyRecords)) {
        console.error("歷史紀錄 API 響應結構錯誤:", resRecords.data);
        throw new Error("歷史紀錄資料結構異常，請檢查後端回傳格式。");
      }
      setRecords(historyRecords);

      //判斷今日紀錄
      const today = new Date().toISOString().split("T")[0];
      const todayRecordGroup = historyRecords.find(
        (record) => new Date(record.date).toISOString().split("T")[0] === today
      );
      const isTodayTaken = !!todayRecordGroup;
      setTodayTaken(isTodayTaken);

      //取得學生名單
      const resStudents = await axios.get(
        `${API_URL}/courses/${courseId}/students`,
        { headers: authHeader }
      );
      const studentsData = resStudents.data?.data;
      if (!Array.isArray(studentsData)) {
        console.error("學生名單 API 響應結構錯誤:", resStudents.data);
        setStudents([]);
        return;
      }

      let studentList: StudentAttendanceStatus[] = studentsData.map(
        (s: any) => ({
          _id: s.student._id,
          name: s.student.name,
          email: s.student.email,
          status: "present" as "present" | "absent" | "leave",
        })
      );
      if (todayRecordGroup) {
        studentList = studentList.map((student) => {
          const existingRecord = todayRecordGroup.records.find(
            (r) => r.student._id === student._id
          );
          return existingRecord
            ? { ...student, status: existingRecord.status }
            : student;
        });
      }

      setStudents(studentList);
    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      console.error(
        `API 呼叫失敗 (Status: ${status || "N/A"})`,
        err.response ? err.response.data : err
      );

      if (status === 401 || status === 403) {
        alert("取得資料失敗：權限不足或登入過期，請重新登入。");
      } else {
        alert(`取得資料失敗：${message || "伺服器或網路錯誤"}`);
      }

      setRecords([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = (
    id: string,
    status: "present" | "absent" | "leave"
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status } : s))
    );
  };

  const handleSubmitToday = async () => {
    try {
      const recordsToSubmit = students.map((s) => ({
        student: s._id,
        status: s.status,
      }));

      await axios.post(
        `${API_URL}/attendance/${courseId}`,
        { records: recordsToSubmit },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("今日點名成功");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(`點名失敗：${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <p>載入中...</p>;

  return (
    <div className="p-6 xl:overflow-y-auto h-[100%]">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-2">
        課程 : <span className="text-green-800">{courseName}</span> 點名紀錄
      </h1>

      {todayTaken && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 text-center shadow-md">
          <p className="font-semibold text-lg">
            ⚠️ 今日已有紀錄！您正在*更新*點名狀態。
          </p>
          <p className="text-sm">請修改學生的出席狀態後，再次提交。</p>
        </div>
      )}
      <div className="mb-8 border-2 border-green-200 p-6 rounded-xl shadow-lg bg-stone-100">
     
        <h2 className="text-2xl font-bold text-neutral-700 mb-4 flex items-center">
          <CalendarCheck className="mr-3 mb-1" />
          {todayTaken ? "更新今日點名紀錄" : "新增今日點名"}
          <span className="ml-3 text-base font-medium text-gray-500">
            ({new Date().toLocaleDateString()})
          </span>
        </h2>

       
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-neutral-100 text-neutral-800">
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  學生姓名
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50 transition duration-100"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange(
                          s._id,
                          e.target.value as "present" | "absent" | "leave"
                        )
                      }
                      className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    >
                      <option value="present">出席</option>
                      <option value="absent">缺席</option>
                      <option value="leave">請假</option>
                    </select>
                  </td>
                </tr>
              ))}
             
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    本課程目前沒有學生名單。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      
        <div className="flex justify-end">
          <button
            onClick={handleSubmitToday}
            disabled={students.length === 0}
            className={`w-full sm:w-auto px-5 py-2.5 font-semibold rounded-lg shadow-md flex items-center justify-center transition duration-200 transform
                        ${
                          students.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-neutral-600 text-white hover:bg-neutral-700 hover:scale-[1.05] cursor-pointer"
                        }`}
          >
            <Send className="mr-2" />
            {todayTaken ? "提交更新點名" : "提交今日點名"}
          </button>
        </div>
      </div>

      {/* 歷史點名紀錄 */}
      <div className="mb-6 border border-stone-200 p-5 rounded-lg shadow-xl bg-stone-50">
        <h2 className="text-xl font-bold text-stone-700 mb-4 pb-2 border-b border-stone-300 flex items-center">
          歷史點名紀錄
        </h2>

        <div className="space-y-4">
          {records.length > 0
            ? 
              records.map((group) => (
                <AttendanceGroup key={group.date} group={group} />
              ))
            : 
              !loading && (
                <p className="text-gray-500 p-4 bg-white rounded-lg border border-gray-100">
                  目前沒有歷史點名紀錄，請新增點名紀錄。
                </p>
              )}
        </div>
      </div>
    </div>
  );
}
