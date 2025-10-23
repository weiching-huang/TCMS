import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import {
  Heart,
  Star,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Target,
  Lightbulb,
  Handshake,
  Sparkles,
  Building,
  Camera,
  BookOpen,
  Trophy,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const [_, setActiveValue] = useState(0);

  const coreValues = [
    {
      icon: Heart,
      title: "熱情 Passion",
      description:
        "對藝術的熱愛是我們教學的原動力，我們相信熱情能夠感染每一位學生，讓他們在學習中找到真正的快樂與成就感。",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Star,
      title: "專業 Professionalism",
      description:
        "我們堅持提供最高品質的教學服務，每位師資都具備專業認證與豐富經驗，確保學生獲得最優質的學習體驗。",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Lightbulb,
      title: "創新 Innovation",
      description:
        "不斷探索新的教學方法與課程內容，結合傳統技法與現代科技，為學生創造更豐富多元的學習環境。",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Sparkles,
      title: "啟發 Inspiration",
      description:
        "我們致力於激發每位學生的潛能與創造力，幫助他們發現自己的藝術天賦，建立自信心與表達能力。",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Handshake,
      title: "社群 Community",
      description:
        "建立溫馨、支持的學習社群，讓師生之間、學生之間都能互相學習、共同成長，創造美好的學習回憶。",
      color: "from-green-500 to-teal-500",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "才藝教室成立",
      description:
        "懷著對藝術教育的熱忱，我們在台北市中心成立了第一間才藝教室，開始我們的教育使命。",
      icon: Building,
    },
    {
      year: "2019",
      title: "師資團隊擴充",
      description:
        "邀請更多專業師資加入，課程涵蓋音樂、舞蹈、美術等多個領域，為學生提供更全面的藝術教育。",
      icon: Users,
    },
    {
      year: "2020",
      title: "數位教學創新",
      description:
        "因應時代變遷，導入線上教學系統，讓學習不受時空限制，持續為學生提供優質的教學服務。",
      icon: Globe,
    },
    {
      year: "2021",
      title: "獲得教育獎項",
      description:
        "榮獲台北市優秀藝術教育機構獎，肯定我們在藝術教育領域的專業表現與貢獻。",
      icon: Award,
    },
    {
      year: "2022",
      title: "學生成果豐碩",
      description:
        "學生在各項比賽中屢獲佳績，多位學生考取知名藝術學院，展現我們教學成果的卓越品質。",
      icon: Trophy,
    },
    {
      year: "2023",
      title: "持續成長茁壯",
      description:
        "學生人數突破500人，成為地區知名的藝術教育品牌，持續為更多學生提供優質的藝術教育。",
      icon: Sparkles,
    },
  ];

  const features = [
    {
      icon: Users,
      title: "小班制教學",
      description:
        "每班學生人數控制在8人以內，確保每位學生都能獲得充分的個別指導與關注。",
    },
    {
      icon: Star,
      title: "專業師資認證",
      description:
        "所有師資均具備相關科系學歷與專業認證，教學經驗豐富，深受學生與家長信賴。",
    },
    {
      icon: Building,
      title: "優質學習環境",
      description:
        "配備專業級設備與舒適的學習空間，包括隔音琴房、專業舞蹈教室與明亮畫室。",
    },
    {
      icon: Calendar,
      title: "彈性課程安排",
      description:
        "提供多元時段選擇與個別化課程規劃，滿足不同學生的學習需求與時間安排。",
    },
    {
      icon: Camera,
      title: "定期成果展演",
      description:
        "每學期舉辦學生發表會與作品展覽，提供學生展現學習成果的舞台與機會。",
    },
    {
      icon: BookOpen,
      title: "完整學習歷程",
      description:
        "建立學生學習檔案，記錄成長軌跡，提供家長了解學習進度的完整資訊。",
    },
  ];

  const stats = [
    { number: "500+", label: "在校學生", icon: Users },
    { number: "15+", label: "專業師資", icon: Star },
    { number: "6", label: "年辦學經驗", icon: Clock },
    { number: "20+", label: "課程項目", icon: BookOpen },
  ];

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
    <div className="mt-5 min-h-screen bg-gradient-to-br from-emerald-100 via-white to-blue-100">
      {/* Hero Section */}
      <motion.section
        className="relative py-32 px-4 text-center bg-gradient-to-r from-emerald-700 to-blue-300 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">關於我們</h1>
          <p className="text-xl mb-8 opacity-90">
            用心耕耘藝術教育，陪伴每位學生在創意的道路上發光發熱
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>用心教學</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>專業品質</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>創新教育</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              我們的故事
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                才藝教室成立於2018年，源於創辦人對藝術教育的深度熱愛與使命感。我們相信每個人都擁有獨特的藝術天賦，只需要適當的引導與培養，就能綻放出屬於自己的光芒。
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                從最初的小型工作室，到如今擁有專業設備與優秀師資團隊的綜合性藝術教育機構，我們始終堅持「以學生為中心」的教學理念，致力於提供最優質的藝術教育服務。我們不僅教授技巧，更重要的是培養學生對藝術的熱愛與終身學習的能力。
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                六年來，我們見證了無數學生在藝術道路上的成長與蛻變，從初學者到舞台上自信的表演者，從害羞的孩子到充滿創意的藝術家。這些美好的轉變，正是我們持續前進的最大動力。
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">核心價值</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我們的核心價值指引著我們的教學方向，也是我們與學生、家長建立信任關係的基石
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveValue(index)}
                >
                  <Card className="h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        <div
                          className={`p-4 bg-gradient-to-br ${value.color} rounded-full group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                        {value.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed text-center">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              我們的特色
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              專業的教學環境與貼心的服務，讓每位學生都能在最適合的環境中學習成長
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">發展歷程</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              從創立至今的重要里程碑，見證我們在藝術教育路上的成長與蛻變
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>

            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-12 ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      isEven ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div
                          className={`flex items-center space-x-3 ${
                            isEven ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 text-lg px-3 py-1"
                          >
                            {milestone.year}
                          </Badge>
                          <CardTitle className="text-xl font-bold text-gray-800">
                            {milestone.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <div className="w-1/2"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">聯絡我們</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              歡迎隨時與我們聯繫，我們將竭誠為您提供最專業的諮詢服務
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                    聯絡資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">地址</h4>
                      <p className="text-gray-600">
                        台北市中正區藝術街123號2樓
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">電話</h4>
                      <p className="text-gray-600">(02) 2345-6789</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">電子郵件</h4>
                      <p className="text-gray-600">info@talentacademy.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                    營業時間
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-800">
                      週二至週五
                    </span>
                    <span className="text-gray-600">13:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-800">
                      週六至週日
                    </span>
                    <span className="text-gray-600">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-800">週一</span>
                    <span className="text-red-500">公休</span>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      交通資訊
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>捷運：</strong>中正紀念堂站2號出口，步行5分鐘
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>公車：</strong>15、18、20、37路，藝術街口站下車
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>停車：</strong>附近有多個付費停車場
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
          <h2 className="text-4xl font-bold mb-6">加入我們的藝術大家庭</h2>
          <p className="text-xl mb-8 opacity-90">
            讓我們一起在藝術的世界中探索、學習、成長，創造屬於您的精彩故事
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
