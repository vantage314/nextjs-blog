"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Plus,
  Settings,
  MessageCircle,
  Calendar,
  PieChart,
  Award,
  Heart,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const familyMembers = [
  {
    id: 1,
    name: "张先生",
    role: "主账户",
    avatar: "/placeholder.svg?height=40&width=40",
    contribution: 65,
    savings: 45000,
    investments: 32000,
    isOnline: true,
    joinDate: "2024-11-25",
  },
  {
    id: 2,
    name: "李女士",
    role: "配偶",
    avatar: "/placeholder.svg?height=40&width=40",
    contribution: 35,
    savings: 28000,
    investments: 18000,
    isOnline: false,
    joinDate: "2024-12-01",
  },
]

const familyGoals = [
  {
    id: 1,
    title: "购房首付",
    target: 500000,
    current: 180000,
    deadline: "2025-12-31",
    priority: "高",
    contributors: ["张先生", "李女士"],
    monthlyTarget: 15000,
  },
  {
    id: 2,
    title: "子女教育基金",
    target: 200000,
    current: 45000,
    deadline: "2030-09-01",
    priority: "中",
    contributors: ["张先生", "李女士"],
    monthlyTarget: 3000,
  },
  {
    id: 3,
    title: "应急基金",
    target: 60000,
    current: 48000,
    deadline: "2024-12-31",
    priority: "高",
    contributors: ["张先生"],
    monthlyTarget: 2000,
  },
]

const recentActivities = [
  {
    id: 1,
    user: "张先生",
    action: "投资基金",
    amount: 5000,
    time: "2小时前",
    type: "investment",
  },
  {
    id: 2,
    user: "李女士",
    action: "储蓄存款",
    amount: 3000,
    time: "1天前",
    type: "saving",
  },
  {
    id: 3,
    user: "张先生",
    action: "设定目标",
    description: "更新购房首付目标",
    time: "2天前",
    type: "goal",
  },
  {
    id: 4,
    user: "李女士",
    action: "完成学习",
    description: "完成理财基础课程",
    time: "3天前",
    type: "learning",
  },
]

const monthlyBudget = [
  { category: "生活费用", budget: 8000, spent: 6500, responsible: "共同" },
  { category: "房贷还款", budget: 4500, spent: 4500, responsible: "张先生" },
  { category: "子女支出", budget: 2000, spent: 1800, responsible: "李女士" },
  { category: "投资储蓄", budget: 8000, spent: 8000, responsible: "共同" },
  { category: "娱乐休闲", budget: 1500, spent: 1200, responsible: "共同" },
]

