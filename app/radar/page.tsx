"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { RadarIcon, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Filter, Calendar, BarChart3 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const sentimentData = [
  { subject: "股票市场", A: 120, B: 110, fullMark: 150 },
  { subject: "基金投资", A: 98, B: 130, fullMark: 150 },
  { subject: "债券市场", A: 86, B: 130, fullMark: 150 },
  { subject: "房地产", A: 99, B: 100, fullMark: 150 },
  { subject: "数字货币", A: 85, B: 90, fullMark: 150 },
  { subject: "黄金投资", A: 65, B: 85, fullMark: 150 },
]

const trendData = [
  { time: "09:00", sentiment: 65, volume: 120 },
  { time: "10:00", sentiment: 68, volume: 135 },
  { time: "11:00", sentiment: 72, volume: 148 },
  { time: "12:00", sentiment: 70, volume: 142 },
  { time: "13:00", sentiment: 75, volume: 156 },
  { time: "14:00", sentiment: 73, volume: 151 },
  { time: "15:00", sentiment: 78, volume: 168 },
]

const hotTopics = [
  {
    title: "央行降准政策影响分析",
    sentiment: "积极",
    score: 85,
    mentions: 1240,
    trend: "+12%",
    category: "货币政策",
  },
  {
    title: "科技股估值回调讨论",
    sentiment: "谨慎",
    score: 45,
    mentions: 890,
    trend: "-8%",
    category: "行业分析",
  },
  {
    title: "新能源板块投资机会",
    sentiment: "乐观",
    score: 78,
    mentions: 756,
    trend: "+15%",
    category: "投资机会",
  },
  {
    title: "房地产市场政策解读",
    sentiment: "中性",
    score: 62,
    mentions: 634,
    trend: "+3%",
    category: "政策解读",
  },
]

const newsAnalysis = [
  {
    source: "财经新闻",
    title: "A股三大指数集体上涨，创业板指涨超2%",
    sentiment: "积极",
    impact: "高",
    time: "2小时前",
    summary: "市场情绪回暖，资金流入明显增加",
  },
  {
    source: "券商研报",
    title: "机构看好四季度消费复苏前景",
    sentiment: "乐观",
    impact: "中",
    time: "4小时前",
    summary: "消费板块有望迎来估值修复机会",
  },
  {
    source: "政策解读",
    title: "监管层释放积极信号，市场预期改善",
    sentiment: "积极",
    impact: "高",
    time: "6小时前",
    summary: "政策底部确认，投资者信心逐步恢复",
  },
]

export default function RadarPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("今日")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">舆情雷达</h1>
            <p className="text-gray-600">实时监控市场情绪变化，把握投资风向标</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              刷新数据
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">市场情绪指数</p>
                  <p className="text-2xl font-bold text-gray-900">73</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5 较昨日
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <RadarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">热度话题数</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +23 新增
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">风险预警</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    中等风险
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">数据更新</p>
                  <p className="text-2xl font-bold text-gray-900">实时</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    5分钟前
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">情绪雷达</TabsTrigger>
            <TabsTrigger value="trends">趋势分析</TabsTrigger>
            <TabsTrigger value="topics">热点话题</TabsTrigger>
            <TabsTrigger value="news">新闻解读</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Radar */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>市场情绪雷达图</CardTitle>
                  <CardDescription>各投资领域的情绪分布情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={sentimentData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 150]} />
                        <Radar name="当前情绪" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                        <Radar name="历史平均" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Distribution */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-900">情绪分布统计</CardTitle>
                  <CardDescription className="text-blue-700">当前市场各类情绪占比</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">乐观情绪</span>
                      <span className="text-sm font-semibold text-green-600">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">中性情绪</span>
                      <span className="text-sm font-semibold text-blue-600">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">谨慎情绪</span>
                      <span className="text-sm font-semibold text-yellow-600">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>

                  <div className="mt-6 p-4 bg-white/60 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">情绪解读</h4>
                    <p className="text-sm text-gray-600">
                      当前市场整体情绪偏向乐观，投资者信心有所回升。建议关注政策面变化和资金流向。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>情绪趋势变化</CardTitle>
                <CardDescription>今日市场情绪指数变化曲线</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sentiment" stroke="#3B82F6" strokeWidth={2} name="情绪指数" />
                      <Line type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} name="讨论热度" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>热点话题排行</CardTitle>
                <CardDescription>当前最受关注的投资话题</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{topic.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Badge variant="outline">{topic.category}</Badge>
                            <span>讨论量: {topic.mentions}</span>
                            <span
                              className={`font-medium ${topic.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {topic.trend}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{topic.score}</div>
                          <Badge
                            variant={
                              topic.sentiment === "积极" || topic.sentiment === "乐观"
                                ? "default"
                                : topic.sentiment === "谨慎"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {topic.sentiment}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={topic.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>新闻情绪解读</CardTitle>
                <CardDescription>重要财经新闻的情绪分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsAnalysis.map((news, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{news.source}</Badge>
                            <span className="text-xs text-gray-500">{news.time}</span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">{news.title}</h3>
                          <p className="text-sm text-gray-600">{news.summary}</p>
                        </div>
                        <div className="text-right ml-4">
                          <Badge
                            variant={news.sentiment === "积极" || news.sentiment === "乐观" ? "default" : "secondary"}
                            className="mb-2"
                          >
                            {news.sentiment}
                          </Badge>
                          <div className="text-xs text-gray-500">影响: {news.impact}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">相关功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/temperature">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">市场温度</h3>
                    <p className="text-sm text-gray-600">查看各行业投资热度</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <RadarIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI助手</h3>
                    <p className="text-sm text-gray-600">咨询市场情绪分析</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/analysis">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">财务分析</h3>
                    <p className="text-sm text-gray-600">结合情绪分析投资</p>
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
