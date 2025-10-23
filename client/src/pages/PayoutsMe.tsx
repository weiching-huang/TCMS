import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMyPayouts } from "../store/slices/payoutSlice";

const PayoutsMe = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payouts, loading, error } = useSelector(
    (state: RootState) => state.payout
  );

  useEffect(() => {
    dispatch(fetchMyPayouts());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">載入中...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className=" xl:h-[100%] xl:min-h-full min-h-screen ">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-52">
        <h1 className="text-2xl font-bold mb-4 text-gray-700 text-center">
          💰 我的收入明細
        </h1>
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">月份</th>
              <th className="py-2 px-4 text-right">堂數</th>
              <th className="py-2 px-4 text-right">總金額</th>
              <th className="py-2 px-4 text-right">老師分帳</th>
              <th className="py-2 px-4 text-center">狀態</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length > 0 ? (
              payouts.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{p.month}</td>
                  <td className="py-2 px-4 text-right">{p.totalSessions}</td>
                  <td className="py-2 px-4 text-right">${p.totalAmount.toFixed(0)}</td>
                  <td className="py-2 px-4 text-right text-green-600 font-semibold">
                    ${p.teacherShare.toFixed(0)}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        p.status === "paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {p.status === "paid" ? "已發薪" : "待發放"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500"
                >
                  尚無收入紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsMe;
