import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { createAnnouncement } from "../store/slices/announcementSlice";
import { fetchAnnouncements } from "../store/slices/announcementSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const TeacherAddAnnounce = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("標題與內容不能為空");
      return;
    }
    dispatch(
      createAnnouncement({ courseId: courseId || undefined, title, content })
    )
      .unwrap()
      .then((res) => {
        window.alert(res.message || "公告新增成功！");
        setTitle("");
        setContent("");
        dispatch(fetchAnnouncements({ page: 1, limit: 12 }));
      })
      .catch((err) => {
        setMessage(err || "公告新增失敗！");
      });
  };
  return (
    <div className="flex justify-center items-center h-[85vh] xl:h-[100%] w-[100%]">
      <div
        className="xl:h-[100%] w-[80%] 
           bg-stone-100 h-[90%] rounded-xl shadow-lg p-5 flex flex-col justify-between"
      >
        <div className="uppercase tracking-wide text-xl text-indigo-500 font-semibold mb-2 h-[10%] mt-2">
          新增公告
        </div>
        <div className="ml-2 h-[90%] bg-stone-300 p-5 rounded-xl">
          <form
            onSubmit={handleSubmit}
            className="ml-2 h-[90%] bg-stone-300 p-5 rounded-xl flex flex-col gap-3"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                標題
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2  bg-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="輸入公告標題"
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                內容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[300px] p-2 rounded-md bg-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="輸入公告內容"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition cursor-pointer"
              >
                發布公告
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-24 ml-2 px-4 py-2 bg-stone-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
              >
                返回
              </button>
            </div>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAddAnnounce;
