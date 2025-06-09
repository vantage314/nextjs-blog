"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { PenTool, Calendar, Heart, TrendingUp, Smile, Search, Plus, BookOpen, Target, Star } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

// Mock数据
const diaryEntries = [
  {
    id: 1,
    date: "2024-12-07",
    title: "首次基金投资心得",
    content:
      "今天终于迈出了投资的第一步，购买了华夏沪深300ETF联接A。虽然只投入了5000元，但心情还是有些紧张和兴奋。通过之前在理财学院的学习，我了解到指数基金是比较适合新手的投资工具，风险相对较低，长期收益也比较稳定。希望这是我理财路上的一个好开始。",
    mood: "excited",
    tags: ["首次投资", "基金", "学习成果"],
    amount: 5000,
    category: "投资心得",
    weather: "sunny",
  },
  {
    id: 2,
    date: "2024-12-05",
    title: "完成理财课程的感悟",
    content:
      "今天完成了理财学院的基础课程，感觉收获很大。特别是关于复利效应的讲解，让我深刻理解了时间在投资中的重要性。爱因斯坦说复利是世界第八大奇迹，现在我终于明白了这句话的含义。决定从现在开始，每月定投2000元，坚持长期投资。",
    mood: "happy",
    tags: ["学习", "复利", "定投计划"],
    category: "学习心得",
    weather: "cloudy",
  },
  {
    id: 3,
    date: "2024-12-03",
    title: "看到财务分析报告的震撼",
    content:
      "今天第一次看到系统生成的财务分析报告，真的很震撼。原来我的支出结构有这么多问题，娱乐消费占比过高，而投资几乎为零。报告中的建议很中肯，让我意识到理财不仅仅是投资，更重要的是要先管理好自己的现金流。决定从下个月开始严格控制支出，增加储蓄率。",
    mood: "thoughtful",
    tags: ["财务分析", "支出管理", "反思"],
    category: "分析感悟",
    weather: "rainy",
  },
  {
    id: 4,
    date: "2024-12-01",
    title: "设定理财目标的兴奋",
    content:
      "今天设定了人生第一个正式的理财目标：年化收益8%。虽然听起来不高，但对于刚开始理财的我来说，这是一个既有挑战性又相对现实的目标。通过AI助手的分析，了解到要实现这个目标需要合理的资产配置和长期坚持。感觉自己终于有了明确的方向。",
    mood: "excited",
    tags: ["目标设定", "年化收益", "规划"],
    category: "目标规划",
    weather: "sunny",
  },
]

const moodOptions = [
  { value: "excited", label: "兴奋", icon: "😄", color: "text-yellow-600" },
  { value: "happy", label: "开心", icon: "😊", color: "text-green-600" },
  { value: "thoughtful", label: "深思", icon: "🤔", color: "text-blue-600" },
  { value: "worried", label: "担心", icon: "😟", color: "text-orange-600" },
  { value: "sad", label: "沮丧", icon: "😢", color: "text-red-600" },
  { value: "neutral", label: "平静", icon: "😐", color: "text-gray-600" },
]

const categories = ["全部", "投资心得", "学习心得", "分析感悟", "目标规划", "市场观察", "其他"]

const moodStats = [
  { mood: "excited", count: 2, percentage: 50 },
  { mood: "happy", count: 1, percentage: 25 },
  { mood: "thoughtful", count: 1, percentage: 25 },
]

