import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashHome from "./DashHome";
import Courses from "./Courses";
import AddCourse from "./AddCourse";
import EditCourse from "./EditCourse";
import AnnouncementDetail from "./AnnouncementDetail";
import AddAnnounce from "./AddAnnounce";
import Profile from "./Profile";
import Announcements from "./Announcements";
import MemberManagement from "./MemberManagement";
import AdminPayouts from "./AdminPayouts";
import PayoutsMe from "./PayoutsMe";
import TeacherCourses from "./TeacherCourses";
import TeacherAttendance from "./TeacherAttendance";
import NewCourses from "./NewCourses";
import StudentCourses from "./StudentCourses";
import TeacherAddAnnounce from "../pages/TeacherAddAnnounce";
import Finance from "./Finance";
import AdminPayments from "./AdminPayments";
import CourseDetail from "./CourseDetail";
import StudentAnnounce from "./StudentAnnounce";
import StudentAttendance from "./StudentAttendance";

const Dashboard = () => {
  return (
    <div className="flex xl:h-screen justify-center  pt-2 h-max">
      <div className="bg-stone-300 xl:h-[95dvh] xl:w-[95dvw] h-max w-[100%]  rounded-3xl flex justify-between items-start">
        {/* 左側側邊欄 */}
        <Sidebar/>

        {/* 右側主要內容區塊 */}
        <div className="w-[100%] xl:h-[96%] xl:w-[95%] mr-3 my-3">
          <Routes>
            <Route path="/" element={<DashHome />} />
            <Route path="/studentcourse" element={<StudentCourses />} />
            <Route path="/studentannounce" element={<StudentAnnounce />} />
            <Route path="/studentattendance" element={<StudentAttendance />} />
            <Route path="/new-courses" element={<NewCourses />} />
            <Route path="/teacher-courses" element={<TeacherCourses />} />
            <Route
              path="/attendance/:courseId"
              element={<TeacherAttendance />}
            />
            <Route
              path="/teacheraddannounce/:courseId"
              element={<TeacherAddAnnounce />}
            />
            <Route path="/payoutsme" element={<PayoutsMe />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/adminpayouts" element={<AdminPayouts />} />
            <Route path="/adminpayments" element={<AdminPayments />} />
            <Route path="/memberManagement" element={<MemberManagement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/editcourse/:id" element={<EditCourse />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/:id" element={<AnnouncementDetail />} />
            <Route path="/announcements/add" element={<AddAnnounce />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
