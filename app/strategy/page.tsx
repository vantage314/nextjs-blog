"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calculator,
  Play,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

const strategies = [
  {
    name: "保守型策略",
    description: "低风险，稳定收益",
    allocation: { cash: 40, bond: 40, fund: 15, stock: 5 },
    expectedReturn: 5.2,
    maxDrawdown: -3.5,
    volatility: 4.8,
    color: "#10B981",
  },
  {
    name: "稳健型策略",
    description: "平衡风险与收益",
    allocation: { cash: 25, bond: 30, fund: 30, stock: 15 },
    expectedReturn: 7.8,
    maxDrawdown: -8.2,
    volatility: 8.5,
    color: "#3B82F6",
  },
  {
    name: "积极型策略",
    description: "追求高收益，承担高风险",
    allocation: { cash: 15, bond: 20, fund: 35, stock: 30 },
    expectedReturn: 11.5,
    maxDrawdown: -15.8,
    volatility: 16.2,
    color: "#8B5CF6",
  },
]

const historicalData = [
  { year: "2019", conservative: 4.2, balanced: 8.5, aggressive: 15.2, market: 22.3 },
  { year: "2020", conservative: 3.8, balanced: 12.8, aggressive: 28.5, market: 27.2 },
  { year: "2021", conservative: 4.5, balanced: 15.2, aggressive: 32.8, market: 4.8 },
  { year: "2022", conservative: 5.1, balanced: -2.5, aggressive: -12.8, market: -21.6 },
  { year: "2023", conservative: 4.8, balanced: 6.8, aggressive: 8.5, market: -3.7 },
  { year: "2024", conservative: 5.2, balanced: 7.8, aggressive: 11.5, market: 15.8 },
]

const monthlyReturns = [
  { month: "1月", conservative: 0.4, balanced: 0.8, aggressive: 1.2 },
  { month: "2月", conservative: 0.3, balanced: -0.5, aggressive: -2.1 },
  { month: "3月", conservative: 0.5, balanced: 1.2, aggressive: 2.8 },
  { month: "4月", conservative: 0.4, balanced: 0.6, aggressive: 0.9 },
  { month: "5月", conservative: 0.3, balanced: -0.8, aggressive: -1.5 },
  { month: "6月", conservative: 0.4, balanced: 0.9, aggressive: 1.8 },
  { month: "7月", conservative: 0.5, balanced: 1.1, aggressive: 2.2 },
  { month: "8月", conservative: 0.3, balanced: -0.3, aggressive: -0.8 },
  { month: "9月", conservative: 0.4, balanced: 0.7, aggressive: 1.5 },
  { month: "10月", conservative: 0.5, balanced: 0.8, aggressive: 1.3 },
  { month: "11月", conservative: 0.4, balanced: 0.9, aggressive: 1.7 },
  { month: "12月", conservative: 0.4, balanced: 0.6, aggressive: 1.2 },
]

