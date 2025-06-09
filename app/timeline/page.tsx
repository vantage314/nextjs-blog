"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  BookOpen,
  MessageCircle,
  Filter,
  Download,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const timelineEvents = [
  {
    id: 1,
    date: "2024-12-07",
    type: "investment",
    title: "首次投资基金",
    description: "投资华夏沪深300ETF联接A，金额¥5,000",
    amount: 5000,
    category: "投资行为",
    impact: "positive",
    milestone: false,
  },
  {
    id: 2,
    date: "2024-12-05",
    type: "learning",
    title: "完成理财基础课程",
    description: "在理财学院完成了基础理财规划课程",
    category: "学习成长",
    impact: "neutral",
    milestone: true,
  },
  {
    id: 3,
    date: "2024-12-03",
    type: "analysis",
    title: "财务分析报告生成",
    description: "系统生成了第一份个人财务分析报告",
    category: "数据分析",
    impact: "positive",
    milestone: false,
  },
  {
    id: 4,
    date: "2024-12-01",
    type: "goal",
    title: "设定理财目标",
    description: "设定了年化收益8%的投资目标",
    category: "目标规划",
    impact: "positive",
    milestone: true,
  },
  {
    id: 5,
    date: "2024-11-28",
    type: "import",
    title: "导入银行账单",
    description: "首次导入招商银行和支付宝账单数据",
    category: "数据导入",
    impact: "neutral",
    milestone: false,
  },
  {
    id: 6,
    date: "2024-11-25",
    type: "register",
    title: "注册FinCoach+",
    description: "开始您的智能理财之旅",
    category: "平台使用",
    impact: "positive",
    milestone: true,
  },
]

const achievements = [
  {
    date: "2024-12-05",
    title: "理财新手",
    description: "完成第一个学习模块",
    icon: "🎯",
  },
  {
    date: "2024-12-01",
    title: "目标设定者",
    description: "设定了明确的理财目标",
    icon: "🎯",
  },
  {
    date: "2024-11-25",
    title: "理财启蒙",
    description: "开始使用FinCoach+",
    icon: "🌟",
  },
]

const monthlyStats = [
  {
    month: "2024-11",
    actions: 3,
    learningHours: 5,
    investments: 0,
    achievements: 1,
  },
  {
    month: "2024-12",
    actions: 8,
    learningHours: 12,
    investments: 1,
    achievements: 2,
  },
]

const categories = [
  { name: "全部", count: 6, color: "bg-gray-500" },
  { name: "投资行为", count: 1, color: "bg-green-500" },
  { name: "学习成长", count: 1, color: "bg-blue-500" },
  { name: "数据分析", count: 1, color: "bg-purple-500" },
  { name: "目标规划", count: 1, color: "bg-yellow-500" },
  { name: "数据导入", count: 1, color: "bg-orange-500" },
  { name: "平台使用", count: 1, color: "bg-pink-500" },
]

export default function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedTimeframe, setSelectedTimeframe] = useState("全部")

  const filteredEvents = timelineEvents.filter((event) => {
    if (selectedCategory === "全部") return true
    return event.category === selectedCategory
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <DollarSign className="w-5 h-5" />
      case "learning":
        return <BookOpen className="w-5 h-5" />
      case "analysis":
        return <TrendingUp className="w-5 h-5" />
      case "goal":
        return <Target className="w-5 h-5" />
      case "import":
        return <Calendar className="w-5 h-5" />
      case "register":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getEventColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-600 border-green-200"
      case "negative":
        return "bg-red-100 text-red-600 border-red-200"
      default:
        return "bg-blue-100 text-blue-600 border-blue-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">成长时间轴</h1>
            <p className="text-gray-600">记录您的理财成长历程，见证每一步进步</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总行为数</p>
                  <p className="text-2xl font-bold text-gray-900">{timelineEvents.length}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    本月+5
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">里程碑</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Award className="w-3 h-3 mr-1" />
                    重要节点
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学习时长</p>
                  <p className="text-2xl font-bold text-gray-900">17h</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    累计
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">投资次数</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <DollarSign className="w-3 h-3 mr-1" />
                    首次投资
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="timeline">时间轴</TabsTrigger>
            <TabsTrigger value="achievements">成就记录</TabsTrigger>
            <TabsTrigger value="statistics">数据统计</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {/* Category Filter */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-2 h-2 rounded-full ${category.color}`} />
                      {category.name}
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>理财成长轨迹</CardTitle>
                <CardDescription>按时间顺序展示您的理财行为和成长历程</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-6">
                    {filteredEvents.map((event, index) => (
                      <div key={event.id} className="relative flex items-start gap-6">
                        {/* Timeline Dot */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getEventColor(event.impact)}`}
                        >
                          {getEventIcon(event.type)}
                          {event.milestone && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Award className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">{event.date}</div>
                                {event.amount && (
                                  <div className="text-lg font-bold text-green-600 mt-1">
                                    ¥{event.amount.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                              {event.milestone && (
                                <Badge variant="default" className="text-xs bg-yellow-500">
                                  里程碑
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>成就记录</CardTitle>
                <CardDescription>您在理财路上获得的重要成就</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-900">{achievement.title}</h3>
                        <p className="text-sm text-yellow-700">{achievement.description}</p>
                        <div className="text-xs text-yellow-600 mt-1">{achievement.date}</div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>月度活跃度</CardTitle>
                  <CardDescription>每月的理财行为统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyStats.map((stat, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">{stat.month}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>行为次数:</span>
                            <span className="font-medium">{stat.actions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>学习时长:</span>
                            <span className="font-medium">{stat.learningHours}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>投资次数:</span>
                            <span className="font-medium">{stat.investments}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>获得成就:</span>
                            <span className="font-medium">{stat.achievements}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-900">成长分析</CardTitle>
                  <CardDescription className="text-blue-700">您的理财成长轨迹分析</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">学习进步</h4>
                        <p className="text-sm text-gray-600">本月学习时长较上月增长140%，学习积极性显著提升。</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">行为活跃</h4>
                        <p className="text-sm text-gray-600">理财行为次数稳步增长，说明您正在养成良好的理财习惯。</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">成就解锁</h4>
                        <p className="text-sm text-gray-600">已获得3个重要成就，理财知识和技能不断提升。</p>
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
              <Link href="/diary">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">理财日记</h3>
                    <p className="text-sm text-gray-600">记录理财心得体会</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/coach">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI教练</h3>
                    <p className="text-sm text-gray-600">获得成长指导建议</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/education">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">理财学院</h3>
                    <p className="text-sm text-gray-600">继续学习提升</p>
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
