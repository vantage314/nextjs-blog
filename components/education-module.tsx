"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Award,
  Target,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  TrendingUp,
  Users,
  Lightbulb,
  Brain,
} from "lucide-react"

const learningPaths = [
  {
    id: 1,
    title: "理财入门基础",
    description: "从零开始学习个人理财的基本概念和方法",
    level: "初级",
    duration: "2周",
    progress: 75,
    modules: 8,
    completed: 6,
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "投资策略进阶",
    description: "深入了解各种投资工具和策略配置",
    level: "中级",
    duration: "4周",
    progress: 30,
    modules: 12,
    completed: 4,
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "风险管理专题",
    description: "学习如何识别和管理投资风险",
    level: "中级",
    duration: "3周",
    progress: 0,
    modules: 10,
    completed: 0,
    color: "bg-purple-500",
  },
]

const knowledgeCards = [
  {
    term: "复利效应",
    definition: "投资收益再投资产生的收益，随时间呈指数级增长",
    example: "每年10%收益率，10年后1万元变成2.59万元",
    category: "基础概念",
    difficulty: "初级",
  },
  {
    term: "资产配置",
    definition: "将投资资金分散到不同类型的资产中以降低风险",
    example: "60%股票 + 30%债券 + 10%现金的经典配置",
    category: "投资策略",
    difficulty: "中级",
  },
  {
    term: "夏普比率",
    definition: "衡量投资组合风险调整后收益的指标",
    example: "比率越高说明单位风险获得的超额收益越多",
    category: "风险指标",
    difficulty: "高级",
  },
  {
    term: "定投策略",
    definition: "定期定额投资，通过时间分散降低市场波动影响",
    example: "每月投资1000元基金，不论市场涨跌",
    category: "投资方法",
    difficulty: "初级",
  },
]

const achievements = [
  { name: "理财新手", description: "完成第一个学习模块", earned: true, date: "2024-11-15" },
  { name: "知识探索者", description: "学习10个金融术语", earned: true, date: "2024-11-20" },
  { name: "投资达人", description: "完成投资策略课程", earned: false, progress: 60 },
  { name: "风险管理师", description: "掌握风险评估方法", earned: false, progress: 0 },
]

export function EducationModule() {
  const [selectedCard, setSelectedCard] = useState(0)

  return (
    <div className="space-y-6">
      {/* Learning Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">学习进度</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">68%</div>
            <div className="text-sm text-blue-700">已完成 10/15 个模块</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">获得成就</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <div className="text-sm text-green-700">理财知识达人</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">学习目标</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-sm text-purple-700">本月完成课程</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="paths" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="paths">学习路径</TabsTrigger>
          <TabsTrigger value="cards">知识卡片</TabsTrigger>
          <TabsTrigger value="achievements">成就系统</TabsTrigger>
          <TabsTrigger value="assessment">能力评估</TabsTrigger>
        </TabsList>

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
                    <Badge variant="outline" className="ml-2">
                      {path.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {path.modules} 模块
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>学习进度</span>
                      <span>
                        {path.completed}/{path.modules} 已完成
                      </span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant={path.progress > 0 ? "default" : "outline"}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {path.progress > 0 ? "继续学习" : "开始学习"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                金融术语卡片
              </CardTitle>
              <CardDescription>通过卡片形式学习重要的金融概念和术语</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {knowledgeCards.map((card, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCard === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedCard(index)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{card.term}</h3>
                        <Badge variant="outline" className="text-xs">
                          {card.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{card.category}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{knowledgeCards[selectedCard].term}</h3>
                    <Badge className="bg-blue-100 text-blue-700">{knowledgeCards[selectedCard].category}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">定义</h4>
                      <p className="text-blue-700 text-sm">{knowledgeCards[selectedCard].definition}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">示例</h4>
                      <p className="text-blue-700 text-sm">{knowledgeCards[selectedCard].example}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      已掌握
                    </Button>
                    <Button size="sm" variant="outline">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      需复习
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                成就系统
              </CardTitle>
              <CardDescription>通过学习获得成就，激励持续进步</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${achievement.earned ? "bg-green-100" : "bg-gray-100"}`}>
                          {achievement.earned ? (
                            <Award className="w-5 h-5 text-green-600" />
                          ) : (
                            <Target className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className={`font-medium ${achievement.earned ? "text-green-900" : "text-gray-700"}`}>
                            {achievement.name}
                          </h3>
                          <p className={`text-sm ${achievement.earned ? "text-green-700" : "text-gray-600"}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {achievement.earned && <Badge className="bg-green-100 text-green-700">已获得</Badge>}
                    </div>

                    {achievement.earned ? (
                      <div className="text-xs text-green-600">获得时间: {achievement.date}</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>进度</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                理财能力评估
              </CardTitle>
              <CardDescription>全面评估您的理财知识水平和投资能力</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">85</div>
                  <div className="text-sm text-blue-700">基础知识</div>
                  <Progress value={85} className="h-2 mt-2" />
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">72</div>
                  <div className="text-sm text-green-700">投资策略</div>
                  <Progress value={72} className="h-2 mt-2" />
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">68</div>
                  <div className="text-sm text-purple-700">风险管理</div>
                  <Progress value={68} className="h-2 mt-2" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">个性化学习建议</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>基础理财概念掌握良好，可以进入进阶学习</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>建议加强投资组合配置相关知识学习</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span>风险评估能力有待提升，推荐相关课程</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  开始新评估
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  查看排行榜
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
