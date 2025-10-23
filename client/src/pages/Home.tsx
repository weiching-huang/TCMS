import { BookOpen, Users } from "lucide-react";
import talentClass1 from "/assets/talentClass1.jpg";
import talentClass2 from "/assets/talentClass2.jpg";
import talentClass3 from "/assets/talentClass3.jpg";
import heroImage from "/assets/hero.jpg";
const courses = [
  {
    id: 1,
    title: "鋼琴入門",
    description: "適合初學者的鋼琴課程",
    image: talentClass1, // <-- 使用匯入的變數
  },
  {
    id: 2,
    title: "吉他進階",
    description: "提升技巧與樂曲演奏",
    image: talentClass2, // <-- 使用匯入的變數
  },
  {
    id: 3,
    title: "舞蹈基礎",
    description: "從基本動作開始學習舞蹈",
    image: talentClass3, // <-- 使用匯入的變數
  },
];

const Home = () => {
  return (
    <div className="flex flex-col pt-5">
      {/* Hero Section */}
      <section
        className="relative w-full min-h-dvh bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            才藝教室
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            鋼琴｜繪畫｜舞蹈｜才藝
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-slate-300 text-black px-6 py-3 rounded-md  hover:bg-slate-100 transition">
              預約試聽
            </button>
            <button className="bg-transparent border border-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition">
              了解更多
            </button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">特色課程</h2>
          <div className="grid md:grid-cols-3 gap-8 ">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 bg-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p>{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">為什麼選擇我們</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1  bg-gray-100 p-6 rounded shadow hover:shadow-lg transition">
              <BookOpen className="mx-auto mb-4 text-blue-500" size={48} />
              <h3 className="text-xl font-semibold mb-2">專業課程</h3>
              <p>從基礎到進階，課程設計完整。</p>
            </div>
            <div className="flex-1  bg-gray-100 p-6 rounded shadow hover:shadow-lg transition">
              <Users className="mx-auto mb-4 text-blue-500" size={48} />
              <h3 className="text-xl font-semibold mb-2">優秀師資</h3>
              <p>老師經驗豐富，耐心教學。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 才藝教室. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
