"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Send,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Calculator,
  Shield,
  Clock,
  Star,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

const quickQuestions = [
  "如何优化我的资产配置？",
  "本月支出有什么异常？",
  "适合我的投资策略是什么？",
  "如何提高储蓄率？",
  "什么是复利效应？",
  "如何选择基金产品？",
]

const knowledgeCards = [
  {
    term: "复利效应",
    definition: "投资收益再投资产生的收益，随时间呈指数级增长",
    example: "每年10%收益率，10年后1万元变成2.59万元",
    category: "基础概念",
    difficulty: "初级",
    rating: 4.8,
  },
  {
    term: "资产配置",
    definition: "将投资资金分散到不同类型的资产中以降低风险",
    example: "60%股票 + 30%债券 + 10%现金的经典配置",
    category: "投资策略",
    difficulty: "中级",
    rating: 4.6,
  },
  {
    term: "夏普比率",
    definition: "衡量投资组合风险调整后收益的指标",
    example: "比率越高说明单位风险获得的超额收益越多",
    category: "风险指标",
    difficulty: "高级",
    rating: 4.3,
  },
  {
    term: "定投策略",
    definition: "定期定额投资，通过时间分散降低市场波动影响",
    example: "每月投资1000元基金，不论市场涨跌",
    category: "投资方法",
    difficulty: "初级",
    rating: 4.9,
  },
]

const chatHistory = [
  {
    type: "ai",
    message: "您好！我是您的专属AI理财助手，很高兴为您服务。我可以帮您解答理财问题、分析财务状况、推荐投资策略等。请问有什么可以帮助您的吗？",
    time: "14:28",
  },
  {
    type: "user",
    message: "我想了解一下我的投资风险等级",
    time: "14:30",
  },
  {
    type: "ai",
    message: "根据您的风险评估问卷和投资行为分析，您属于"稳健型"投资者。这意味着您：\n\n• 能承受适度的市场波动\n• 追求稳定的长期收益\n• 偏好风险可控的投资产品\n\n建议您的投资组合配置：\n- 60% 稳健型基金\n- 25% 债券类产品\n- 15% 高风险高收益产品\n\n*以上建议仅供参考，不构成投资建议",
    time: "14:31",
  },
  {
    type: "user",
    message: "那我现在的资产配置合理吗？",
    time: "14:32",
  },
  {
    type: "ai",
    message: "您当前的资产配置基本合理，但有优化空间：\n\n✅ 优势：\n• 现金储蓄充足，应急能力强\n• 投资品种较为分散\n\n⚠️ 建议优化：\n• 现金占比偏高(35%)，建议降至20-25%\n• 可增加债券类资产配置\n• 考虑定投方式平滑风险\n\n*以上建议仅供参考，不构成投资建议",
    time: "14:33",
  },
]

const aiCapabilities = [
  {
    icon: TrendingUp,
    title: "投资分析",
    description: "分析市场趋势，提供投资建议",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Calculator,
    title: "财务规划",\
    description: "制定个性化财务计划",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: BookOpen,
    title: "理财教育",
    description: "解答理财知识问题",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Shield,
    title: "风险评估",
    description: "评估投资风险等级",
    color: \"text-orange-600",
    bgColor: "bg-orange-100",
  },
]

export default function AssistantPage() {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedCard, setSelectedCard] = useState(0)

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI理财助手</h1>
          <p className="text-gray-600">\ 智能问答 • 专业建议 • 24/7在线服务</p>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="chat">智能问答</TabsTrigger>
            <TabsTrigger value="knowledge">知识卡片</TabsTrigger>
            <TabsTrigger value="tools\">实用工具</TabsTrigger>\
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">AI理财助手</CardTitle>
                        <CardDescription>智能分析 • 个性化建议 • 专业可靠</CardDescription>
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
                              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
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
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <Brain className="w-4 h-4 text-white" />
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
                        placeholder="输入您的理财问题..."
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
                        {quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setMessage(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Features & Compliance */}
              <div className="space-y-6">
                {/* AI Capabilities */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Sparkles className="w-5 h-5" />
                      AI 能力
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiCapabilities.map((capability, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                        <div className={`p-2 ${capability.bgColor} rounded-lg`}>
                          <capability.icon className={`w-4 h-4 ${capability.color}`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{capability.title}</div>
                          <div className="text-xs text-gray-600">{capability.description}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">使用统计</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">今日咨询次数</span>
                      <span className="font-semibold">12次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">累计咨询次数</span>
                      <span className="font-semibold">156次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">满意度评分</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">4.8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Notice */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900">
                      <Shield className="w-5 h-5" />
                      合规提醒
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-800 space-y-2">
                    <p>• AI建议仅供参考，不构成投资建议</p>
                    <p>• 投资有风险，决策需谨慎</p>
                    <p>• 平台不承担投资损失责任</p>
                    <p>• 所有数据均经用户授权使用</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
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
                          selectedCard === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedCard(index)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{card.term}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {card.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{card.rating}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{card.category}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{knowledgeCards[selectedCard].term}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-700">{knowledgeCards[selectedCard].category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{knowledgeCards[selectedCard].rating}</span>
                        </div>
                      </div>
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
                        <Lightbulb className="w-4 h-4 mr-2" />
                        已掌握
                      </Button>
                      <Button size="sm" variant="outline">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        需复习
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Financial Calculator */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calculator className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">理财计算器</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">计算复利收益、贷款还款、投资回报等</p>
                  <Button size="sm" className="w-full">
                    立即使用
                  </Button>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">风险评估</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">评估您的投资风险承受能力</p>
                  <Button size="sm" className="w-full">
                    开始评估
                  </Button>
                </CardContent>
              </Card>

              {/* Goal Planning */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">目标规划</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">制定个人财务目标和实现计划</p>
                  <Button size="sm" className="w-full">
                    制定计划
                  </Button>
                </CardContent>
              </Card>

              {/* Market Analysis */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">市场分析</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">获取最新的市场分析和投资机会</p>
                  <Button size="sm" className="w-full">
                    查看分析
                  </Button>
                </CardContent>
              </Card>

              {/* Learning Path */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-pink-100 rounded-full">
                      <BookOpen className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">学习路径</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">个性化的理财知识学习计划</p>
                  <Button size="sm" className="w-full">
                    开始学习
                  </Button>
                </CardContent>
              </Card>

              {/* Q&A History */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <MessageCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">问答历史</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">查看历史咨询记录和解答</p>
                  <Button size="sm" className="w-full">
                    查看历史
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">常用功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Lightbulb className="w-5 h-5" />
                <span className="text-sm">投资建议</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calculator className="w-5 h-5" />
                <span className="text-sm">收益计算</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">风险评估</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">定投规划</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * AI助手提供的所有建议均为系统生成，仅供参考，不构成投资建议。投资有风险，决策需谨慎。
          </p>
        </div>
      </div>
    </div>
  )
}
