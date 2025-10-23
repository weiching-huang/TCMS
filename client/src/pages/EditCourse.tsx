// pages/EditCourse.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCourseById, updateCourse } from "../store/slices/courseSlice";
import { fetchAllTeachers } from "../store/slices/teacherSlice";
import { useNavigate, useParams } from "react-router-dom";

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentCourse, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const { teachers } = useSelector((state: RootState) => state.teacher);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [teacherId, setTeacherId] = useState("");
  const [maxStudents, setMaxStudents] = useState<number>(0);
  const [materials, setMaterials] = useState<string[]>([]);
  const [status, setStatus] = useState<"upcoming" | "completed">("upcoming");
  const [teacherShareRatio, setTeacherShareRatio] = useState<number>(60);
  const [adminShareRatio, setAdminShareRatio] = useState<number>(40);

  // 取課程
  useEffect(() => {
    if (id) dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  // 取老師列表
  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    if (currentCourse) {
      setTitle(currentCourse.title ?? "");
      setDescription(currentCourse.description ?? "");
      setFee(currentCourse.fee ?? 0);
      setTotalSessions(currentCourse.totalSessions ?? 0);
      setStatus(currentCourse.status ?? "upcoming");
      setMaxStudents(currentCourse.maxStudents ?? 0);
      setMaterials(
        Array.isArray(currentCourse.materials) ? currentCourse.materials : []
      );

      setTeacherShareRatio(currentCourse.teacherShareRatio ?? 60);
      setAdminShareRatio(currentCourse.adminShareRatio ?? 40);
    }
    if (currentCourse && currentCourse.teacher) {
      const resolvedTeacherId =
        typeof currentCourse.teacher === "string"
          ? currentCourse.teacher
          : currentCourse.teacher._id ?? "";
      setTeacherId(resolvedTeacherId);
    } else {
      setTeacherId("");
    }
  }, [currentCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        updateCourse({
          id: id!,
          data: {
            title,
            description,
            fee,
            totalSessions,
            teacher: teacherId,
            maxStudents,
            materials,
            status,
            teacherShareRatio,
            adminShareRatio,
          },
        })
      ).unwrap();
      alert("課程更新成功！");
      navigate("/dashboard/courses");
    } catch (err: any) {
      alert("更新失敗：" + err);
    }
  };

  if (loading) return <p className="text-center mt-20">載入中...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  if (!currentCourse)
    return (
      <p className="text-center mt-20">
        未找到課程資料，請檢查課程 ID 是否正確。
      </p>
    );

  return (
    <div className="h-[100%] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="shadow-2xl rounded-2xl p-8 xl:w-[80%] w-[100%] bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 text-gray-800"
      >
        <h1 className="text-2xl font-bold text-center text-stone-700">
          編輯課程
        </h1>

        {/* 課程名稱 */}
        <div>
          <label className="block font-semibold mb-2 text-stone-700">
            課程名稱
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
          />
        </div>

        {/* 課程描述 */}
        <div>
          <label className="block font-semibold mb-2 text-stone-700 mt-2">
            課程描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            rows={4}
          />
        </div>

        <div className="mt-1 grid grid-cols-2 gap-4">
          {/* 老師選擇 */}
          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">
              指派老師
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            >
              <option value="">選擇老師</option>
              {teachers?.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">
              課程狀態
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "upcoming" | "completed")
              }
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            >
              <option value="upcoming">尚未開始</option>
              <option value="completed">已開課</option>
            </select>
          </div>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">
              費用 (NT$)
            </label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">
              總堂數
            </label>
            <input
              type="number"
              value={totalSessions}
              onChange={(e) => setTotalSessions(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">
              最多學生人數
            </label>
            <input
              type="number"
              value={maxStudents}
              onChange={(e) => setMaxStudents(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="mt-1 block font-semibold mb-2 text-stone-700">
              教材(多樣請用，分隔)
            </label>
            <input
              type="text"
              // materials.join(',') 如果 materials 是 null/undefined 會出錯，但我們在 useEffect 中已確保它是 []
              value={materials.join(",")}
              onChange={(e) => setMaterials(e.target.value.split(","))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>
        </div>

        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <label className="mt-1 block font-semibold mb-2 text-stone-700">
              老師分帳比例 (%)
            </label>
            <input
              type="number"
              value={teacherShareRatio}
              onChange={(e) => setTeacherShareRatio(Number(e.target.value))}
              className="mt-1 w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-stone-700 mt-1">
              管理者分帳比例 (%)
            </label>
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
          className="mt-1 w-full py-3 mt-4 text-white rounded-xl font-bold bg-gradient-to-r from-amber-300 to-orange-900 hover:from-amber-700 hover:to-orange-700 transition duration-200 cursor-pointer"
        >
          更新課程
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
