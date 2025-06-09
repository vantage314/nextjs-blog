"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Upload,
  PieChart,
  FileText,
  Target,
  Brain,
  Radar,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

const quickActions = [
  {
    title: "导入账单",
    description: "上传银行账单或手动录入财务数据",
    icon: Upload,
    href: "/import-bill",
    color: "bg-blue-500",
    urgent: true,
  },
  {
    title: "财务分析",
    description: "查看详细的收支分析和资产配置",
    icon: PieChart,
    href: "/analysis",
    color: "bg-green-500",
    urgent: false,
  },
  {
    title: "AI理财助手",
    description: "获得个性化的理财建议和问答",
    icon: Brain,
    href: "/assistant",
    color: "bg-purple-500",
    urgent: false,
  },
  {
    title: "策略建议",
    description: "生成专属的投资策略建议书",
    icon: FileText,
    href: "/suggestion",
    color: "bg-orange-500",
    urgent: false,
  },
]

const allModules = [
  { name: "策略模拟器", href: "/strategy", icon: Target, description: "模拟不同投资策略的收益表现" },
  { name: "舆情雷达", href: "/radar", icon: Radar, description: "实时监控市场情绪和新闻动态" },
  { name: "市场温度", href: "/temperature", icon: TrendingUp, description: "查看行业热度和投资机会" },
  { name: "理财学院", href: "/education", icon: BookOpen, description: "系统学习理财知识和技能" },
  { name: "AI教练", href: "/coach", icon: MessageCircle, description: "一对一智能理财教练服务" },
  { name: "家庭共理", href: "/family", icon: Users, description: "与家人共同管理家庭财务" },
  { name: "理财日记", href: "/diary", icon: Calendar, description: "记录理财心得和投资感悟" },
  { name: "成长时间轴", href: "/timeline", icon: Clock, description: "追踪理财成长历程和成就" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">欢迎使用 FinCoach+</h1>
          <p className="text-xl text-gray-600 mb-6">智能理财分析平台，助您实现财务自由</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-4 h-4 mr-1" />
              数据安全保护
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <CheckCircle className="w-4 h-4 mr-1" />
              合规认证平台
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">快速开始</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${action.color} rounded-full group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      {action.urgent && <Badge className="bg-red-100 text-red-700">推荐</Badge>}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      立即开始
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* All Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">全部功能模块</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allModules.map((module, index) => (
              <Link key={index} href={module.href}>
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <module.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                      <h3 className="font-medium text-gray-900">{module.name}</h3>
                    </div>
                    <p className="text-xs text-gray-600">{module.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* User Journey Guide */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">推荐使用流程</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">导入数据</h3>
                <p className="text-sm text-gray-600">上传账单或录入财务信息</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">分析诊断</h3>
                <p className="text-sm text-gray-600">查看财务健康状况</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">获取建议</h3>
                <p className="text-sm text-gray-600">生成个性化策略方案</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">持续优化</h3>
                <p className="text-sm text-gray-600">跟踪执行效果</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/import-bill">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  开始我的理财之旅
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            * 本平台提供的所有建议均为系统生成，仅供参考，不构成投资建议。投资有风险，决策需谨慎。
          </p>
        </div>
      </div>
    </div>
  )
}