export default function FamilyPage() {
  const [selectedMember, setSelectedMember] = useState(0)

  const totalSavings = familyMembers.reduce((sum, member) => sum + member.savings, 0)
  const totalInvestments = familyMembers.reduce((sum, member) => sum + member.investments, 0)
  const totalAssets = totalSavings + totalInvestments

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "saving":
        return <DollarSign className="w-4 h-4 text-blue-600" />
      case "goal":
        return <Target className="w-4 h-4 text-purple-600" />
      case "learning":
        return <Award className="w-4 h-4 text-yellow-600" />
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">家庭共理</h1>
            <p className="text-gray-600">与家人一起规划财务，共同实现理财目标</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              邀请成员
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              家庭设置
            </Button>
          </div>
        </div>

        {/* Family Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">家庭总资产</p>
                  <p className="text-2xl font-bold text-gray-900">¥{totalAssets.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-gray-600">家庭成员</p>
                  <p className="text-2xl font-bold text-gray-900">{familyMembers.length}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    活跃用户
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">共同目标</p>
                  <p className="text-2xl font-bold text-gray-900">{familyGoals.length}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Target className="w-3 h-3 mr-1" />
                    进行中
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">本月储蓄</p>
                  <p className="text-2xl font-bold text-gray-900">¥12,500</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Heart className="w-3 h-3 mr-1" />
                    超额完成
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Heart className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">家庭概览</TabsTrigger>
            <TabsTrigger value="goals">共同目标</TabsTrigger>
            <TabsTrigger value="budget">预算管理</TabsTrigger>
            <TabsTrigger value="activities">动态记录</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Family Members */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>家庭成员</CardTitle>
                  <CardDescription>查看每位成员的财务贡献和状态</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {familyMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedMember === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedMember(index)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                              {member.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant={member.role === "主账户" ? "default" : "secondary"}>
                            {member.role}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">储蓄:</span>
                            <span className="font-medium ml-2">¥{member.savings.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">投资:</span>
                            <span className="font-medium ml-2">¥{member.investments.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>贡献占比</span>
                            <span>{member.contribution}%</span>
                          </div>
                          <Progress value={member.contribution} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Member Detail */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-900">成员详情</CardTitle>
                  <CardDescription className="text-blue-700">
                    {familyMembers[selectedMember]?.name} 的财务状况
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={familyMembers[selectedMember]?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {familyMembers[selectedMember]?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-blue-900">{familyMembers[selectedMember]?.name}</h3>
                    <p className="text-sm text-blue-700">{familyMembers[selectedMember]?.role}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white/60 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">总资产</span>
                        <span className="font-bold text-blue-900">
                          ¥{((familyMembers[selectedMember]?.savings || 0) + (familyMembers[selectedMember]?.investments || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/60 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">储蓄金额</span>
                        <span className="font-bold text-green-600">
                          ¥{familyMembers[selectedMember]?.savings.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/60 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">投资金额</span>
                        <span className="font-bold text-purple-600">
                          ¥{familyMembers[selectedMember]?.investments.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/60 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">加入时间</span>
                        <span className="text-sm text-blue-700">
                          {familyMembers[selectedMember]?.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    发送消息
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>家庭理财目标</CardTitle>
                    <CardDescription>与家人共同设定和追踪理财目标</CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    新增目标
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {familyGoals.map((goal) => (
                    <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={goal.priority === "高" ? "destructive" : "default"}>
                              {goal.priority}优先级
                            </Badge>
                            <span className="text-sm text-gray-600">截止：{goal.deadline}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ¥{goal.current.toLocaleString()} / ¥{goal.target.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.round((goal.current / goal.target) * 100)}% 完成
                          </div>
                        </div>
                      </div>

                      <Progress value={(goal.current / goal.target) * 100} className="mb-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">月度目标:</span>
                          <span className="font-medium ml-2">¥{goal.monthlyTarget.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">参与成员:</span>
                          <span className="ml-2">{goal.contributors.join(", ")}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <DollarSign className="w-4 h-4 mr-2" />
                          存入资金
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          编辑目标
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>家庭预算管理</CardTitle>
                <CardDescription>本月家庭收支预算执行情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyBudget.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.category}</h3>
                          <p className="text-sm text-gray-600">负责人：{item.responsible}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ¥{item.spent.toLocaleString()} / ¥{item.budget.toLocaleString()}
                          </div>
                          <div className={`text-sm ${item.spent <= item.budget ? "text-green-600" : "text-red-600"}`}>
                            {item.spent <= item.budget ? "预算内" : "超预算"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>执行进度</span>
                          <span>{Math.round((item.spent / item.budget) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(item.spent / item.budget) * 100} 
                          className={`h-2 ${item.spent > item.budget ? "bg-red-100" : ""}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">预算总结</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">总预算:</span>
                      <span className="font-medium ml-2">¥{monthlyBudget.reduce((sum, item) => sum + item.budget, 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">已支出:</span>
                      <span className="font-medium ml-2">¥{monthlyBudget.reduce((sum, item) => sum + item.spent, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>家庭动态</CardTitle>
                <CardDescription>家庭成员的最近理财活动记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{activity.user}</h3>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {activity.action}
                          {activity.amount && (
                            <span className="font-medium text-green-600 ml-1">
                              ¥{activity.amount.toLocaleString()}
                            </span>
                          )}
                          {activity.description && (
                            <span className="text-gray-600 ml-1">- {activity.description}</span>
                          )}
                        </p>
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
              <Link href="/analysis">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <PieChart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">财务分析</h3>
                    <p className="text-sm text-gray-600">查看家庭财务状况</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/suggestion">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent\
