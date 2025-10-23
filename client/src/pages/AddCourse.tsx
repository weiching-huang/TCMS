// pages/AddCourse.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { addCourse } from "../store/slices/courseSlice"; 
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { useNavigate } from "react-router-dom";


const AddCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { teachers } = useSelector((state: RootState) => state.teacher); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [teacherId, setTeacherId] = useState("");
  const [maxStudents, setMaxStudents] = useState<number>(0);
  const [materials, setMaterials] = useState<string[]>([]);
  const [teacherShareRatio, setTeacherShareRatio] = useState<number>(60);
  const [adminShareRatio, setAdminShareRatio] = useState<number>(40);

  useEffect(() => {
    dispatch(fetchAllTeachers()); // 獲取老師列表
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基本驗證
    if (
      !title ||
      !description ||
      fee <= 0 ||
      totalSessions <= 0 ||
      !teacherId ||
      maxStudents <= 0
    ) {
      alert("請完整填寫所有欄位！");
      return;
    }

    if (teacherShareRatio + adminShareRatio !== 100) {
      alert("分帳比例必須加總為100%");
      return;
    }

    try {
      await dispatch(
        addCourse({
          title,
          description,
          fee,
          totalSessions,
          teacher: teacherId,
          maxStudents,
          materials,
          teacherShareRatio,
          adminShareRatio,
        })
      ).unwrap();
      alert("新增課程成功！");
      navigate("/dashboard/courses");
    } catch (err: any) {
      alert("新增失敗：" + err);
    }
  };

  return (
    <div className="h-[100%] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className=" shadow-2xl rounded-2xl p-8 xl:w-[80%] w-[100%] bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-gray-800"
      >
        <h1 className="text-2xl font-bold text-center text-stone-700">
          新增課程
        </h1>

        {/* 課程名稱 */}
        <div>
          <label className="block font-semibold mb-2 text-stone-700">課程名稱</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
          />
        </div>

        {/* 課程描述 */}
        <div>
          <label className="block font-semibold mb-2 text-stone-700 mt-2">課程描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            rows={4}
          />
        </div>

        {/* 老師選擇 */}
        <div>
          <label className="block font-semibold mb-2 text-stone-700 mt-1">指派老師</label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
          >
            <option value="">選擇老師</option>
            {teachers?.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">費用 (NT$)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">總堂數</label>
            <input
              type="number"
              value={totalSessions}
              onChange={(e) => setTotalSessions(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">最多學生人數</label>
            <input
              type="number"
              value={maxStudents}
              onChange={(e) => setMaxStudents(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="mt-1 block font-semibold mb-2 text-stone-700">教材 (可選)</label>
            <input
              type="text"
              value={materials.join(",")}
              onChange={(e) => setMaterials(e.target.value.split(","))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <label className="mt-1 block font-semibold mb-2 text-stone-700">老師分帳比例 (%)</label>
            <input
              type="number"
              value={teacherShareRatio}
              onChange={(e) => setTeacherShareRatio(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">管理者分帳比例 (%)</label>
            <input
              type="number"
              value={adminShareRatio}
              onChange={(e) => setAdminShareRatio(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 w-full py-3 mt-4 text-white rounded-xl font-bold bg-gradient-to-r from-amber-300 to-orange-900 hover:from-amber-700 hover:to-orange-700 transition duration-200"
        >
          新增課程
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
