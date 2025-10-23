import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { login } from "../store/slices/authSlice";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 呼叫 dispatch，並使用 .unwrap() 取得非同步操作的結果
      await dispatch(login({ email, password })).unwrap();
      toast.success("登入成功！歡迎回來！");
      navigate("/dashboard");
    } catch (error) {
      // 這裡的 error 就是 login.rejected 回傳的 payload
      const errorMessage = error as string;
      toast.error(errorMessage);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-stone-200 shadow-lg rounded-xl p-8 w-96 h-96">
        <h2 className="text-2xl font-bold mb-6 text-center">登入</h2>
        <form onSubmit={handleLogin} className="flex h-60 flex-col justify-between">
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="w-full p-2 bg-stone-100 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full mt-2 p-2 bg-stone-100 border rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-stone-500 text-white py-2 rounded hover:bg-stone-700"
            disabled={loading}
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default Login;
