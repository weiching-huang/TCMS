import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Music, 
  Users, 
  Palette, 
  Award, 
  GraduationCap, 
  Clock, 
  Star, 
  Heart,
  BookOpen,
  Trophy,
  Mail,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TeacherProfile {
  id: number;
  name: string;
  title: string;
  specialties: string[];
  education: string;
  experience: string;
  philosophy: string;
  achievements: string[];
  courses: string[];
  avatar: string;
  category: string;
  rating: number;
  studentCount: number;
  yearsExperience: number;
}


const AboutTeacher = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

  const teachers = [
    {
      id: 1,
      name: '王雅琴',
      title: '鋼琴專任教師',
      specialties: ['鋼琴演奏', '樂理教學', '兒童音樂啟蒙', '檢定輔導'],
      education: '國立台灣師範大學音樂系碩士',
      experience: '12年專業教學經驗',
      philosophy: '音樂是心靈的語言，我相信每個學生都有獨特的音樂天賦。透過耐心的引導和個別化的教學方式，我致力於幫助學生發現音樂的美好，培養他們對音樂的熱愛與自主學習的能力。在我的課堂上，技巧訓練與音樂性並重，讓學生不僅能夠熟練演奏，更能深刻理解音樂的內涵。',
      achievements: [
        '榮獲全國鋼琴教師優秀指導獎',
        '指導學生考取國立音樂學院',
        '學生於全國音樂比賽獲得金獎',
        '舉辦個人師生音樂會超過20場'
      ],
      courses: ['鋼琴初級班', '鋼琴中級班', '鋼琴高級班', '鋼琴檢定班', '成人鋼琴班'],
      avatar: '/api/placeholder/150/150',
      category: 'music',
      rating: 4.9,
      studentCount: 85,
      yearsExperience: 12
    },
    {
      id: 2,
      name: '陳美華',
      title: '舞蹈專任教師',
      specialties: ['芭蕾舞', '現代舞', '肢體開發', '舞蹈編排'],
      education: '國立藝術大學舞蹈系學士，英國皇家舞蹈學院進修',
      experience: '10年專業教學經驗',
      philosophy: '舞蹈是身體的詩歌，是情感的表達。我相信透過舞蹈，學生不僅能夠鍛鍊身體，更能培養優雅的氣質和自信的態度。在教學中，我注重基本功的扎實訓練，同時鼓勵學生發揮創意，用身體說出屬於自己的故事。每一個動作都承載著美的追求，每一次練習都是對完美的嚮往。',
      achievements: [
        '曾獲全國舞蹈比賽編舞創作獎',
        '學生於國際青少年舞蹈大賽獲獎',
        '參與多部舞劇演出擔任主要角色',
        '創作舞蹈作品於藝術節展演'
      ],
      courses: ['芭蕾舞幼兒班', '芭蕾舞兒童班', '芭蕾舞青少年班', '現代舞基礎班', '兒童律動班'],
      avatar: '/api/placeholder/150/150',
      category: 'dance',
      rating: 4.8,
      studentCount: 72,
      yearsExperience: 10
    },
    {
      id: 3,
      name: '林志明',
      title: '美術專任教師',
      specialties: ['素描', '水彩', '油畫', '美術史', '藝術鑑賞'],
      education: '國立台灣藝術大學美術系碩士',
      experience: '15年專業教學經驗',
      philosophy: '藝術來源於生活，高於生活。我致力於引導學生用藝術家的眼光觀察世界，用畫筆記錄生活中的美好。在我的課堂上，技法學習與創意發想並重，我相信每個學生都有獨特的藝術視角，我的任務就是幫助他們找到屬於自己的表達方式，培養終身受用的美感素養。',
      achievements: [
        '作品多次入選全國美術展覽',
        '舉辦個人畫展獲得藝術界好評',
        '指導學生考取知名美術學院',
        '獲得優秀美術教師殊榮'
      ],
      courses: ['素描基礎班', '素描進階班', '水彩入門班', '水彩進階班', '油畫基礎班'],
      avatar: '/api/placeholder/150/150',
      category: 'art',
      rating: 4.9,
      studentCount: 68,
      yearsExperience: 15
    },
    {
      id: 4,
      name: '張文傑',
      title: '流行音樂教師',
      specialties: ['吉他演奏', '流行聲樂', '詞曲創作', '音樂製作'],
      education: '伯克利音樂學院流行音樂系畢業',
      experience: '8年專業教學經驗',
      philosophy: '音樂沒有界限，創意無窮無盡。我鼓勵學生勇於嘗試不同的音樂風格，在學習中找到屬於自己的聲音。無論是彈唱一首喜愛的歌曲，還是創作原創作品，我都會用最專業的指導和最大的熱忱，幫助學生實現他們的音樂夢想。音樂應該是快樂的，學習音樂更應該是一段美好的旅程。',
      achievements: [
        '發行個人創作專輯獲得好評',
        '擔任知名歌手演唱會吉他手',
        '學生於歌唱比賽獲得冠軍',
        '創作歌曲於音樂平台獲得百萬點擊'
      ],
      courses: ['吉他初級班', '吉他中級班', '流行聲樂班', '詞曲創作班'],
      avatar: '/api/placeholder/150/150',
      category: 'music',
      rating: 4.7,
      studentCount: 56,
      yearsExperience: 8
    },
    {
      id: 5,
      name: '黃志強',
      title: '街舞專任教師',
      specialties: ['Hip-Hop', 'Locking', 'Popping', '編舞創作'],
      education: '國內知名舞蹈工作室專業舞者培訓認證',
      experience: '7年專業教學經驗',
      philosophy: '街舞不只是舞蹈，更是一種生活態度和文化表達。我希望透過街舞教學，讓學生感受到音樂的律動和身體的力量，培養他們的自信心和表現力。在我的課堂上，每個學生都能找到屬於自己的舞蹈風格，學會用身體語言表達內心的想法，享受舞蹈帶來的快樂和成就感。',
      achievements: [
        '全國街舞大賽冠軍得主',
        '擔任多場大型演唱會舞者',
        '指導學生參與國際街舞交流',
        '創立街舞團隊獲得多項獎項'
      ],
      courses: ['街舞兒童班', '街舞青少年班', '街舞成人班', 'Hip-Hop進階班'],
      avatar: '/api/placeholder/150/150',
      category: 'dance',
      rating: 4.8,
      studentCount: 64,
      yearsExperience: 7
    },
    {
      id: 6,
      name: '李小雯',
      title: '兒童美術教師',
      specialties: ['兒童美術', '漫畫創作', '插畫設計', '創意手作'],
      education: '國立台北教育大學藝術與造形設計學系學士',
      experience: '9年專業教學經驗',
      philosophy: '每個孩子都是天生的藝術家，他們擁有無限的想像力和創造力。我的使命是保護和培養這份珍貴的天賦，透過多元的藝術活動和創作體驗，讓孩子們在快樂中學習，在創作中成長。我相信藝術教育不僅能培養美感，更能啟發思考，讓孩子們擁有更豐富的內心世界。',
      achievements: [
        '榮獲兒童繪本創作獎',
        '指導學生作品於國際兒童畫展展出',
        '出版兒童美術教學書籍',
        '創作插畫作品廣受好評'
      ],
      courses: ['兒童美術班', '漫畫創作入門', '創意手作班', '插畫設計班'],
      avatar: '/api/placeholder/150/150',
      category: 'art',
      rating: 4.9,
      studentCount: 78,
      yearsExperience: 9
    }
  ];

  const categories = {
    all: { name: '全部師資', icon: Users },
    music: { name: '音樂師資', icon: Music },
    dance: { name: '舞蹈師資', icon: Users },
    art: { name: '美術師資', icon: Palette }
  };

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTeachers = selectedCategory === 'all' 
    ? teachers 
    : teachers.filter(teacher => teacher.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="mt-5 min-h-screen bg-gradient-to-br from-indigo-200 via-white to-cyan-200">
      {/* Hero Section */}
      <motion.section 
        className="relative py-32 px-4 text-center bg-gradient-to-r from-indigo-600 to-cyan-200 text-black"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">專業師資團隊</h1>
          <p className="text-xl mb-8 opacity-90">
            匯聚各領域頂尖教師，用專業與熱忱點亮每一位學生的藝術之路
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>專業學歷認證</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>豐富教學經驗</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>用心教學理念</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Teacher Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12 h-16">
              {Object.entries(categories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key} 
                    className="flex items-center space-x-2 text-lg font-medium h-full"
                  >
                    <IconComponent className="w-6 h-6" />
                    <span>{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredTeachers.map((teacher) => (
                  <motion.div key={teacher.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm group cursor-pointer">
                      <CardHeader className="text-center pb-4">
                        <div className="relative mx-auto mb-4">
                          <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-lg">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
                              {teacher.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
                            <Star className="w-4 h-4 text-yellow-800" />
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                          {teacher.name}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-indigo-600 mb-4">
                          {teacher.title}
                        </CardDescription>
                        
                        {/* Stats */}
                        <div className="flex justify-center space-x-6 text-sm text-gray-600 mb-4">
                          <div className="text-center">
                            <div className="font-bold text-lg text-gray-800">{teacher.rating}</div>
                            <div className="flex items-center justify-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              <span>評分</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg text-gray-800">{teacher.studentCount}</div>
                            <div>學生數</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg text-gray-800">{teacher.yearsExperience}</div>
                            <div>年經驗</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Specialties */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            專長領域
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {teacher.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-indigo-100 text-indigo-800">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            學歷背景
                          </h4>
                          <p className="text-sm text-gray-600">{teacher.education}</p>
                        </div>

                        {/* Experience */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            教學經驗
                          </h4>
                          <p className="text-sm text-gray-600">{teacher.experience}</p>
                        </div>

                        {/* Achievements */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Trophy className="w-4 h-4 mr-2" />
                            榮譽成就
                          </h4>
                          <div className="space-y-1">
                            {teacher.achievements.slice(0, 2).map((achievement, idx) => (
                              <div key={idx} className="flex items-start text-sm text-gray-600">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                <span>{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Teaching Philosophy Preview */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">教學理念</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {teacher.philosophy.substring(0, 80)}...
                          </p>
                        </div>

                        {/* Courses */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">授課項目</h4>
                          <div className="flex flex-wrap gap-1">
                            {teacher.courses.slice(0, 3).map((course, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                            {teacher.courses.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{teacher.courses.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-4">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white"
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            詳細介紹
                          </Button>
                          <Button variant="outline" size="sm" className="px-3">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedTeacher(null)}
        >
          <motion.div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start space-x-6 mb-8">
                <Avatar className="w-24 h-24 border-4 border-indigo-200">
                  <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-indigo-500 to-cyan-500 text-white">
                    {selectedTeacher.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedTeacher.name}</h2>
                  <p className="text-xl text-indigo-600 mb-4">{selectedTeacher.title}</p>
                  <div className="flex space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{selectedTeacher.rating} 評分</span>
                    </div>
                    <div>{selectedTeacher.studentCount} 位學生</div>
                    <div>{selectedTeacher.yearsExperience} 年經驗</div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedTeacher(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">教學理念</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedTeacher.philosophy}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">專長領域</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-indigo-100 text-indigo-800">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">學歷背景</h3>
                    <p className="text-gray-600">{selectedTeacher.education}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">榮譽成就</h3>
                    <div className="space-y-2">
                      {selectedTeacher.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start">
                          <Trophy className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">授課項目</h3>
                    <div className="space-y-2">
                      {selectedTeacher.courses.map((course, idx) => (
                        <div key={idx} className="flex items-center">
                          <BookOpen className="w-4 h-4 text-indigo-500 mr-2" />
                          <span className="text-gray-600">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white">
                  預約試聽課程
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>聯絡老師</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">與專業師資一對一學習</h2>
          <p className="text-xl mb-8 opacity-90">
            我們的師資團隊將為您提供最專業的指導，讓您在藝術的道路上走得更遠更穩
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
        </div>
      </motion.section>
    </div>
  );
};


export default AboutTeacher