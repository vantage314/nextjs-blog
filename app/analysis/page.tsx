"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

const assetData = [
  { name: "现金储蓄", value: 45000, color: "#3B82F6", percentage: 35.2 },
  { name: "基金投资", value: 32000, color: "#10B981", percentage: 25.0 },
  { name: "股票投资", value: 28000, color: "#F59E0B", percentage: 21.9 },
  { name: "其他投资", value: 23000, color: "#8B5CF6", percentage: 18.0 },
]

const monthlyTrend = [
  { month: "7月", income: 12000, expense: 8500, saving: 3500 },
  { month: "8月", income: 12000, expense: 7800, saving: 4200 },
  { month: "9月", income: 13500, expense: 9200, saving: 4300 },
  { month: "10月", income: 12000, expense: 8100, saving: 3900 },
  { month: "11月", income: 12000, expense: 8400, saving: 3600 },
  { month: "12月", income: 14000, expense: 8240, saving: 5760 },
]

const expenseCategories = [
  { category: "生活必需", amount: 3200, percentage: 39, trend: "+5%" },
  { category: "娱乐消费", amount: 1800, percentage: 22, trend: "+12%" },
  { category: "交通出行", amount: 1200, percentage: 15, trend: "-3%" },
  { category: "医疗健康", amount: 800, percentage: 10, trend: "+8%" },
  { category: "教育培训", amount: 600, percentage: 7, trend: "+15%" },
  { category: "其他支出", amount: 640, percentage: 8, trend: "-2%" },
]

const investmentPerformance = [
  { name: "沪深300指数基金", value: 15000, return: 8.5, risk: "中等" },
  { name: "债券型基金", value: 12000, return: 4.2, risk: "低" },
  { name: "科技股票", value: 8000, return: 12.3, risk: "高" },
  { name: "货币基金", value: 5000, return: 2.1, risk: "极低" },
]

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">财务分析报告</h1>
            <p className="text-gray-600">基于您的财务数据生成的详细分析报告 • 更新时间：2024年12月7日</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              导出报告
            </Button>
            <Link href="/suggestion">
              <Button className="bg-blue-600 hover:bg-blue-700">
                获取建议
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总资产</p>
                  <p className="text-2xl font-bold text-gray-900">¥128,000</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5.2% 本月
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">月度储蓄率</p>
                  <p className="text-2xl font-bold text-gray-900">41.1%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.3% 环比
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
                  <p className="text-sm font-medium text-gray-600">投资收益率</p>
                  <p className="text-2xl font-bold text-gray-900">7.8%</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -1.2% 本月
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">财务健康度</p>
                  <p className="text-2xl font-bold text-gray-900">85分</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    良好
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">资产概览</TabsTrigger>
            <TabsTrigger value="cashflow">收支分析</TabsTrigger>
            <TabsTrigger value="investment">投资分析</TabsTrigger>
            <TabsTrigger value="insights">智能洞察</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Allocation */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>资产配置分布</CardTitle>
                  <CardDescription>您的资产在不同类别中的分配情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {assetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, "金额"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {assetData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">¥{item.value.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Asset Allocation Recommendations */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-900">配置建议</CardTitle>
                  <CardDescription className="text-blue-700">基于您的风险偏好和财务目标的优化建议</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">现金比例优化</h4>
                        <p className="text-sm text-gray-600">
                          当前现金占比35.2%，建议降至25%，将多余资金投入稳健型基金
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">风险分散建议</h4>
                        <p className="text-sm text-gray-600">建议增加债券类资产配置，提高投资组合的稳定性</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">目标配置</h4>
                        <p className="text-sm text-gray-600">建议配置：25%现金 + 40%基金 + 25%股票 + 10%债券</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">查看详细配置方案</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-6">
            {/* Monthly Trend */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>收支趋势分析</CardTitle>
                <CardDescription>近6个月的收入、支出和储蓄变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, ""]} />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                        name="收入"
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stackId="2"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.6}
                        name="支出"
                      />
                      <Area
                        type="monotone"
                        dataKey="saving"
                        stackId="3"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                        name="储蓄"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>支出分类详情</CardTitle>
                <CardDescription>本月各类支出占比及同比变化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.category}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{category.percentage}%</span>
                          <span className="text-sm font-semibold">¥{category.amount.toLocaleString()}</span>
                          <Badge
                            variant={category.trend.startsWith("+") ? "destructive" : "default"}
                            className="text-xs"
                          >
                            {category.trend}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>投资组合表现</CardTitle>
                <CardDescription>您的投资产品收益情况和风险分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentPerformance.map((investment, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{investment.name}</h3>
                          <p className="text-sm text-gray-600">持仓金额：¥{investment.value.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${investment.return > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {investment.return > 0 ? "+" : ""}
                            {investment.return}%
                          </div>
                          <Badge
                            variant={
                              investment.risk === "极低"
                                ? "default"
                                : investment.risk === "低"
                                  ? "secondary"
                                  : investment.risk === "中等"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {investment.risk}风险
                          </Badge>
                        </div>
                      </div>
                      <Progress value={Math.abs(investment.return) * 5} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-900">AI 智能洞察</CardTitle>
                  <CardDescription className="text-purple-700">基于您的财务数据生成的个性化分析洞察</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">储蓄能力优秀</h4>
                        <p className="text-sm text-gray-600">您的储蓄率41.1%远超同龄人平均水平(23%)，财务纪律性很强</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">娱乐支出增长</h4>
                        <p className="text-sm text-gray-600">近期娱乐消费增长12%，建议关注是否影响储蓄目标</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">投资配置建议</h4>
                        <p className="text-sm text-gray-600">当前投资风险偏保守，可适当增加成长型资产配置</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>行动建议</CardTitle>
                  <CardDescription>基于分析结果的具体改进建议</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-2">优先级：高</h4>
                    <p className="text-sm text-blue-800 mb-3">建议将部分现金转入货币基金，提高资金利用效率</p>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                      查看详情
                    </Button>
                  </div>

                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900 mb-2">优先级：中</h4>
                    <p className="text-sm text-green-800 mb-3">制定明确的投资目标和时间规划</p>
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                      制定计划
                    </Button>
                  </div>

                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-900 mb-2">优先级：低</h4>
                    <p className="text-sm text-yellow-800 mb-3">考虑开设专门的教育基金账户</p>
                    <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                      了解更多
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">下一步行动</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/suggestion">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">获取策略建议</h3>
                    <p className="text-sm text-gray-600">生成个性化的投资策略建议书</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/strategy">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">策略模拟</h3>
                    <p className="text-sm text-gray-600">模拟不同投资策略的表现</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">咨询AI助手</h3>
                    <p className="text-sm text-gray-600">获得专业的理财问答服务</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * 以上分析结果均为系统生成，仅供参考，不构成投资建议。投资有风险，决策需谨慎。
          </p>
        </div>
      </div>
    </div>
  )
}
