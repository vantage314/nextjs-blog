"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Send,
  Target,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Sparkles,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Lightbulb,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const coachProfiles = [
  {
    id: 1,
    name: "理财小助手",
    specialty: "基础理财规划",
    avatar: "🤖",
    description: "专注于帮助新手建立正确的理财观念和基础知识",
    experience: "服务用户10万+",
    rating: 4.8,
    isActive: true,
  },
  {
    id: 2,
    name: "投资策略师",
    specialty: "投资组合优化",
    avatar: "📊",
    description: "擅长资产配置和投资策略制定，帮助优化投资组合",
    experience: "专业投资15年",
    rating: 4.9,
    isActive: false,
  },
  {
    id: 3,
    name: "风险管理专家",
    specialty: "风险控制",
    avatar: "🛡️",
    description: "专注于投资风险评估和控制策略制定",
    experience: "风险管理12年",
    rating: 4.7,
    isActive: false,
  },
]

const chatHistory = [
  {
    type: "coach",
    message: "您好！我是您的专属AI理财教练。我注意到您最近在学习投资基础知识，有什么具体问题需要我帮助解答吗？",
    time: "14:28",
    avatar: "🤖",
  },
  {
    type: "user",
    message: "我想了解一下如何开始我的第一次投资",
    time: "14:30",
  },
  {
    type: "coach",
    message:
      "很好的问题！开始投资前，我建议您先做好以下准备：\n\n1. 建立应急基金（3-6个月生活费）\n2. 明确投资目标和时间期限\n3. 评估自己的风险承受能力\n4. 学习基础投资知识\n\n您目前处于哪个阶段呢？我可以为您制定个性化的投资入门计划。",
    time: "14:31",
    avatar: "🤖",
  },
  {
    type: "user",
    message: "我已经有了应急基金，想投资一些稳健的产品",
    time: "14:32",
  },
  {
    type: "coach",
    message:
      "太棒了！既然您已经建立了应急基金，我们可以开始制定投资计划。\n\n对于稳健投资，我推荐以下几种选择：\n\n💰 货币基金：年化收益2-3%，流动性好\n📈 债券基金：年化收益3-5%，风险较低\n🏦 银行理财：年化收益3-4%，期限灵活\n\n建议您可以按照4:3:3的比例进行配置。您觉得这个建议如何？",
    time: "14:33",
    avatar: "🤖",
  },
]

const learningPlan = [
  {
    week: 1,
    title: "理财基础建立",
    tasks: [
      { task: "完成风险评估测试", completed: true },
      { task: "学习资产配置概念", completed: true },
      { task: "制定理财目标", completed: false },
    ],
    progress: 67,
  },
  {
    week: 2,
    title: "投资工具认知",
    tasks: [
      { task: "了解基金分类", completed: false },
      { task: "学习股票基础知识", completed: false },
      { task: "认识债券投资", completed: false },
    ],
    progress: 0,
  },
  {
    week: 3,
    title: "实践操作指导",
    tasks: [
      { task: "开设投资账户", completed: false },
      { task: "进行模拟投资", completed: false },
      { task: "制定投资计划", completed: false },
    ],
    progress: 0,
  },
]

const achievements = [
  { name: "理财启蒙", description: "完成第一次AI教练对话", unlocked: true },
  { name: "学习达人", description: "连续7天与教练互动", unlocked: true },
  { name: "投资新手", description: "完成投资基础课程", unlocked: false },
  { name: "理财专家", description: "获得教练认证", unlocked: false },
]

