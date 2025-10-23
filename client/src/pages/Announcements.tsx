import { useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { Link } from "react-router-dom";
import { fetchAnnouncements } from "../store/slices/announcementSlice";

const Announcements = () => {
  const dispatch = useDispatch<AppDispatch>();
  // ✅ 從 Redux Store 獲取公告的狀態
  const announcementState = useSelector(
    (state: RootState) => state.announcement
  );
  const [page, setPage] = useState(1);
  const announcements = announcementState.announcements;
  const loading = announcementState.loading;
  const error = announcementState.error;
  const totalPages = announcementState.totalPages;

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // ✅ 在元件載入時呼叫 API
  useEffect(() => {
    dispatch(fetchAnnouncements({ page, limit: 13 }));
  }, [dispatch, page]);

  return (
    <div className="flex justify-center items-center h-[85vh] xl:h-[100%] w-[100%]">
      <div
        className="xl:h-[100%] w-[80%] 
           bg-stone-100 h-[90%] rounded-xl shadow-lg p-5 flex flex-col justify-between"
      >
        <div className="uppercase tracking-wide text-xl text-indigo-500 font-semibold mb-2 h-[10%] mt-2">
          公告訊息
        </div>
        <div className="ml-2 h-[90%] bg-stone-300 p-5 rounded-xl">
          {/* 1. 處理載入狀態 */}
          {loading && <p>正在載入公告...</p>}
          {/* 2. 處理錯誤狀態 */}
          {error && <p className="text-red-500">錯誤：{error}</p>}
          {/* 3. 處理沒有公告的狀態 */}
          {!loading && !error && announcements.length === 0 && (
            <p>目前沒有公告訊息。</p>
          )}
          {/* 4. 渲染公告列表 */}
          {!loading &&
            !error &&
            announcements.length > 0 &&
            announcements.map((announcement) => (
              <div key={announcement._id} className="mb-2">
                <Link
                  to={`${announcement._id}`}
                  className="block mt-1 text-m leading-tight font-medium text-black hover:underline"
                >
                  {announcement.title}
                </Link>
              </div>
            ))}
        </div>
                <div className="flex justify-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
            className={`px-4 py-2 mx-1 rounded-md ${
              page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            } text-white`}
          >
            上一頁
          </button>
          <span className="px-4 py-2 mx-1 text-gray-700">
            第 {page} 頁 / 共 {totalPages} 頁
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages || loading}
            className={`px-4 py-2 mx-1 rounded-md ${
              page === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            } text-white`}
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
