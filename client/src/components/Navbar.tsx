// src/components/Navbar.tsx
import React from "react";
import { Link} from "react-router-dom";

const Navbar: React.FC = () => {




  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 pt-5 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img
            src="/assets/icons8-musical-note-96.png"
            className="LOGO"
            alt=""
          />
          <span> 才藝教室</span>
        </Link>
        <div className="space-x-4">
          <Link to="/" className="group relative inline-block px-4">
            <span className="block">首頁</span>
            <img
              src="/assets/icons8-music-96.png"
              alt="懸停圖片"
              className="absolute top-1/2 -left-6 -translate-y-1/2 w-10 h-10 
           opacity-0 invisible transition-opacity duration-300
           group-hover:opacity-100 group-hover:visible"
            />
          </Link>
          <Link to="/AboutCourse" className="group relative inline-block px-4">
           <span className="block">課程</span>
            <img
              src="/assets/icons8-music-96.png"
              alt="懸停圖片"
              className="absolute top-1/2 -left-6 -translate-y-1/2 w-10 h-10 
           opacity-0 invisible transition-opacity duration-300
           group-hover:opacity-100 group-hover:visible"
            />
          </Link>
          <Link to="/AboutTeacher" className="group relative inline-block px-4">
           <span className="block">師資</span>
            <img
              src="/assets/icons8-music-96.png"
              alt="懸停圖片"
              className="absolute top-1/2 -left-6 -translate-y-1/2 w-10 h-10 
           opacity-0 invisible transition-opacity duration-300
           group-hover:opacity-100 group-hover:visible"
            />
          </Link>
          <Link to="/About" className="group relative inline-block px-4">
           <span className="block">關於我們</span>
            <img
              src="/assets/icons8-music-96.png"
              alt="懸停圖片"
              className="absolute top-1/2 -left-6 -translate-y-1/2 w-10 h-10 
           opacity-0 invisible transition-opacity duration-300
           group-hover:opacity-100 group-hover:visible"
            />
          </Link>
          <Link to="/login" className="group relative inline-block px-4">
           <span className="block">學生老師入口</span>
            <img
              src="/assets/icons8-music-96.png"
              alt="懸停圖片"
              className="absolute top-1/2 -left-6 -translate-y-1/2 w-10 h-10 
           opacity-0 invisible transition-opacity duration-300
           group-hover:opacity-100 group-hover:visible"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
