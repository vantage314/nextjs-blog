"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Share2,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Calculator,
  BarChart3,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

const riskProfiles = [
  {
    type: "保守型",
    description: "追求资本保值，风险承受能力较低",
    allocation: { cash: 40, bond: 40, fund: 15, stock: 5 },
    expectedReturn: "4-6%",
    risk: "低",
    color: "bg-green-500",
  },
  {
    type: "稳健型",
    description: "平衡风险与收益，适度投资",
    allocation: { cash: 25, bond: 30, fund: 30, stock: 15 },
    expectedReturn: "6-8%",
    risk: "中低",
    color: "bg-blue-500",
  },
  {
    type: "积极型",
    description: "追求较高收益，能承受一定风险",
    allocation: { cash: 15, bond: 20, fund: 35, stock: 30 },
    expectedReturn: "8-12%",
    risk: "中高",
    color: "bg-purple-500",
  },
]

const suggestions = [
  {
    title: "现金管理优化",
    priority: "高",
    description: "将超额现金转入货币基金，提高资金利用效率",
    impact: "预计年化收益提升1.5-2%",
    timeframe: "立即执行",
    steps: ["选择优质货币基金产品", "保留3-6个月生活费作为应急资金", "设置自动转入机制"],
  },
  {
    title: "投资组合再平衡",
    priority: "中",
    description: "调整资产配置比例，降低单一资产风险",
    impact: "提高组合稳定性，降低波动率",
    timeframe: "1-2周内",
    steps: ["减少现金比例至25%", "增加债券类资产配置", "分批调仓，避免市场冲击"],
  },
  {
    title: "定投计划制定",
    priority: "中",
    description: "建立定期定额投资计划，平滑市场波动",
    impact: "长期稳定收益，降低择时风险",
    timeframe: "本月内启动",
    steps: ["选择优质指数基金", "设定每月投资金额", "建立自动扣款机制"],
  },
]

