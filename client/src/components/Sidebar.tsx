import {
  UserRound,
  LogOut,
  House,
  BookOpen,
  BookUser,
  BadgeDollarSign,
  Megaphone,
  ListTodo,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import axios from "axios";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 登出處理函式
  const handleLogout = () => {
    dispatch(logout());
    delete axios.defaults.headers.common["Authorization"];
    toast.success("登出成功！");
    navigate("/");
  };

  return (
    <div className="h-[96%] mx-5 flex flex-col items-center py-6 space-y-6 mt-20">
      <nav className="flex flex-col space-y-6 justify-start items-center bg-black w-15 rounded-full pt-5 pb-5 bg-stone-500">
        <Link
          to="/dashboard"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="回首頁"
          className=""
        >
          <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
            <House />
          </button>
        </Link>
        {user.role === "admin" && (
          <>
            <Link
              to="/dashboard/announcements/add"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="新增公告"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <Megaphone />
              </button>
            </Link>
            <Link
              to="/dashboard/memberManagement"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="成員管理"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BookUser />
              </button>
            </Link>
            <Link
              to="/dashboard/courses"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="課程管理"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BookOpen />
              </button>
            </Link>

            <Link
              to="/dashboard/finance"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="財務"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BadgeDollarSign />
              </button>
            </Link>
          </>
        )}
        {user.role === "teacher" && (
          <>
            <Link
              to="/dashboard/teacher-courses?from=myCourses"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="我的課程"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BookOpen />
              </button>
            </Link>
            <Link
              to="/dashboard/payoutsme"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="我的薪資"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BadgeDollarSign />
              </button>
            </Link>
            <Link
              to="/dashboard/teacher-courses?from=attendance"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="點名系統"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <ListTodo />
              </button>
            </Link>
          </>
        )}
        {user.role === "student" && (
          <>
            <Link
              to="/dashboard/studentcourse"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="我的課程"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BookOpen />
              </button>
            </Link>
            <Link
              to="/dashboard/studentannounce"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="我的課程公告"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <Megaphone />
              </button>
            </Link>
            <Link
              to="/dashboard/new-courses"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="新開課程"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <BadgeDollarSign />
              </button>
            </Link>
            <Link
              to="/dashboard/studentattendance"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="請假"
              className=""
            >
              <button className="p-3 rounded-full hover:bg-stone-300 w-10 h-10 flex justify-center items-center cursor-pointer">
                <ListTodo />
              </button>
            </Link>
          </>
        )}
      </nav>

      <nav className="flex flex-col space-y-6 justify-start items-center bg-black w-15 rounded-full pt-5 pb-5 bg-stone-200">
        <Link
          to="/dashboard/profile"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="請假"
          className=""
        >
          <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="個人資料"
            className="p-3 rounded-full hover:bg-stone-100 w-10 h-10 flex justify-center items-center bg-stone-300 cursor-pointer"
          >
            {" "}
            <UserRound />
          </button>
        </Link>
        <button
          data-tooltip-id="my-tooltip"
          data-tooltip-content="登出"
          onClick={handleLogout}
          className="p-3 rounded-full hover:bg-stone-100 w-10 h-10 bg-stone-300 flex justify-center items-center cursor-pointer"
        >
          <LogOut />
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
