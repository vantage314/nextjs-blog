"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  ArrowRight,
  Shield,
  Camera,
  Smartphone,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

const uploadedFiles = [
  { name: "招商银行_202312.pdf", size: "2.3MB", status: "已处理", type: "银行账单" },
  { name: "支付宝账单_202312.csv", size: "1.8MB", status: "处理中", type: "第三方支付" },
  { name: "信用卡账单_202312.pdf", size: "1.2MB", status: "已处理", type: "信用卡" },
]

const manualEntries = [
  { category: "工资收入", amount: 12000, date: "2024-12-01", type: "收入" },
  { category: "房租支出", amount: 3500, date: "2024-12-01", type: "支出" },
  { category: "投资收益", amount: 800, date: "2024-12-05", type: "收入" },
]

export default function ImportBillPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [newEntry, setNewEntry] = useState({
    category: "",
    amount: "",
    date: "",
    type: "支出",
    description: "",
  })

  const handleFileUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleAddEntry = () => {
    if (newEntry.category && newEntry.amount && newEntry.date) {
      // Add entry logic here
      setNewEntry({
        category: "",
        amount: "",
        date: "",
        type: "支出",
        description: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据导入</h1>
          <p className="text-gray-600">上传您的银行账单或手动录入财务数据，开始您的理财分析之旅</p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">数据导入进度</h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                第1步 / 共4步
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-sm font-medium text-blue-900">数据导入</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-bold">2</span>
                </div>
                <span className="text-sm text-gray-500">数据分析</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-bold">3</span>
                </div>
                <span className="text-sm text-gray-500">生成建议</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-bold">4</span>
                </div>
                <span className="text-sm text-gray-500">开始使用</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="upload">文件上传</TabsTrigger>
            <TabsTrigger value="manual">手动录入</TabsTrigger>
            <TabsTrigger value="review">数据预览</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    文件上传
                  </CardTitle>
                  <CardDescription>支持银行账单、信用卡账单、第三方支付账单等格式</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">拖拽文件到此处或点击上传</p>
                    <p className="text-sm text-gray-500 mb-4">支持 PDF、CSV、XLS、XLSX 格式</p>
                    <Button onClick={handleFileUpload} disabled={isUploading}>
                      {isUploading ? "上传中..." : "选择文件"}
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>上传进度</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      拍照上传
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      扫码导入
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upload History */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    已上传文件
                  </CardTitle>
                  <CardDescription>查看和管理您上传的财务数据文件</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {file.size} • {file.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={file.status === "已处理" ? "default" : "secondary"} className="text-xs">
                            {file.status === "已处理" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {file.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supported Formats */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">支持的数据源</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-sm font-medium">银行账单</div>
                    <div className="text-xs text-gray-500">工商、建行、招行等</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium">信用卡账单</div>
                    <div className="text-xs text-gray-500">各大银行信用卡</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-sm font-medium">第三方支付</div>
                    <div className="text-xs text-gray-500">支付宝、微信等</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-sm font-medium">投资账户</div>
                    <div className="text-xs text-gray-500">券商、基金等</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Entry Form */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    手动录入
                  </CardTitle>
                  <CardDescription>手动添加收入、支出或投资记录</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">类别</Label>
                      <Input
                        id="category"
                        placeholder="如：工资、房租、餐饮等"
                        value={newEntry.category}
                        onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">金额</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newEntry.amount}
                        onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">日期</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEntry.date}
                        onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">类型</Label>
                      <select
                        id="type"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newEntry.type}
                        onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                      >
                        <option value="收入">收入</option>
                        <option value="支出">支出</option>
                        <option value="投资">投资</option>
                        <option value="转账">转账</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">备注（可选）</Label>
                    <Textarea
                      id="description"
                      placeholder="添加详细说明..."
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddEntry} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    添加记录
                  </Button>
                </CardContent>
              </Card>

              {/* Manual Entries List */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>已录入记录</CardTitle>
                  <CardDescription>查看和编辑手动录入的财务记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {manualEntries.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{entry.category}</div>
                          <div className="text-xs text-gray-500">{entry.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={entry.type === "收入" ? "default" : "secondary"}>{entry.type}</Badge>
                          <div className={`font-semibold ${entry.type === "收入" ? "text-green-600" : "text-red-600"}`}>
                            {entry.type === "收入" ? "+" : "-"}¥{entry.amount.toLocaleString()}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>数据预览与确认</CardTitle>
                <CardDescription>请确认导入的数据准确无误，系统将基于这些数据进行分析</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">¥24,800</div>
                    <div className="text-sm text-green-700">总收入</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">¥18,240</div>
                    <div className="text-sm text-red-700">总支出</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">¥6,560</div>
                    <div className="text-sm text-blue-700">净储蓄</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-purple-700">交易笔数</div>
                  </div>
                </div>

                {/* Data Quality Check */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">数据质量检查</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">数据格式验证通过</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">交易分类识别完成</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">重复交易检测通过</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">发现3笔异常交易，请确认</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    返回修改
                  </Button>
                  <Link href="/analysis" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      确认并开始分析
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-amber-600 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">数据安全保障</h3>
                <div className="text-sm text-amber-800 space-y-1">
                  <p>• 所有数据均采用银行级加密存储，确保您的隐私安全</p>
                  <p>• 系统不会保存您的银行密码或敏感认证信息</p>
                  <p>• 您可以随时删除所有数据，我们承诺完全清除</p>
                  <p>• 数据仅用于个人理财分析，不会用于其他商业目的</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">* 本平台提供的所有分析结果均为系统生成，仅供参考，不构成投资建议。</p>
        </div>
      </div>
    </div>
  )
}
