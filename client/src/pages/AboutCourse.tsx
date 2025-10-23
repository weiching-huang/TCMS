import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Music,
  Palette,
  Users,
  Clock,
  Star,
  BookOpen,
  Award,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const AboutCourse = () => {
  const [selectedCategory, setSelectedCategory] = useState("music");

  const courseCategories = {
    music: {
      title: "音樂課程",
      icon: Music,
      description: "專業音樂教學，培養音樂素養與演奏技巧",
      courses: [
        {
          name: "鋼琴課程",
          description:
            "從基礎樂理到高階演奏技巧，培養完整的鋼琴演奏能力。我們的鋼琴課程採用循序漸進的教學方式，讓學生在愉快的學習氛圍中掌握鋼琴演奏的精髓。",
          levels: ["初級班", "中級班", "高級班", "檢定班", "成人班"],
          features: ["個別指導", "小組課程", "定期發表會", "檢定輔導"],
          duration: "每堂課 50 分鐘",
          price: "NT$ 1,200 起",
          teacher: "王老師",
          highlights: [
            "基礎樂理教學",
            "指法技巧訓練",
            "經典曲目練習",
            "音樂表現力培養",
          ],
        },
        {
          name: "小提琴課程",
          description:
            "優雅的弦樂器學習，從持弓姿勢到音樂表達，全方位培養小提琴演奏技能。課程注重基本功訓練與音樂性的培養，讓學生能夠演奏出動人的樂章。",
          levels: ["兒童班", "青少年班", "成人班"],
          features: ["正確姿勢指導", "音準訓練", "弓法練習", "合奏體驗"],
          duration: "每堂課 50 分鐘",
          price: "NT$ 1,300 起",
          teacher: "陳老師",
          highlights: [
            "持弓姿勢矯正",
            "音準感培養",
            "樂曲詮釋",
            "舞台表演訓練",
          ],
        },
        {
          name: "吉他課程",
          description:
            "流行音樂的最佳入門樂器，包含民謠吉他、古典吉他與電吉他教學。課程結合理論與實踐，讓學生能夠彈唱自己喜愛的歌曲，享受音樂帶來的樂趣。",
          levels: ["初級班", "中級班", "進階班"],
          features: ["和弦練習", "指彈技巧", "彈唱教學", "創作指導"],
          duration: "每堂課 50 分鐘",
          price: "NT$ 1,000 起",
          teacher: "張老師",
          highlights: [
            "基礎和弦教學",
            "節奏感訓練",
            "流行歌曲彈唱",
            "即興演奏",
          ],
        },
        {
          name: "聲樂課程",
          description:
            "專業的歌唱技巧訓練，包含發聲方法、呼吸技巧、音域拓展與歌曲詮釋。無論是古典聲樂或流行歌唱，都能在這裡找到適合的學習方向。",
          levels: ["基礎班", "進階班", "專業班"],
          features: ["發聲訓練", "呼吸技巧", "歌曲詮釋", "舞台表演"],
          duration: "每堂課 50 分鐘",
          price: "NT$ 1,100 起",
          teacher: "張老師",
          highlights: [
            "正確發聲方法",
            "呼吸控制技巧",
            "音域擴展訓練",
            "情感表達指導",
          ],
        },
      ],
    },
    dance: {
      title: "舞蹈課程",
      icon: Users,
      description: "多元舞蹈教學，培養身體協調與藝術表達能力",
      courses: [
        {
          name: "芭蕾舞課程",
          description:
            "優雅的古典舞蹈藝術，注重身體線條、平衡感與藝術修養的培養。從基本功訓練開始，逐步學習芭蕾舞的精髓，培養學生的氣質與自信。",
          levels: [
            "幼兒班 (3-5歲)",
            "兒童班 (6-10歲)",
            "青少年班 (11-16歲)",
            "成人班",
          ],
          features: ["基本功訓練", "把桿練習", "中間練習", "劇目學習"],
          duration: "每堂課 60 分鐘",
          price: "NT$ 800 起",
          teacher: "陳老師",
          highlights: [
            "正確姿態訓練",
            "柔軟度提升",
            "音樂感培養",
            "舞台表現力",
          ],
        },
        {
          name: "街舞課程",
          description:
            "充滿活力的現代舞蹈，包含Hip-Hop、Locking、Popping等多種風格。課程強調節奏感、爆發力與個人風格的展現，讓學生在音樂中釋放自我。",
          levels: ["兒童班", "青少年班", "成人班"],
          features: ["基礎律動", "風格教學", "編舞創作", "Battle訓練"],
          duration: "每堂課 60 分鐘",
          price: "NT$ 700 起",
          teacher: "黃老師",
          highlights: ["節奏感訓練", "身體控制", "個人風格發展", "團隊合作"],
        },
        {
          name: "現代舞課程",
          description:
            "自由表達的舞蹈形式，強調身體的自然流動與情感的表達。課程結合技巧訓練與創意發想，讓學生能夠透過舞蹈表達內心的想法與感受。",
          levels: ["基礎班", "進階班", "創作班"],
          features: ["身體開發", "即興創作", "情感表達", "作品呈現"],
          duration: "每堂課 75 分鐘",
          price: "NT$ 900 起",
          teacher: "陳老師",
          highlights: [
            "身體意識開發",
            "創意思維培養",
            "情感表達訓練",
            "舞蹈創作",
          ],
        },
        {
          name: "兒童律動課程",
          description:
            "專為幼兒設計的音樂律動課程，透過遊戲與音樂培養孩子的節奏感、協調性與創造力。課程內容豐富有趣，讓孩子在快樂中學習舞蹈的基礎。",
          levels: [
            "幼幼班 (2-3歲)",
            "小班 (3-4歲)",
            "中班 (4-5歲)",
            "大班 (5-6歲)",
          ],
          features: ["音樂遊戲", "基礎律動", "想像創作", "親子互動"],
          duration: "每堂課 45 分鐘",
          price: "NT$ 600 起",
          teacher: "陳老師",
          highlights: [
            "音樂感培養",
            "身體協調訓練",
            "創意想像",
            "社交能力發展",
          ],
        },
      ],
    },
    art: {
      title: "繪畫課程",
      icon: Palette,
      description: "創意美術教學，啟發藝術潛能與美感素養",
      courses: [
        {
          name: "素描課程",
          description:
            "繪畫的基礎技法，從線條練習到光影表現，系統性地學習素描技巧。課程注重觀察力的培養與手眼協調的訓練，為其他繪畫技法奠定堅實基礎。",
          levels: ["基礎班", "進階班", "專業班"],
          features: ["線條練習", "明暗表現", "透視技法", "質感表現"],
          duration: "每堂課 90 分鐘",
          price: "NT$ 800 起",
          teacher: "林老師",
          highlights: ["觀察力訓練", "線條控制", "立體感表現", "構圖技巧"],
        },
        {
          name: "水彩課程",
          description:
            "色彩豐富的水性顏料繪畫，學習水彩的特殊技法與色彩運用。課程從基礎的調色技巧開始，逐步學習各種水彩表現技法，創作出美麗的水彩作品。",
          levels: ["入門班", "進階班", "創作班"],
          features: ["調色技巧", "渲染技法", "乾濕技法", "風景寫生"],
          duration: "每堂課 90 分鐘",
          price: "NT$ 850 起",
          teacher: "林老師",
          highlights: ["色彩理論學習", "水分控制技巧", "層次表現", "意境營造"],
        },
        {
          name: "油畫課程",
          description:
            "經典的西洋繪畫技法，學習油畫的厚重質感與豐富層次。課程包含色彩理論、筆觸技巧與畫面構成，讓學生能夠創作出具有深度與質感的油畫作品。",
          levels: ["基礎班", "進階班", "大師班"],
          features: ["色彩調配", "筆觸技巧", "厚塗技法", "古典技法"],
          duration: "每堂課 120 分鐘",
          price: "NT$ 1,200 起",
          teacher: "林老師",
          highlights: ["古典技法學習", "色彩層次表現", "質感塑造", "畫面構成"],
        },
        {
          name: "兒童美術課程",
          description:
            "專為兒童設計的創意美術課程，透過多元媒材與有趣的主題，啟發孩子的創造力與想像力。課程注重過程而非結果，讓孩子在創作中找到樂趣與自信。",
          levels: ["幼兒班 (3-5歲)", "兒童班 (6-8歲)", "少年班 (9-12歲)"],
          features: ["多元媒材", "創意發想", "色彩探索", "立體創作"],
          duration: "每堂課 60 分鐘",
          price: "NT$ 600 起",
          teacher: "李老師",
          highlights: [
            "創意思維培養",
            "色彩感知訓練",
            "手部精細動作",
            "美感啟發",
          ],
        },
        {
          name: "漫畫創作課程",
          description:
            "結合繪畫技巧與故事創作的課程，學習漫畫的基本技法與敘事技巧。從角色設計到分鏡構圖，培養學生的視覺敘事能力與創作技巧。",
          levels: ["入門班", "進階班", "創作班"],
          features: ["角色設計", "分鏡技巧", "網點技法", "數位繪圖"],
          duration: "每堂課 90 分鐘",
          price: "NT$ 900 起",
          teacher: "李老師",
          highlights: [
            "角色造型設計",
            "故事構思能力",
            "分鏡表現技巧",
            "數位工具運用",
          ],
        },
      ],
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="mt-5 min-h-screen bg-gradient-to-b from-gray-400 via-white to-slate-500">
      {/* Hero Section */}
      <motion.section
        className=" relative py-32 px-4 text-center bg-gradient-to-tr from-pink-100 via-orange-200 to-yellow-100 text-black"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl  mx-auto">
          <h1 className="text-5xl font-bold mb-6">多元才藝課程</h1>
          <p className="text-xl mb-8 opacity-90">
            專業師資團隊，量身打造的學習計畫，讓每個學生都能在藝術的世界中找到屬於自己的舞台
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>專業認證師資</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>小班制教學</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>個別化指導</span>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Course Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-12 h-16">
              {Object.entries(courseCategories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center space-x-2 text-lg font-medium h-full"
                  >
                    <IconComponent className="w-6 h-6" />
                    <span>{category.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(courseCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  {/* Category Header */}
                  <motion.div
                    variants={itemVariants}
                    className="text-center mb-12"
                  >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                      {category.title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      {category.description}
                    </p>
                  </motion.div>

                  {/* Courses Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {category.courses.map((course, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                              <CardTitle className="text-2xl font-bold text-gray-800">
                                {course.name}
                              </CardTitle>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                {course.teacher}
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-600 leading-relaxed">
                              {course.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            {/* Course Highlights */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2" />
                                課程重點
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {course.highlights.map((highlight, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center text-sm text-gray-600"
                                  >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    {highlight}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Course Levels */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">
                                課程級別
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {course.levels.map((level, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {level}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Course Features */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">
                                課程特色
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {course.features.map((feature, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center text-sm text-gray-600"
                                  >
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Course Info */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                {course.duration}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold text-green-600">
                                  {course.price}
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                              了解更多課程資訊
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">開始您的藝術學習之旅</h2>
          <p className="text-xl mb-8 opacity-90">
            立即預約免費體驗課程，讓我們的專業師資為您量身打造最適合的學習計畫
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center"></div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutCourse;
