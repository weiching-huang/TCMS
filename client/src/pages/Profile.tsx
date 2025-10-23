import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMe } from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (loading) return <p>載入中...</p>;
  if (!user) return <p>無法取得使用者資料</p>;

  return (
<div className="flex flex-col justify-center xl:h-[100%] xl:min-h-full min-h-screen">
      <div className="max-w-lg mx-auto bg-stone-100 rounded-xl shadow-lg p-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">個人資料</h1>
          <p>
            <strong>name：</strong> {user.name}
          </p>
          <p>
            <strong>Email：</strong> {user.email}
          </p>
          <p>
            <strong>role：</strong> {user.role}
          </p>
        </div>
        <div className="w-35 h-35 rounded-full overflow-hidden">
          <img
            src={"/assets/avatar.png"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
</div>
  );
};

export default Profile;
