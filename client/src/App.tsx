import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Nav from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import AboutCourse from "./pages/AboutCourse";
import AboutTeacher from "./pages/AboutTeacher";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
     <div className="">
      <Nav/>
      <ToastContainer position="top-center" autoClose={1500} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About/>} />
        <Route path="/AboutCourse" element={<AboutCourse />} />
        <Route path="/AboutTeacher" element={<AboutTeacher />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <Tooltip id="my-tooltip" />
    </div>
  )
}

export default App
