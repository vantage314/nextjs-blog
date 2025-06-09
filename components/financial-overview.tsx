"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, AlertTriangle, CheckCircle, FileText } from "lucide-react"

const assetData = [
  { name: "现金储蓄", value: 45000, color: "#3B82F6" },
  { name: "基金投资", value: 32000, color: "#10B981" },
  { name: "股票投资", value: 28000, color: "#F59E0B" },
  { name: "其他投资", value: 23500, color: "#8B5CF6" },
]

const monthlyData = [
  { month: "1月", income: 12000, expense: 8500, saving: 3500 },
  { month: "2月", income: 12000, expense: 7800, saving: 4200 },
  { month: "3月", income: 13500, income: 9200, saving: 4300 },
  { month: "4月", income: 12000, expense: 8100, saving: 3900 },
  { month: "5月", income: 12000, expense: 8400, saving: 3600 },
  { month: "6月", income: 14000, expense: 8240, saving: 5760 },
]

const expenseCategories = [
  { category: "生活必需", amount: 3200, percentage: 39, color: "#EF4444" },
  { category: "娱乐消费", amount: 1800, percentage: 22, color: "#F59E0B" },
  { category: "交通出行", amount: 1200, percentage: 15, color: "#3B82F6" },
  { category: "医疗健康", amount: 800, percentage: 10, color: "#10B981" },
  { category: "其他支出", amount: 1240, percentage: 14, color: "#8B5CF6" },
]

export function FinancialOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Asset Allocation */}
      <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            资产配置分析
          </CardTitle>
          <CardDescription>您的资产分布情况及建议优化方案</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
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
            <div className="space-y-4">
              {assetData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">¥{item.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {((item.value / assetData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="w-5 h-5" />
            AI 智能建议
          </CardTitle>
          <CardDescription className="text-blue-700">基于您的财务状况生成的个性化建议</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/60 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">资产配置优化</h4>
                <p className="text-sm text-gray-600">建议将现金储蓄的10%转入稳健型基金，提高资金收益率</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/60 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">支出控制提醒</h4>
                <p className="text-sm text-gray-600">本月娱乐消费超出预算15%，建议适当控制非必要支出</p>
              </div>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            生成详细分析报告
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="lg:col-span-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>收支趋势分析</CardTitle>
          <CardDescription>近6个月的收入、支出和储蓄变化趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
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
                <Line type="monotone" dataKey="saving" stroke="#3B82F6" strokeWidth={3} name="储蓄" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{category.percentage}%</span>
                    <span className="text-sm font-semibold">¥{category.amount.toLocaleString()}</span>
                  </div>
                </div>
                <Progress
                  value={category.percentage}
                  className="h-2"
                  style={
                    {
                      "--progress-background": category.color,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Score */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-900">财务健康评分</CardTitle>
          <CardDescription className="text-green-700">综合评估您的财务状况</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">85</div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              良好
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>储蓄能力</span>
              <span className="font-medium">90分</span>
            </div>
            <Progress value={90} className="h-2" />

            <div className="flex justify-between text-sm">
              <span>投资配置</span>
              <span className="font-medium">82分</span>
            </div>
            <Progress value={82} className="h-2" />

            <div className="flex justify-between text-sm">
              <span>风险控制</span>
              <span className="font-medium">78分</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
