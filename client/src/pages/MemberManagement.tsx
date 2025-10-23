import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  registerUser,
  updateUser,
  deleteUser,
} from "../store/slices/authSlice";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { fetchAllStudents } from "../store/slices/studentSlice";

interface FormState {
  name: string;
  email: string;
  password?: string;
  role: "teacher" | "student";
}

const MemberManagement = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { teachers } = useSelector((state: RootState) => state.teacher);
  const { students } = useSelector((state: RootState) => state.student);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "teacher",
  });
  const [editUserId, setEditUserId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchAllStudents());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || (!editUserId && !form.password)) {
      alert("請填寫完整資料");
      return;
    }

    if (editUserId) {
      // 更新使用者
      const updateData: Partial<FormState> = { ...form };
      if (!updateData.password) {
        delete updateData.password;
      }
      dispatch(updateUser({ userId: editUserId, data: updateData }))
        .unwrap()
        .then(() => {
          alert("更新成功！");
          setEditUserId(null);
          setForm({ name: "", email: "", password: "", role: "teacher" });
          dispatch(fetchAllTeachers());
          dispatch(fetchAllStudents());
        })
        .catch((err) => alert("更新失敗：" + err));
    } else {
      // 註冊使用者
      const payload = {
        name: form.name,
        email: form.email,
        // 由於上面已檢查過，這裡用非空斷言是安全的
        password: form.password!,
        role: form.role,
      };
      dispatch(registerUser(payload))
        .unwrap()
        .then(() => {
          alert("註冊成功！");
          setForm({ name: "", email: "", password: "", role: "teacher" });
          dispatch(fetchAllTeachers());
          dispatch(fetchAllStudents());
        })
        .catch((err) => alert("註冊失敗：" + err));
    }
  };

  const handleEdit = (userId: string, role: "teacher" | "student") => {
    const user =
      role === "teacher"
        ? teachers.find((t) => t._id === userId)
        : students.find((s) => s._id === userId);

    if (user) {
      setEditUserId(userId);
      setForm({
        name: user.name,
        email: user.email || "",
        password: "",
        role,
      });
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm("確定要刪除此使用者嗎？")) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => alert("刪除成功"))
        .catch((err) => alert("刪除失敗：" + err));
    }
  };

  return (
    <div className="flex flex-col xl:h-[100%] xl:min-h-full min-h-screen px-8">
      <h1 className="text-3xl font-bold mb-5 mt-5">成員管理</h1>
      {/* 註冊 / 更新表單 */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          {editUserId ? "更新使用者資料" : "註冊新使用者"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="name"
            placeholder="姓名"
            value={form.name}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />

          {/* 密碼輸入框 */}
          <input
            name="password"
            type="password"
            // 調整：將提示文字放在 placeholder 內，更自然
            placeholder={editUserId ? "留空不修改密碼" : "密碼"}
            value={form.password || ""}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />

          {/* 角色選擇 */}
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            // 調整：與輸入框保持一致的樣式
            className="p-3 border border-gray-300 rounded-md bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          >
            <option value="teacher">老師 (teacher)</option>
            <option value="student">學生 (student)</option>
          </select>
        </div>

        <div className="w-full flex justify-end pt-5">
          <button
            type="submit"

            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            {editUserId ? "確認更新" : "立即註冊"}
          </button>
        </div>
      </form>
      {/* 成員列表 */}
      <div className="bg-stone-100 p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">老師列表</h2>
        <ul>
          {teachers.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center border-b py-1"
            >
              <span>
                {t.name} ({t.email})
              </span>
              <div>
                <button
                  onClick={() => handleEdit(t._id, "teacher")}
                  className="mr-2 px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 cursor-pointer"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-white cursor-pointer"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="font-semibold mt-4 mb-2">學生列表</h2>
        <ul>
          {students.map((s) => (
            <li
              key={s._id}
              className="flex justify-between items-center border-b py-1"
            >
              <span>
                {s.name} ({s.email})
              </span>
              <div>
                <button
                  onClick={() => handleEdit(s._id, "student")}
                  className="mr-2 px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 cursor-pointer"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-white cursor-pointer"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {loading && <p className="mt-4 text-red-500">載入中...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default MemberManagement;
