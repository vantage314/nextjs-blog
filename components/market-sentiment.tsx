"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Newspaper,
  BarChart3,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

const marketSentimentData = [
  { date: "12-01", sentiment: 65, volume: 120 },
  { date: "12-02", sentiment: 72, volume: 135 },
  { date: "12-03", sentiment: 58, volume: 98 },
  { date: "12-04", sentiment: 81, volume: 156 },
  { date: "12-05", sentiment: 69, volume: 142 },
  { date: "12-06", sentiment: 75, volume: 168 },
  { date: "12-07", sentiment: 83, volume: 189 },
]

const newsData = [
  {
    title: "央行宣布降准0.5个百分点",
    summary: "为支持实体经济发展，央行决定下调存款准备金率，释放流动性约1.2万亿元",
    sentiment: "positive",
    impact: "high",
    time: "2小时前",
    source: "财经新闻",
  },
  {
    title: "科技股集体上涨，AI概念持续火热",
    summary: "受益于人工智能技术发展预期，多只科技股涨幅超过5%",
    sentiment: "positive",
    impact: "medium",
    time: "4小时前",
    source: "市场快讯",
  },
  {
    title: "房地产政策边际放松信号显现",
    summary: "多个城市调整房地产调控政策，市场预期逐步改善",
    sentiment: "neutral",
    impact: "medium",
    time: "6小时前",
    source: "政策解读",
  },
  {
    title: "美联储加息预期降温",
    summary: "通胀数据回落，市场预期美联储加息步伐将放缓",
    sentiment: "positive",
    impact: "high",
    time: "8小时前",
    source: "国际财经",
  },
]

const sectorScores = [
  { sector: "科技", score: 85, change: "+5.2", trend: "up" },
  { sector: "金融", score: 72, change: "+2.1", trend: "up" },
  { sector: "消费", score: 68, change: "-1.3", trend: "down" },
  { sector: "医药", score: 75, change: "+3.8", trend: "up" },
  { sector: "地产", score: 45, change: "-2.5", trend: "down" },
  { sector: "能源", score: 58, change: "+1.2", trend: "up" },
]

const upcomingEvents = [
  {
    date: "12-15",
    event: "美联储利率决议",
    importance: "high",
    description: "市场关注加息幅度",
  },
  {
    date: "12-18",
    event: "中央经济工作会议",
    importance: "high",
    description: "明年经济政策定调",
  },
  {
    date: "12-20",
    event: "11月CPI数据发布",
    importance: "medium",
    description: "通胀走势关键指标",
  },
  {
    date: "12-22",
    event: "年末资金面观察",
    importance: "medium",
    description: "流动性状况监测",
  },
]

export function MarketSentiment() {
  return (
    <div className="space-y-6">
      {/* Market Temperature */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">市场温度</span>
              </div>
              <Badge className="bg-green-100 text-green-700">偏热</Badge>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">75°C</div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span>较昨日 +3°C</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">关注度</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700">高</Badge>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">8.2</div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <TrendingUp className="w-4 h-4" />
              <span>较昨日 +12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">情绪指数</span>
              </div>
              <Badge className="bg-purple-100 text-purple-700">乐观</Badge>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">83</div>
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <TrendingUp className="w-4 h-4" />
              <span>较昨日 +8点</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="sentiment">情绪分析</TabsTrigger>
          <TabsTrigger value="news">舆情雷达</TabsTrigger>
          <TabsTrigger value="sectors">行业评分</TabsTrigger>
          <TabsTrigger value="calendar">事件日历</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>市场情绪趋势</CardTitle>
              <CardDescription>基于多维度数据分析的市场情绪变化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketSentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="情绪指数"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                舆情雷达
              </CardTitle>
              <CardDescription>实时追踪市场热点新闻和情绪变化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsData.map((news, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 flex-1">{news.title}</h3>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge
                          variant={
                            news.sentiment === "positive"
                              ? "default"
                              : news.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {news.sentiment === "positive" ? (
                            <>
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              利好
                            </>
                          ) : news.sentiment === "negative" ? (
                            <>
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              利空
                            </>
                          ) : (
                            <>中性</>
                          )}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {news.impact === "high" ? "高影响" : "中影响"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{news.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{news.source}</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>行业评分排行</CardTitle>
              <CardDescription>基于基本面、技术面、情绪面的综合评分</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorScores.map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium text-gray-900">{sector.sector}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">{sector.score}</div>
                        <div
                          className={`flex items-center text-sm ${
                            sector.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {sector.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {sector.change}
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={sector.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                重要事件日历
              </CardTitle>
              <CardDescription>影响市场的重要事件和数据发布时间</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{event.date.split("-")[1]}</div>
                      <div className="text-xs text-gray-500">12月</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{event.event}</h3>
                        <Badge variant={event.importance === "high" ? "destructive" : "secondary"} className="text-xs">
                          {event.importance === "high" ? (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              重要
                            </>
                          ) : (
                            <>一般</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