export default function DiaryPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [isWriting, setIsWriting] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
    tags: "",
    category: "投资心得",
    amount: "",
  })

  const filteredEntries = diaryEntries.filter((entry) => {
    const matchesCategory = selectedCategory === "全部" || entry.category === selectedCategory
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getMoodIcon = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.value === mood)
    return moodOption ? moodOption.icon : "😐"
  }

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.value === mood)
    return moodOption ? moodOption.color : "text-gray-600"
  }

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      // 保存日记逻辑
      console.log("Saving entry:", newEntry)
      setIsWriting(false)
      setNewEntry({
        title: "",
        content: "",
        mood: "neutral",
        tags: "",
        category: "投资心得",
        amount: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">理财日记</h1>
            <p className="text-gray-600">记录理财心路历程，分享投资感悟与成长</p>
          </div>
          <Button onClick={() => setIsWriting(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            写日记
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总日记数</p>
                  <p className="text-2xl font-bold text-gray-900">{diaryEntries.length}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    本月+4
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <PenTool className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">写作天数</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    连续
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">主要心情</p>
                  <p className="text-2xl font-bold text-gray-900">😄</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Heart className="w-3 h-3 mr-1" />
                    兴奋
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Heart className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均字数</p>
                  <p className="text-2xl font-bold text-gray-900">285</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    字/篇
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Writing Modal */}
        {isWriting && (
          <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                写新日记
              </CardTitle>
              <CardDescription>记录您的理财心得和感悟</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    placeholder="今天的理财感悟..."
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">分类</Label>
                  <select
                    id="category"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  placeholder="分享您的理财心得、投资感悟或学习体会..."
                  rows={6}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mood">心情</Label>
                  <select
                    id="mood"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                  >
                    {moodOptions.map((mood) => (
                      <option key={mood.value} value={mood.value}>
                        {mood.icon} {mood.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tags">标签</Label>
                  <Input
                    id="tags"
                    placeholder="用逗号分隔，如：投资,学习"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">相关金额（可选）</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveEntry} className="bg-blue-600 hover:bg-blue-700">
                  保存日记
                </Button>
                <Button variant="outline" onClick={() => setIsWriting(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="entries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="entries">日记列表</TabsTrigger>
            <TabsTrigger value="mood">心情统计</TabsTrigger>
            <TabsTrigger value="insights">智能洞察</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="搜索日记内容..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diary Entries */}
            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getMoodIcon(entry.mood)}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{entry.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{entry.date}</span>
                            <Badge variant="outline">{entry.category}</Badge>
                          </div>
                        </div>
                      </div>
                      {entry.amount && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">¥{entry.amount.toLocaleString()}</div>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">{entry.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={getMoodColor(entry.mood)}>
                          {moodOptions.find((m) => m.value === entry.mood)?.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mood" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>心情分布</CardTitle>
                  <CardDescription>您在理财过程中的情绪变化</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodStats.map((stat) => {
                      const moodOption = moodOptions.find((m) => m.value === stat.mood)
                      return (
                        <div key={stat.mood} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{moodOption?.icon}</span>
                              <span className="text-sm font-medium">{moodOption?.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{stat.count}次</span>
                              <span className="text-sm font-semibold">{stat.percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-900">情绪分析</CardTitle>
                  <CardDescription className="text-green-700">基于您的日记内容分析</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Smile className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">积极情绪占主导</h4>
                        <p className="text-sm text-gray-600">
                          您的理财日记中75%都是积极情绪，说明理财给您带来了正面的体验。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">学习热情高涨</h4>
                        <p className="text-sm text-gray-600">
                          从日记内容看，您对理财学习充满热情，这是成功的重要因素。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">目标导向明确</h4>
                        <p className="text-sm text-gray-600">您的日记显示出明确的目标导向，这有助于长期理财成功。</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>智能洞察</CardTitle>
                <CardDescription>基于您的日记内容生成的个性化分析</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-2">学习成长轨迹</h4>
                    <p className="text-sm text-blue-800">
                      从您的日记可以看出，您正在经历一个完整的理财学习过程：从基础知识学习到实际投资操作，成长轨迹清晰。
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900 mb-2">投资心态健康</h4>
                    <p className="text-sm text-green-800">
                      您的投资心态相对理性，能够从学习中获得信心，同时保持谨慎态度，这是很好的投资品质。
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900 mb-2">反思能力强</h4>
                    <p className="text-sm text-purple-800">
                      您善于通过分析报告进行自我反思，能够发现问题并制定改进计划，这是持续进步的关键。
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-900 mb-2">目标设定合理</h4>
                    <p className="text-sm text-yellow-800">
                      您设定的理财目标既有挑战性又相对现实，这种平衡的目标设定有助于长期坚持。
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">个性化建议</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span>继续保持写日记的习惯，记录投资过程中的心得体会</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span>可以尝试记录更多的市场观察和分析，提升投资敏感度</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span>建议定期回顾之前的日记，总结经验教训</span>
                    </li>
                  </ul>
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
              <Link href="/timeline">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">成长时间轴</h3>
                    <p className="text-sm text-gray-600">查看理财成长历程</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/coach">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">AI教练</h3>
                    <p className="text-sm text-gray-600">获得专业指导建议</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/education">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">理财学院</h3>
                    <p className="text-sm text-gray-600">继续学习提升</p>
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
