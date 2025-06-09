"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  GraduationCap,
  Star,
  Search,
  Play,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Target,
  Lightbulb,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const knowledgeCards = [
  {
    id: 1,
    term: "复利效应",
    category: "基础概念",
    difficulty: "初级",
    definition: "投资收益再投资产生的收益，随时间呈指数级增长的现象",
    example: "每年10%收益率，10年后1万元变成2.59万元",
    keyPoints: ["时间越长效果越明显", "收益率越高效果越显著", "需要持续投资"],
    rating: 4.8,
    studyCount: 1240,
    isLearned: false,
  },
  {
    id: 2,
    term: "资产配置",
    category: "投资策略",
    difficulty: "中级",
    definition: "将投资资金分散到不同类型的资产中以降低风险的策略",
    example: "60%股票 + 30%债券 + 10%现金的经典配置",
    keyPoints: ["分散投资风险", "平衡收益与风险", "定期再平衡"],
    rating: 4.6,
    studyCount: 890,
    isLearned: true,
  },
  {
    id: 3,
    term: "市盈率(P/E)",
    category: "估值指标",
    difficulty: "中级",
    definition: "股票价格与每股收益的比率，用于评估股票估值水平",
    example: "股价20元，每股收益2元，市盈率为10倍",
    keyPoints: ["越低可能越便宜", "需要行业对比", "考虑增长率"],
    rating: 4.4,
    studyCount: 756,
    isLearned: false,
  },
  {
    id: 4,
    term: "定投策略",
    category: "投资方法",
    difficulty: "初级",
    definition: "定期定额投资，通过时间分散降低市场波动影响",
    example: "每月投资1000元基金，不论市场涨跌",
    keyPoints: ["平滑成本", "降低择时风险", "适合长期投资"],
    rating: 4.9,
    studyCount: 1560,
    isLearned: true,
  },
]

const learningPaths = [
  {
    id: 1,
    title: "理财入门基础",
    description: "从零开始学习理财基本概念和方法",
    level: "初级",
    duration: "2周",
    lessons: 12,
    progress: 75,
    topics: ["理财规划", "风险认知", "投资工具", "资产配置"],
    isEnrolled: true,
  },
  {
    id: 2,
    title: "股票投资进阶",
    description: "深入学习股票分析和投资策略",
    level: "中级",
    duration: "4周",
    lessons: 20,
    progress: 30,
    topics: ["基本面分析", "技术分析", "价值投资", "成长投资"],
    isEnrolled: true,
  },
  {
    id: 3,
    title: "基金投资实战",
    description: "掌握基金选择和组合投资技巧",
    level: "中级",
    duration: "3周",
    lessons: 16,
    progress: 0,
    topics: ["基金分类", "基金选择", "定投策略", "组合管理"],
    isEnrolled: false,
  },
  {
    id: 4,
    title: "高级投资策略",
    description: "学习专业投资者的高级策略和技巧",
    level: "高级",
    duration: "6周",
    lessons: 25,
    progress: 0,
    topics: ["量化投资", "对冲策略", "风险管理", "资产配置"],
    isEnrolled: false,
  },
]

const achievements = [
  { name: "理财新手", description: "完成第一个学习模块", icon: "🎯", unlocked: true },
  { name: "知识探索者", description: "学习10个理财概念", icon: "🔍", unlocked: true },
  { name: "投资达人", description: "完成投资策略课程", icon: "📈", unlocked: false },
  { name: "理财专家", description: "获得所有课程认证", icon: "🏆", unlocked: false },
]

