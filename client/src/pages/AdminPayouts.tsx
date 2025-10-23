import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);

  const getPaymentStatusText = (status: 'paid' | 'pending') => {
  switch (status) {
    case 'paid':
      return '已發薪';
    case 'pending':
      return '待發放';
    default:
      return status; 
  }
};

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/payouts${month ? `?month=${month}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayouts(res.data);

      // 計算總收入和淨收入
      const total = res.data.reduce(
        (acc: number, p: any) => acc + (p.totalAmount || 0),
        0
      );
      const net = res.data.reduce(
        (acc: number, p: any) =>
          acc + ((p.totalAmount || 0) - (p.teacherShare || 0)),
        0
      );
      setTotalRevenue(total);
      setNetRevenue(net);
    } catch {
      alert("查詢失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async () => {
    if (!confirm("確定要執行上月結算？")) return;
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/payouts/settle`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(`已結算 ${res.data.month}`);
    fetchPayouts();
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `${API_URL}/payouts/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPayouts();
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-700 text-center">
          💼 老師分帳系統
        </h1>
        <div className="flex justify-between mb-4">
          <input
            type="month"
            className="border rounded p-2"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={fetchPayouts}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              查詢
            </button>
            <button
              onClick={handleSettle}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              結算上月
            </button>
          </div>
        </div>
  
        <div className="flex flex-col md:flex-row justify-end gap-8 mb-4 text-gray-700 font-semibold">
          <span>當月總收入：${totalRevenue.toLocaleString()}</span>
          <span>當月淨收入：${netRevenue.toLocaleString()}</span>
        </div>
  
        {loading ? (
          <p className="text-center">載入中...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">老師姓名</th>
                <th className="py-2 px-4">月份</th>
                <th className="py-2 px-4 text-right">堂數</th>
                <th className="py-2 px-4 text-right">總金額</th>
                <th className="py-2 px-4 text-right">老師分帳</th>
                <th className="py-2 px-4 text-center">狀態</th>
                <th className="py-2 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length > 0 ? (
                payouts.map((p: any) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{p.teacher?.name}</td>
                    <td className="py-2 px-4">{p.month}</td>
                    <td className="py-2 px-4 text-right">{p.totalSessions}</td>
                    <td className="py-2 px-4 text-right">${p.totalAmount}</td>
                    <td className="py-2 px-4 text-right text-green-600 font-semibold">
                      ${p.teacherShare}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        className={`px-2 py-1 rounded text-white ${
                          p.status === "paid" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                         {getPaymentStatusText(p.status as 'paid' | 'pending')} 
                      </button>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => {
                          const targetStatus =
                            p.status === "paid" ? "待發放" : "已發薪";
                          if (
                            window.confirm(
                              `確定要將此項目狀態切換為【${targetStatus}】嗎？`
                            )
                          ) {
                            updateStatus(
                              p._id,
                              p.status === "paid" ? "pending" : "paid"
                            );
                          }
                        }}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        切換狀態
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    尚無資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPayouts;
