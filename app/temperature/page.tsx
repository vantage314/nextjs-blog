"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Thermometer,
  TrendingUp,
  FlameIcon as Fire,
  Snowflake,
  RefreshCw,
  Filter,
  Calendar,
  Target,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const industryHeat = [
  { name: "人工智能", heat: 95, change: "+12%", volume: 2340, color: "#EF4444" },
  { name: "新能源", heat: 88, change: "+8%", volume: 1890, color: "#F97316" },
  { name: "生物医药", heat: 82, change: "+15%", volume: 1560, color: "#F59E0B" },
  { name: "半导体", heat: 78, change: "-3%", volume: 1420, color: "#EAB308" },
  { name: "消费电子", heat: 72, change: "+5%", volume: 1280, color: "#84CC16" },
  { name: "新材料", heat: 68, change: "+7%", volume: 1150, color: "#22C55E" },
  { name: "云计算", heat: 65, change: "-2%", volume: 980, color: "#10B981" },
  { name: "电动汽车", heat: 62, change: "+10%", volume: 890, color: "#06B6D4" },
]

const marketTemperature = [
  { time: "09:30", temp: 65 },
  { time: "10:00", temp: 68 },
  { time: "10:30", temp: 72 },
  { time: "11:00", temp: 75 },
  { time: "11:30", temp: 73 },
  { time: "13:00", temp: 78 },
  { time: "13:30", temp: 82 },
  { time: "14:00", temp: 85 },
  { time: "14:30", temp: 83 },
  { time: "15:00", temp: 80 },
]

const hotStocks = [
  { name: "比亚迪", code: "002594", heat: 98, price: "258.60", change: "+5.2%" },
  { name: "宁德时代", code: "300750", heat: 95, price: "412.80", change: "+3.8%" },
  { name: "隆基绿能", code: "601012", heat: 92, price: "28.45", change: "+7.1%" },
  { name: "药明康德", code: "603259", heat: 89, price: "78.90", change: "+2.4%" },
  { name: "中芯国际", code: "688981", heat: 86, price: "45.20", change: "-1.2%" },
]

const sectorDistribution = [
  { name: "科技股", value: 35, color: "#3B82F6" },
  { name: "消费股", value: 25, color: "#10B981" },
  { name: "医药股", value: 20, color: "#F59E0B" },
  { name: "金融股", value: 12, color: "#8B5CF6" },
  { name: "其他", value: 8, color: "#6B7280" },
]

export default function TemperaturePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("今日")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const getHeatColor = (heat: number) => {
    if (heat >= 90) return "text-red-600 bg-red-100"
    if (heat >= 80) return "text-orange-600 bg-orange-100"
    if (heat >= 70) return "text-yellow-600 bg-yellow-100"
    if (heat >= 60) return "text-green-600 bg-green-100"
    return "text-blue-600 bg-blue-100"
  }

  const getHeatIcon = (heat: number) => {
    if (heat >= 80) return <Fire className="w-4 h-4" />
    if (heat >= 60) return <Thermometer className="w-4 h-4" />
    return <Snowflake className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">市场温度</h1>
            <p className="text-gray-600">实时监控各行业投资热度，把握市场脉搏</p>
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
                  <p className="text-sm font-medium text-gray-600">市场总温度</p>
                  <p className="text-2xl font-bold text-gray-900">78°C</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <Fire className="w-3 h-3 mr-1" />
                    热度较高
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Thermometer className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">最热行业</p>
                  <p className="text-2xl font-bold text-gray-900">AI</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    95°C
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Fire className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃股票数</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +156 今日
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">资金流入</p>
                  <p className="text-2xl font-bold text-gray-900">+128亿</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    净流入
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="industries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="industries">行业热度</TabsTrigger>
            <TabsTrigger value="trends">温度趋势</TabsTrigger>
            <TabsTrigger value="stocks">热门个股</TabsTrigger>
            <TabsTrigger value="sectors">板块分布</TabsTrigger>
          </TabsList>

          <TabsContent value="industries" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>行业热度排行</CardTitle>
                <CardDescription>各行业当前投资热度指数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryHeat.map((industry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{industry.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>交易量: {industry.volume}万手</span>
                            <span
                              className={`font-medium ${industry.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {industry.change}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold">{industry.heat}°C</div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getHeatColor(industry.heat)}`}
                          >
                            {getHeatIcon(industry.heat)}
                            {industry.heat >= 90
                              ? "极热"
                              : industry.heat >= 80
                                ? "很热"
                                : industry.heat >= 70
                                  ? "较热"
                                  : industry.heat >= 60
                                    ? "温和"
                                    : "冷淡"}
                          </div>
                        </div>
                        <div className="w-20">
                          <Progress value={industry.heat} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>市场温度趋势</CardTitle>
                <CardDescription>今日市场整体热度变化曲线</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketTemperature}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}°C`, "市场温度"]} />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">85°C</div>
                    <div className="text-sm text-red-700">最高温度</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">65°C</div>
                    <div className="text-sm text-blue-700">最低温度</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">75°C</div>
                    <div className="text-sm text-green-700">平均温度</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stocks" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>热门个股排行</CardTitle>
                <CardDescription>当前最受关注的个股热度排名</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotStocks.map((stock, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{stock.name}</h3>
                          <div className="text-sm text-gray-600">{stock.code}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">¥{stock.price}</div>
                          <div
                            className={`text-sm font-medium ${stock.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {stock.change}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">{stock.heat}°C</div>
                          <div className="w-16">
                            <Progress value={stock.heat} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>板块热度分布</CardTitle>
                  <CardDescription>各板块在热门股票中的占比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sectorDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "占比"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {sectorDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-900">温度解读</CardTitle>
                  <CardDescription className="text-red-700">当前市场热度分析</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Fire className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">市场过热警示</h4>
                        <p className="text-sm text-gray-600">
                          当前市场温度达到78°C，处于较高水平，建议谨慎追高，注意风险控制。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">热点轮动</h4>
                        <p className="text-sm text-gray-600">AI和新能源板块持续领涨，建议关注板块轮动机会。</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">投资建议</h4>
                        <p className="text-sm text-gray-600">建议分批建仓，避免集中投资单一热门板块。</p>
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
              <Link href="/radar">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Thermometer className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">舆情雷达</h3>
                    <p className="text-sm text-gray-600">查看市场情绪变化</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/suggestion">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Fire className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">投资建议</h3>
                    <p className="text-sm text-gray-600">获取热点投资策略</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI助手</h3>
                    <p className="text-sm text-gray-600">咨询投资热点分析</p>
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
