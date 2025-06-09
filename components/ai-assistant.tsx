"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Brain,
  Send,
  Lightbulb,
  TrendingUp,
  Shield,
  BookOpen,
  MessageCircle,
  Sparkles,
  Target,
  Calculator,
} from "lucide-react"

const quickQuestions = [
  "如何优化我的资产配置？",
  "本月支出有什么异常？",
  "适合我的投资策略是什么？",
  "如何提高储蓄率？",
]

const chatHistory = [
  {
    type: "user",
    message: "我想了解一下我的投资风险等级",
    time: "14:30",
  },
  {
    type: "ai",
    message:
      '根据您的风险评估问卷和投资行为分析，您属于"稳健型"投资者。这意味着您：\n\n• 能承受适度的市场波动\n• 追求稳定的长期收益\n• 偏好风险可控的投资产品\n\n建议您的投资组合配置：\n- 60% 稳健型基金\n- 25% 债券类产品\n- 15% 高风险高收益产品',
    time: "14:31",
  },
  {
    type: "user",
    message: "那我现在的资产配置合理吗？",
    time: "14:32",
  },
  {
    type: "ai",
    message:
      "您当前的资产配置基本合理，但有优化空间：\n\n✅ 优势：\n• 现金储蓄充足，应急能力强\n• 投资品种较为分散\n\n⚠️ 建议优化：\n• 现金占比偏高(35%)，建议降至20-25%\n• 可增加债券类资产配置\n• 考虑定投方式平滑风险\n\n*以上建议仅供参考，不构成投资建议",
    time: "14:33",
  },
]

export function AIAssistant() {
  const [message, setMessage] = useState("")
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
                <CardTitle className="text-lg">AI 理财教练</CardTitle>
                <CardDescription>智能分析 • 个性化建议 • 24/7在线</CardDescription>
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
                <div className={`flex items-start gap-3 max-w-[80%] ${chat.type === "user" ? "flex-row-reverse" : ""}`}>
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
            <div className="mt-3 flex flex-wrap gap-2">
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
        </CardContent>
      </Card>

      {/* AI Features & Tools */}
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
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">投资分析</div>
                <div className="text-xs text-gray-600">个性化投资建议</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <Calculator className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">财务规划</div>
                <div className="text-xs text-gray-600">智能预算制定</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <Target className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm">目标追踪</div>
                <div className="text-xs text-gray-600">储蓄目标管理</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">理财教育</div>
                <div className="text-xs text-gray-600">个性化学习路径</div>
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

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Lightbulb className="w-4 h-4 mr-2" />
              生成投资建议书
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="w-4 h-4 mr-2" />
              财务健康体检
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="w-4 h-4 mr-2" />
              制定储蓄计划
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              风险评估测试
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
