import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleAnnouncement } from "../store/slices/announcementSlice";
import { deleteAnnouncement } from "../store/slices/announcementSlice";
import { useNavigate } from "react-router-dom";

const Announcement = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedAnnouncement = useSelector(
    (state: RootState) => state.announcement.selectedAnnouncement
  );
  const loading = useSelector((state: RootState) => state.announcement.loading);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleAnnouncement(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("確定要刪除這則公告嗎？")) {
      await dispatch(deleteAnnouncement(id));
      navigate("/dashboard/announcements");
    }
  };

  if (loading) return <p>載入中...</p>;
  if (!selectedAnnouncement) return <p>公告未找到。</p>;

  return (
    <div className="flex justify-center items-center h-[85vh] lg:h-[100%]">
      <div
        className="lg:h-[100%] lg:w-[80%] 
           bg-stone-100 min-w-xl h-[90%] rounded-xl shadow-lg p-5 flex flex-col justify-between"
      >
        <div className="mt-3 text-3xl font-bold ">
          {selectedAnnouncement.title}
        </div>
        <div className="mt-4 rounded-xl text-xl bg-stone-300 h-[80%] p-5">
          {selectedAnnouncement.content}
        </div>
        <div className="mt-2 text-end text-md text-gray-500">
          發布時間：{new Date(selectedAnnouncement.createdAt).toLocaleString()}
        </div>
       <div className="flex w-[100%] justify-around mt-2">
          {/*管理者才能看到的刪除按鈕 */}
          {user?.role === "admin" && (
            <button
              onClick={handleDelete}
              className="w-36 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              刪除公告
            </button>
          )}
          <button
            onClick={() => navigate(-1)} 
            className="w-36 px-4 py-2 bg-stone-500 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
          >
            返回
          </button>
       </div>
      </div>
    </div>
  );
};

export default Announcement;