export default function SuggestionPage() {
  const [selectedProfile, setSelectedProfile] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">策略建议书</h1>
            <p className="text-gray-600">基于您的财务状况和风险偏好生成的个性化投资建议</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  重新生成
                </>
              )}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出PDF
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </div>

        {/* Risk Profile Selection */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              风险偏好评估
            </CardTitle>
            <CardDescription>选择符合您风险承受能力的投资策略类型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {riskProfiles.map((profile, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedProfile === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedProfile(index)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-4 h-4 ${profile.color} rounded-full`} />
                    <h3 className="font-semibold text-gray-900">{profile.type}</h3>
                    <Badge variant="outline">{profile.risk}风险</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{profile.description}</p>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>预期收益</span>
                      <span className="font-medium text-green-600">{profile.expectedReturn}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      现金{profile.allocation.cash}% • 债券{profile.allocation.bond}% • 基金{profile.allocation.fund}% •
                      股票{profile.allocation.stock}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="recommendations">核心建议</TabsTrigger>
            <TabsTrigger value="allocation">资产配置</TabsTrigger>
            <TabsTrigger value="products">产品推荐</TabsTrigger>
            <TabsTrigger value="timeline">执行计划</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-6">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          {suggestion.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{suggestion.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          suggestion.priority === "高"
                            ? "destructive"
                            : suggestion.priority === "中"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {suggestion.priority}优先级
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm font-medium text-green-900 mb-1">预期影响</div>
                        <div className="text-sm text-green-700">{suggestion.impact}</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">执行时间</div>
                        <div className="text-sm text-blue-700">{suggestion.timeframe}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">执行步骤</h4>
                      <div className="space-y-2">
                        {suggestion.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">{stepIndex + 1}</span>
                            </div>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        立即执行
                      </Button>
                      <Button size="sm" variant="outline">
                        了解详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current vs Recommended */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>当前配置 vs 建议配置</CardTitle>
                  <CardDescription>基于{riskProfiles[selectedProfile].type}策略的配置对比</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">当前配置</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">现金储蓄</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">基金投资</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">股票投资</span>
                        <span className="text-sm font-medium">22%</span>
                      </div>
                      <Progress value={22} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">其他投资</span>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">建议配置</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">现金储蓄</span>
                        <span className="text-sm font-medium">{riskProfiles[selectedProfile].allocation.cash}%</span>
                      </div>
                      <Progress value={riskProfiles[selectedProfile].allocation.cash} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">债券基金</span>
                        <span className="text-sm font-medium">{riskProfiles[selectedProfile].allocation.bond}%</span>
                      </div>
                      <Progress value={riskProfiles[selectedProfile].allocation.bond} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">股票基金</span>
                        <span className="text-sm font-medium">{riskProfiles[selectedProfile].allocation.fund}%</span>
                      </div>
                      <Progress value={riskProfiles[selectedProfile].allocation.fund} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">个股投资</span>
                        <span className="text-sm font-medium">{riskProfiles[selectedProfile].allocation.stock}%</span>
                      </div>
                      <Progress value={riskProfiles[selectedProfile].allocation.stock} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adjustment Plan */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-900">调整方案</CardTitle>
                  <CardDescription className="text-blue-700">从当前配置调整到建议配置的具体步骤</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">减少现金比例</h4>
                        <p className="text-sm text-gray-600">
                          将现金从35%降至{riskProfiles[selectedProfile].allocation.cash}%， 释放约¥12,800资金
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">增加债券配置</h4>
                        <p className="text-sm text-gray-600">
                          新增{riskProfiles[selectedProfile].allocation.bond}%债券类资产， 提高组合稳定性
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">优化基金配置</h4>
                        <p className="text-sm text-gray-600">
                          调整基金配置至{riskProfiles[selectedProfile].allocation.fund}%， 重点关注指数基金
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    查看详细调仓计划
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>推荐产品清单</CardTitle>
                <CardDescription>基于您的风险偏好和投资目标筛选的优质产品</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Cash Management */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">现金管理类</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">余额宝</h4>
                            <p className="text-sm text-gray-600">天弘基金</p>
                          </div>
                          <Badge variant="default">推荐</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>7日年化收益率</span>
                            <span className="font-medium text-green-600">2.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>风险等级</span>
                            <span>低风险</span>
                          </div>
                          <div className="flex justify-between">
                            <span>起购金额</span>
                            <span>¥1</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">微信零钱通</h4>
                            <p className="text-sm text-gray-600">多家基金公司</p>
                          </div>
                          <Badge variant="secondary">备选</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>7日年化收益率</span>
                            <span className="font-medium text-green-600">2.0%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>风险等级</span>
                            <span>低风险</span>
                          </div>
                          <div className="flex justify-between">
                            <span>起购金额</span>
                            <span>¥1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bond Funds */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">债券基金类</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">易方达稳健收益债券A</h4>
                            <p className="text-sm text-gray-600">易方达基金</p>
                          </div>
                          <Badge variant="default">推荐</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>近一年收益率</span>
                            <span className="font-medium text-green-600">4.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>风险等级</span>
                            <span>中低风险</span>
                          </div>
                          <div className="flex justify-between">
                            <span>管理费率</span>
                            <span>0.7%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">博时信用债券A</h4>
                            <p className="text-sm text-gray-600">博时基金</p>
                          </div>
                          <Badge variant="secondary">备选</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>近一年收益率</span>
                            <span className="font-medium text-green-600">3.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>风险等级</span>
                            <span>中低风险</span>
                          </div>
                          <div className="flex justify-between">
                            <span>管理费率</span>
                            <span>0.8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equity Funds */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">股票基金类</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">华夏沪深300ETF联接A</h4>
                            <p className="text-sm text-gray-600">华夏基金</p>
                          </div>
                          <Badge variant="default">推荐</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>近一年收益率</span>
                            <span className="font-medium text-green-600">8.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>风险等级</span>
                            <span>中高风险</span>
                          </div>
                          <div className="flex justify-between">
                            <span>管理费率</span>
                            <span>0.5%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">易方达中小盘混合</h4>
                            <p className="text-sm text-gray-600">易方达基金</p>
                          </div>
                          <Badge variant="secondary">备选</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>近一年收益率</span>
                            <span className="font-medium text-green-600">12.3%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>风险等级</span>
                            <span>高风险</span>
                          </div>
                          <div className="flex justify-between">
                            <span>管理费率</span>
                            <span>1.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  执行时间表
                </CardTitle>
                <CardDescription>分阶段实施投资策略，降低市场冲击风险</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Phase 1 */}
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">第一阶段：现金管理优化</h3>
                        <p className="text-sm text-gray-600">时间：立即执行（1-3天）</p>
                      </div>
                    </div>
                    <div className="ml-14 space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">开通货币基金账户</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">转入超额现金¥8,000</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">设置自动转入机制</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">第二阶段：债券配置建立</h3>
                        <p className="text-sm text-gray-600">时间：1-2周内</p>
                      </div>
                    </div>
                    <div className="ml-14 space-y-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">研究并选择债券基金</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">分批投入¥15,000至债券基金</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">建立定期观察机制</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">第三阶段：股票基金定投</h3>
                        <p className="text-sm text-gray-600">时间：第3-4周</p>
                      </div>
                    </div>
                    <div className="ml-14 space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">启动指数基金定投计划</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">设定每月¥2,000定投金额</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">建立长期跟踪机制</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">第四阶段：组合优化调整</h3>
                        <p className="text-sm text-gray-600">时间：第2个月开始</p>
                      </div>
                    </div>
                    <div className="ml-14 space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">定期评估组合表现</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">根据市场情况微调配置</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">建立季度再平衡机制</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">执行提醒</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 分批执行可以降低市场时点风险</li>
                    <li>• 建议在市场相对稳定时期进行调仓</li>
                    <li>• 保持长期投资心态，避免频繁操作</li>
                    <li>• 定期回顾和调整投资策略</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">下一步行动</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/strategy">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">策略模拟</h3>
                    <p className="text-sm text-gray-600">模拟不同策略的历史表现</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/assistant">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Lightbulb className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">咨询AI助手</h3>
                    <p className="text-sm text-gray-600">获得更多专业建议</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/education">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">学习理财知识</h3>
                    <p className="text-sm text-gray-600">提升投资理财能力</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * 以上建议均为系统生成，仅供参考，不构成投资建议。投资有风险，决策需谨慎。
          </p>
        </div>
      </div>
    </div>
  )
}