export default function CoachPage() {
  const [message, setMessage] = useState("")
  const [selectedCoach, setSelectedCoach] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (message.trim()) {
      setIsTyping(true)
      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false)
      }, 2000)
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI理财教练</h1>
          <p className="text-gray-600">专业的一对一理财指导，助您成为理财达人</p>
        </div>

        {/* Coach Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学习进度</p>
                  <p className="text-2xl font-bold text-gray-900">45%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    本周+15%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">互动次数</p>
                  <p className="text-2xl font-bold text-gray-900">28</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    本月
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学习天数</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    连续
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
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

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="chat">智能对话</TabsTrigger>
            <TabsTrigger value="plan">学习计划</TabsTrigger>
            <TabsTrigger value="coaches">教练团队</TabsTrigger>
            <TabsTrigger value="progress">学习成果</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{coachProfiles[selectedCoach].avatar}</div>
                      <div>
                        <CardTitle className="text-lg">{coachProfiles[selectedCoach].name}</CardTitle>
                        <CardDescription>{coachProfiles[selectedCoach].specialty}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      在线
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start gap-3 max-w-[80%] ${chat.type === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <Avatar className="w-8 h-8">
                            {chat.type === "user" ? (
                              <AvatarFallback className="bg-blue-100 text-blue-600">张</AvatarFallback>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                {chat.avatar}
                              </div>
                            )}
                          </Avatar>
                          <div
                            className={`p-3 rounded-lg ${
                              chat.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="text-sm whitespace-pre-line">{chat.message}</div>
                            <div className={`text-xs mt-1 ${chat.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                              {chat.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              {coachProfiles[selectedCoach].avatar}
                            </div>
                          </Avatar>
                          <div className="p-3 bg-gray-100 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-100 p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="向教练提问..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!message.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quick Questions */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">快速提问：</div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setMessage("如何制定投资计划？")}
                        >
                          如何制定投资计划？
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setMessage("什么是资产配置？")}
                        >
                          什么是资产配置？
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setMessage("如何控制投资风险？")}
                        >
                          如何控制投资风险？
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coach Info & Features */}
              <div className="space-y-6">
                {/* Current Coach */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Sparkles className="w-5 h-5" />
                      当前教练
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{coachProfiles[selectedCoach].avatar}</div>
                      <h3 className="font-semibold text-blue-900">{coachProfiles[selectedCoach].name}</h3>
                      <p className="text-sm text-blue-700">{coachProfiles[selectedCoach].specialty}</p>
                    </div>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>{coachProfiles[selectedCoach].description}</p>
                      <p className="font-medium">{coachProfiles[selectedCoach].experience}</p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium text-blue-900">评分:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            ⭐
                          </span>
                        ))}
                        <span className="text-sm text-blue-700">{coachProfiles[selectedCoach].rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Tasks */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">今日任务</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">完成风险评估</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">学习资产配置</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Target className="w-5 h-5 text-gray-600" />
                      <span className="text-sm">制定理财目标</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>个性化学习计划</CardTitle>
                <CardDescription>根据您的学习进度制定的专属计划</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningPlan.map((week) => (
                    <div key={week.week} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          第{week.week}周：{week.title}
                        </h3>
                        <Badge variant={week.progress > 0 ? "default" : "secondary"}>{week.progress}% 完成</Badge>
                      </div>
                      <Progress value={week.progress} className="mb-4" />
                      <div className="space-y-2">
                        {week.tasks.map((task, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                task.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span
                              className={`text-sm ${task.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                            >
                              {task.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coaches" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coachProfiles.map((coach, index) => (
                <Card
                  key={coach.id}
                  className={`cursor-pointer transition-all ${
                    selectedCoach === index
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "bg-white/80 backdrop-blur-sm hover:shadow-lg"
                  } border-0 shadow-lg`}
                  onClick={() => setSelectedCoach(index)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{coach.avatar}</div>
                      <h3 className="font-semibold text-gray-900">{coach.name}</h3>
                      <p className="text-sm text-gray-600">{coach.specialty}</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{coach.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>经验:</span>
                        <span className="font-medium">{coach.experience}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>评分:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-medium">{coach.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant={selectedCoach === index ? "default" : "outline"}>
                      {selectedCoach === index ? "当前教练" : "选择教练"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>学习成就</CardTitle>
                  <CardDescription>您已获得的学习成就</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.unlocked ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale"}`}>
                            {achievement.unlocked ? "🏆" : "🔒"}
                          </div>
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

              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-900">学习建议</CardTitle>
                  <CardDescription className="text-green-700">教练为您量身定制的建议</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">学习重点</h4>
                        <p className="text-sm text-gray-600">建议您重点学习资产配置相关知识，这是理财的核心概念。</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">下周目标</h4>
                        <p className="text-sm text-gray-600">完成投资工具认知模块，了解不同投资产品的特点。</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">推荐阅读</h4>
                        <p className="text-sm text-gray-600">建议阅读《聪明的投资者》，加深对价值投资的理解。</p>
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
              <Link href="/education">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">理财学院</h3>
                    <p className="text-sm text-gray-600">系统学习理财知识</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/suggestion">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">投资建议</h3>
                    <p className="text-sm text-gray-600">获取个性化建议</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI助手</h3>
                    <p className="text-sm text-gray-600">智能问答服务</p>
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