export default function EducationPage() {
  const [selectedCard, setSelectedCard] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const categories = ["全部", "基础概念", "投资策略", "估值指标", "投资方法"]

  const filteredCards = knowledgeCards.filter((card) => {
    const matchesSearch =
      card.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || card.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleMarkAsLearned = (cardId: number) => {
    // 标记为已学习的逻辑
    console.log(`Marked card ${cardId} as learned`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">理财学院</h1>
          <p className="text-gray-600">系统化学习理财知识，提升投资理财能力</p>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学习进度</p>
                  <p className="text-2xl font-bold text-gray-900">68%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    本周+12%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已学概念</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    共50个
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学习时长</p>
                  <p className="text-2xl font-bold text-gray-900">36h</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    本月
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">获得成就</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Award className="w-3 h-3 mr-1" />
                    共4个
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="cards">知识卡片</TabsTrigger>
            <TabsTrigger value="paths">学习路径</TabsTrigger>
            <TabsTrigger value="achievements">成就系统</TabsTrigger>
            <TabsTrigger value="progress">学习统计</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="搜索理财概念..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cards List */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>理财术语卡片</CardTitle>
                  <CardDescription>点击卡片查看详细解释</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredCards.map((card, index) => (
                      <div
                        key={card.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCard === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedCard(index)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{card.term}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {card.difficulty}
                            </Badge>
                            {card.isLearned && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">{card.category}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{card.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Card Detail */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{filteredCards[selectedCard]?.term}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-700">{filteredCards[selectedCard]?.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{filteredCards[selectedCard]?.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">定义</h4>
                      <p className="text-blue-700 text-sm">{filteredCards[selectedCard]?.definition}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">示例</h4>
                      <p className="text-blue-700 text-sm">{filteredCards[selectedCard]?.example}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">要点</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        {filteredCards[selectedCard]?.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleMarkAsLearned(filteredCards[selectedCard]?.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {filteredCards[selectedCard]?.isLearned ? "已掌握" : "标记已学"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      需复习
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <CardDescription className="mt-1">{path.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          path.level === "初级" ? "default" : path.level === "中级" ? "secondary" : "destructive"
                        }
                      >
                        {path.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{path.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span>{path.lessons}课时</span>
                      </div>
                    </div>

                    {path.isEnrolled && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>学习进度</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">课程内容</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {path.isEnrolled ? (
                        <Button size="sm" className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          继续学习
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          开始学习
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>成就系统</CardTitle>
                <CardDescription>通过学习解锁各种成就徽章</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.unlocked ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${achievement.unlocked ? "text-yellow-800" : "text-gray-500"}`}>
                            {achievement.name}
                          </h3>
                          <p className={`text-sm ${achievement.unlocked ? "text-yellow-700" : "text-gray-400"}`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && <CheckCircle className="w-5 h-5 text-yellow-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>学习统计</CardTitle>
                  <CardDescription>您的学习数据概览</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">基础概念</span>
                      <span className="text-sm font-semibold">12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">投资策略</span>
                      <span className="text-sm font-semibold">8/12</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">估值指标</span>
                      <span className="text-sm font-semibold">4/10</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">投资方法</span>
                      <span className="text-sm font-semibold">6/8</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-900">学习建议</CardTitle>
                  <CardDescription className="text-green-700">基于您的学习进度的个性化建议</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">重点学习</h4>
                        <p className="text-sm text-gray-600">
                          建议重点学习"估值指标"相关概念，这将帮助您更好地分析投资标的。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">推荐课程</h4>
                        <p className="text-sm text-gray-600">"股票投资进阶"课程与您当前学习进度匹配，建议优先学习。</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">学习计划</h4>
                        <p className="text-sm text-gray-600">建议每天学习30分钟，预计2周内可完成当前课程。</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">相关功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/coach">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI教练</h3>
                    <p className="text-sm text-gray-600">获得个性化学习指导</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI助手</h3>
                    <p className="text-sm text-gray-600">解答理财疑问</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/analysis">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">实践应用</h3>
                    <p className="text-sm text-gray-600">将知识应用到分析中</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="text-xs text-gray-400 text-center mt-6">
          *本页内容由系统自动生成，仅供参考，请勿作为投资依据。
        </div>
      </div>
    </div>
  )
}
