import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAnnouncements } from "../store/slices/announcementSlice";
import type { AppDispatch, RootState } from "../store/store";
import { BookOpen, Info, Clock, NotebookText } from "lucide-react";

const StudentAnnounce = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { announcements, loading, error } = useSelector(
    (state: RootState) => state.announcement
  );

  useEffect(() => {
    dispatch(fetchMyAnnouncements());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">載入中...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-medium mt-10">
        ⚠️ 載入錯誤：{error}
      </p>
    );

  return (
   
    <div className="w-[100%] h-[100%] xl:overflow-y-scroll mx-auto p-4 sm:p-8"> 
     
      <h1 className="text-4xl font-extrabold text-stone-800 mb-6 flex items-center border-b-2 border-stone-300 pb-3">
        <BookOpen className="w-8 h-8 mr-4 text-stone-600" />
        我的課程公告
      </h1>

      {announcements.length === 0 ? (
       
        <div className="p-8 bg-white border border-dashed border-stone-300 rounded-xl shadow-lg flex flex-col items-center text-stone-500">
          <Info className="w-8 h-8 mb-3 text-stone-400" />
          <p className="text-lg font-medium">目前尚無任何課程公告</p>
          <p className="text-sm mt-1">
            當老師或管理員發布新資訊時，將會顯示在此處。
          </p>
        </div>
      ) : (
   
        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="p-6 bg-white shadow-lg border border-stone-100 rounded-xl hover:shadow-xl hover:border-stone-400 transition duration-300 ease-in-out"
            >
              <div className="flex justify-between items-start mb-3">
           
                <h2 className="text-2xl font-bold text-stone-800 leading-snug">
                  {a.title}
                </h2>
           
                <p className="text-sm font-medium px-3 py-1 bg-stone-100 text-stone-600 rounded-full flex items-center shrink-0 ml-4 mt-1">
                  <NotebookText className="w-3.5 h-3.5 mr-1.5" />
                  {a.course?.title || "全局公告"}
                </p>
              </div>

              <div className="border-t border-stone-100 my-4"></div>

          
              <div className="text-stone-700 text-base leading-relaxed whitespace-pre-wrap">
                {a.content}
              </div>

        
              <div className="mt-5 pt-3 border-t border-stone-100">
                <p className="text-xs text-stone-500 flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1" />
                  發布於：
                  <span className="ml-1 font-mono">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnnounce;