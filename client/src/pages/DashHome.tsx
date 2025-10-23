import Calender from "../components/Calender";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { fetchAnnouncements } from "../store/slices/announcementSlice";
import {
  Trophy,
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  Snowflake,
} from "lucide-react";

const DashHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  //獲取公告的狀態
  const announcementState = useSelector(
    (state: RootState) => state.announcement
  );

  const announcements = announcementState.announcements;
  const loading = announcementState.loading;
  const error = announcementState.error;

  //時間
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  //天氣
  const [weather, _] = useState({ temp: 25, condition: "多雲" });
  useEffect(() => {
    // fetch("API_URL").then(...).then(setWeather)
  }, []);
  const getWeatherIcon = (condition: string) => {
    if (condition.includes("晴"))
      return <Sun className="w-10 h-10 text-yellow-500" />;
    if (condition.includes("多雲") || condition.includes("陰"))
      return <Cloud className="w-10 h-10 text-gray-400" />;
    if (condition.includes("雨"))
      return <CloudRain className="w-10 h-10 text-blue-400" />;
    if (condition.includes("雪"))
      return <Snowflake className="w-10 h-10 text-blue-200" />;
    return <CloudSun className="w-10 h-10 text-blue-300" />;
  };

  //獲獎
  const [awards] = useState([
    "王小明獲得鋼琴比賽第一名！",
    "李小華獲得舞蹈比賽最佳表現獎！",
  ]);
  // 公告
  useEffect(() => {
    dispatch(fetchAnnouncements({ limit: 12 }));
  }, [dispatch]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="xl:h-[100%]">
      <div className="mt-3 xl:mt-0 text-2xl px-1 pb-3">
        Welcome!! {user.role} {user.name}
      </div>
      <div className="flex flex-wrap h-[100%]">
        {/* 公告卡片*/}
        <div
          className="ml-3 md:h-[60%] xl:w-[60%] 
           bg-stone-100 w-[100%] rounded-xl shadow-lg "
        >
          <div className="md:flex w-[100%] h-[100%]">
            <div className="p-5 w-[100%] flex flex-col justify-between">
              <div className="uppercase tracking-wide text-lg text-indigo-500 font-semibold mb-2 h-[10%]">
                公告訊息
              </div>
              <div className="ml-2 h-[90%]">
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
                  announcements.slice(0, 12).map((announcement) => (
                    <div key={announcement._id} className="mb-2">
                      <Link
                        to={`announcements/${announcement._id}`}
                        className="block mt-1 text-m leading-tight font-medium text-black hover:underline"
                      >
                        {announcement.title}
                      </Link>
                    </div>
                  ))}
              </div>
              <p className="mt-2 text-slate-500 text-end w-[100%]">
                <Link to="announcements/" className="hover:underline">
                  更多訊息
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* 日期 */}
        <div className="mt-5 xl:mt-0 xl:ml-6 ml-3 h-[50%] xl:w-[36%] rounded-xl shadow-lg w-[100%]">
          <div className="md:flex w-[100%] h-[100%]">
            <div className="w-[100%] h-[100%] flex flex-col justify-between overflow-hidden ">
              <Calender />
            </div>
          </div>
        </div>
        <div className="w-[100%] p-3 lg:h-[30%] flex justify-around flex-wrap">
          {/* 獲獎 */}
          <div className="w-80 p-6 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-yellow-300/50 bg-gradient-to-br from-yellow-50 via-red-50 to-orange-100 text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold uppercase tracking-widest text-yellow-700">
                恭賀獲獎
              </h3>
              {/* 獲獎圖示：金色，較大 */}
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <ul className="list-disc list-inside text-base space-y-2">
              {" "}
              {/* 增加行高和字體大小 */}
              {awards.map((a, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 mt-1 block h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0"></span>{" "}
                  {a}
                </li>
              ))}
            </ul>
          </div>
          {/*天氣*/}
          <div className="w-80 p-6 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-300/50 bg-gradient-to-br from-blue-50 via-white to-sky-100 text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold uppercase tracking-widest text-blue-600">
                即時天氣
              </h3>
              {/* 天氣圖示：根據條件動態顯示 */}
              {getWeatherIcon(weather.condition)}
            </div>
            <p className="text-5xl text-center font-extrabold text-gray-900 mb-1">
              {weather.temp}°C
            </p>
            <p className="text-lg text-gray-600">{weather.condition}</p>
          </div>

          {/*時間*/}
          <div className="p-4 rounded-xl shadow-2xl w-80  bg-gradient-to-br from-slate-300 via-white to-slate-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-teal-300/50 flex flex-col justify-around mt-3 lg:mt-0">
            <h3 className="text-xl font-semibold uppercase tracking-widest text-slate-600 mb-3">
              現在時間
            </h3>
            <p className="text-5xl font-extrabold text-gray-800 mb-2 text-center">
              {time.toLocaleTimeString("zh-TW", { hour12: false })}
            </p>
            <p className="text-sm text-gray-600 tracking-wide">
              {time.toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