export default function StrategyPage() {
  const [selectedStrategy, setSelectedStrategy] = useState(1)
  const [investmentAmount, setInvestmentAmount] = useState([100000])
  const [investmentPeriod, setInvestmentPeriod] = useState([5])
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
    }, 2000)
  }

  const calculateProjection = (strategy: any, amount: number, years: number) => {
    const annualReturn = strategy.expectedReturn / 100
    const finalValue = amount * Math.pow(1 + annualReturn, years)
    const totalReturn = finalValue - amount
    const annualizedReturn = strategy.expectedReturn

    return {
      finalValue,
      totalReturn,
      annualizedReturn,
    }
  }

  const projection = calculateProjection(strategies[selectedStrategy], investmentAmount[0], investmentPeriod[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">策略模拟器</h1>
            <p className="text-gray-600">模拟不同投资策略的历史表现，帮助您做出明智的投资决策</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSimulation} disabled={isSimulating}>
              {isSimulating ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  模拟中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  开始模拟
                </>
              )}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* Strategy Selection */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              策略选择
            </CardTitle>
            <CardDescription>选择您想要模拟的投资策略类型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStrategy === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedStrategy(index)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: strategy.color }} />
                    <h3 className="font-semibold text-gray-900">{strategy.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>预期年化收益</span>
                      <span className="font-medium text-green-600">{strategy.expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>最大回撤</span>
                      <span className="font-medium text-red-600">{strategy.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>波动率</span>
                      <span className="font-medium text-gray-600">{strategy.volatility}%</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>
                        现金 {strategy.allocation.cash}% • 债券 {strategy.allocation.bond}%
                      </div>
                      <div>
                        基金 {strategy.allocation.fund}% • 股票 {strategy.allocation.stock}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simulation Parameters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              模拟参数设置
            </CardTitle>
            <CardDescription>设置投资金额和投资期限进行个性化模拟</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-gray-700">投资金额</label>
                  <span className="text-lg font-bold text-blue-600">¥{investmentAmount[0].toLocaleString()}</span>
                </div>
                <Slider
                  value={investmentAmount}
                  onValueChange={setInvestmentAmount}
                  max={1000000}
                  min={10000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>¥1万</span>
                  <span>¥100万</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-gray-700">投资期限</label>
                  <span className="text-lg font-bold text-blue-600">{investmentPeriod[0]}年</span>
                </div>
                <Slider
                  value={investmentPeriod}
                  onValueChange={setInvestmentPeriod}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1年</span>
                  <span>20年</span>
                </div>
              </div>
            </div>

            {/* Projection Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">¥{projection.finalValue.toLocaleString()}</div>
                <div className="text-sm text-green-700">预期最终价值</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">¥{projection.totalReturn.toLocaleString()}</div>
                <div className="text-sm text-blue-700">预期总收益</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{projection.annualizedReturn.toFixed(1)}%</div>
                <div className="text-sm text-purple-700">年化收益率</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="historical" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="historical">历史回测</TabsTrigger>
            <TabsTrigger value="comparison">策略对比</TabsTrigger>
            <TabsTrigger value="risk">风险分析</TabsTrigger>
            <TabsTrigger value="scenarios">情景分析</TabsTrigger>
          </TabsList>

          <TabsContent value="historical" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>历史表现回测</CardTitle>
                <CardDescription>基于过去6年的市场数据模拟各策略表现</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Line type="monotone" dataKey="conservative" stroke="#10B981" strokeWidth={2} name="保守型" />
                      <Line type="monotone" dataKey="balanced" stroke="#3B82F6" strokeWidth={2} name="稳健型" />
                      <Line type="monotone" dataKey="aggressive" stroke="#8B5CF6" strokeWidth={2} name="积极型" />
                      <Line
                        type="monotone"
                        dataKey="market"
                        stroke="#EF4444"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="市场基准"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">5.0%</div>
                    <div className="text-sm text-green-700">保守型年化收益</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">8.1%</div>
                    <div className="text-sm text-blue-700">稳健型年化收益</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">13.6%</div>
                    <div className="text-sm text-purple-700">积极型年化收益</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">7.5%</div>
                    <div className="text-sm text-red-700">市场基准收益</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>策略对比分析</CardTitle>
                <CardDescription>对比不同策略在各项指标上的表现差异</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Bar dataKey="conservative" fill="#10B981" name="保守型" />
                      <Bar dataKey="balanced" fill="#3B82F6" name="稳健型" />
                      <Bar dataKey="aggressive" fill="#8B5CF6" name="积极型" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">指标</th>
                        <th className="text-center py-3 px-4">保守型</th>
                        <th className="text-center py-3 px-4">稳健型</th>
                        <th className="text-center py-3 px-4">积极型</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">年化收益率</td>
                        <td className="text-center py-3 px-4 text-green-600">5.2%</td>
                        <td className="text-center py-3 px-4 text-blue-600">7.8%</td>
                        <td className="text-center py-3 px-4 text-purple-600">11.5%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">最大回撤</td>
                        <td className="text-center py-3 px-4 text-green-600">-3.5%</td>
                        <td className="text-center py-3 px-4 text-blue-600">-8.2%</td>
                        <td className="text-center py-3 px-4 text-purple-600">-15.8%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">波动率</td>
                        <td className="text-center py-3 px-4">4.8%</td>
                        <td className="text-center py-3 px-4">8.5%</td>
                        <td className="text-center py-3 px-4">16.2%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">夏普比率</td>
                        <td className="text-center py-3 px-4">0.85</td>
                        <td className="text-center py-3 px-4">0.72</td>
                        <td className="text-center py-3 px-4">0.58</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">胜率</td>
                        <td className="text-center py-3 px-4">78%</td>
                        <td className="text-center py-3 px-4">65%</td>
                        <td className="text-center py-3 px-4">58%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>风险指标分析</CardTitle>
                  <CardDescription>{strategies[selectedStrategy].name}的详细风险评估</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">波动率</span>
                        <span className="text-sm font-bold">{strategies[selectedStrategy].volatility}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(strategies[selectedStrategy].volatility / 20) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">最大回撤</span>
                        <span className="text-sm font-bold text-red-600">
                          {strategies[selectedStrategy].maxDrawdown}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(Math.abs(strategies[selectedStrategy].maxDrawdown) / 20) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">下行风险</span>
                        <span className="text-sm font-bold">
                          {(strategies[selectedStrategy].volatility * 0.7).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${((strategies[selectedStrategy].volatility * 0.7) / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900 mb-1">风险提示</h4>
                        <p className="text-sm text-yellow-800">
                          该策略在极端市场条件下可能面临较大损失，建议根据个人风险承受能力谨慎选择。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>风险分散度分析</CardTitle>
                  <CardDescription>资产配置的风险分散效果评估</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">资产类别分散</span>
                      </div>
                      <p className="text-xs text-green-700">
                        涵盖现金、债券、基金、股票四大类资产，有效分散单一资产风险
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">相关性控制</span>
                      </div>
                      <p className="text-xs text-blue-700">不同资产间相关性较低，能够在市场波动时提供保护</p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">流动性平衡</span>
                      </div>
                      <p className="text-xs text-purple-700">保持适当的现金比例，确保资金流动性需求</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">风险评级</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>综合风险评级</span>
                          <span className="font-medium">
                            {selectedStrategy === 0 ? "低风险" : selectedStrategy === 1 ? "中等风险" : "高风险"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedStrategy === 0
                                ? "bg-green-500"
                                : selectedStrategy === 1
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${((selectedStrategy + 1) / 3) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>情景分析</CardTitle>
                <CardDescription>在不同市场环境下的策略表现预测</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bull Market */}
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">牛市情景</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>预期收益率</span>
                        <span className="font-medium text-green-600">
                          {(strategies[selectedStrategy].expectedReturn * 1.5).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最大回撤</span>
                        <span className="font-medium text-red-600">
                          {(strategies[selectedStrategy].maxDrawdown * 0.6).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>胜率</span>
                        <span className="font-medium">85%</span>
                      </div>
                    </div>
                    <p className="text-xs text-green-700 mt-3">市场整体上涨，风险资产表现优异</p>
                  </div>

                  {/* Normal Market */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">正常情景</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>预期收益率</span>
                        <span className="font-medium text-blue-600">
                          {strategies[selectedStrategy].expectedReturn.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最大回撤</span>
                        <span className="font-medium text-red-600">{strategies[selectedStrategy].maxDrawdown}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>胜率</span>
                        <span className="font-medium">65%</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-3">市场正常波动，符合长期预期</p>
                  </div>

                  {/* Bear Market */}
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">熊市情景</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>预期收益率</span>
                        <span className="font-medium text-red-600">
                          {(strategies[selectedStrategy].expectedReturn * 0.3).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最大回撤</span>
                        <span className="font-medium text-red-600">
                          {(strategies[selectedStrategy].maxDrawdown * 1.8).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>胜率</span>
                        <span className="font-medium">35%</span>
                      </div>
                    </div>
                    <p className="text-xs text-red-700 mt-3">市场持续下跌，防御性资产相对抗跌</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">情景分析说明</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      • <strong>牛市情景</strong>：市场年化涨幅超过15%，持续时间2-3年
                    </p>
                    <p>
                      • <strong>正常情景</strong>：市场年化涨幅5-15%，正常波动周期
                    </p>
                    <p>
                      • <strong>熊市情景</strong>：市场年化跌幅超过10%，持续时间1-2年
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">基于模拟结果的建议</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-white/60 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">推荐策略</h4>
                    <p className="text-sm text-gray-600">
                      基于您的风险偏好和投资目标，推荐采用<strong>{strategies[selectedStrategy].name}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/60 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">注意事项</h4>
                    <p className="text-sm text-gray-600">历史表现不代表未来收益，请结合实际情况谨慎决策</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
                <Target className="w-5 h-5 mr-2" />
                采用此策略
              </Button>
              <Button variant="outline" size="lg">
                <Calculator className="w-5 h-5 mr-2" />
                自定义策略
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * 以上模拟结果均为系统生成，仅供参考，不构成投资建议。投资有风险，决策需谨慎。
          </p>
        </div>
      </div>
    </div>
  )
}
