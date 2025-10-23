import { Link } from "react-router-dom";
import { Wallet, Users } from "lucide-react";

const Finance = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      {/* 標題 */}
      <h1 className="text-3xl font-bold text-stone-800 mb-10">
        財務管理系統
      </h1>

      {/* 兩個主卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* 教師分帳 */}
        <Link
          to="/dashboard/adminpayouts"
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl 
                     transition-all duration-300 p-8 flex flex-col items-center 
                     justify-center text-center hover:-translate-y-1"
        >
          <div className="bg-stone-100 rounded-full p-5 mb-6 group-hover:bg-stone-200 transition-colors">
            <Wallet className="w-10 h-10 text-stone-700" />
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-3">
            教師分帳系統
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            管理每位老師的授課報酬與分帳記錄，查看薪資發放狀態。
          </p>
        </Link>

        {/* 學生繳費 */}
        <Link
          to="/dashboard/adminpayments"
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl 
                     transition-all duration-300 p-8 flex flex-col items-center 
                     justify-center text-center hover:-translate-y-1"
        >
          <div className="bg-stone-100 rounded-full p-5 mb-6 group-hover:bg-stone-200 transition-colors">
            <Users className="w-10 h-10 text-stone-700" />
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-3">
            學生繳費管理
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            追蹤學生繳費進度，管理課程費用、退費與繳費紀錄。
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Finance;
