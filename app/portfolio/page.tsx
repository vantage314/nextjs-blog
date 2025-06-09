"use client"

import { useState } from "react"
import { usePortfolioStore } from "@/lib/store/portfolio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils"
import { InvestmentForm } from "@/components/portfolio/InvestmentForm"
import { DeleteDialog } from "@/components/portfolio/DeleteDialog"
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"

export default function PortfolioPage() {
  const { investments, addInvestment, updateInvestment, deleteInvestment, getTotalInvestment, getTotalValue, getTotalReturn, getReturnRate } = usePortfolioStore()
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)

  const handleAdd = () => {
    setSelectedInvestment(null)
    setIsFormDialogOpen(true)
  }

  const handleEdit = (investment: Investment) => {
    setSelectedInvestment(investment)
    setIsFormDialogOpen(true)
  }

  const handleDelete = (investment: Investment) => {
    setSelectedInvestment(investment)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = (data: Omit<Investment, "id">) => {
    if (selectedInvestment) {
      updateInvestment(selectedInvestment.id, data)
    } else {
      addInvestment(data)
    }
    setIsFormDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedInvestment) {
      deleteInvestment(selectedInvestment.id)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总投资</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalInvestment())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">当前市值</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalValue())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收益</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalReturn())}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">收益率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(getReturnRate())}</div>
          </CardContent>
        </Card>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <PlusIcon className="h-4 w-4 mr-2" />
          新增投资
        </Button>
      </div>

      {/* 投资列表 */}
      <Card>
        <CardHeader>
          <CardTitle>投资列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>投资名称</TableHead>
                <TableHead>投资金额</TableHead>
                <TableHead>买入时间</TableHead>
                <TableHead>当前市值</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.name}</TableCell>
                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>{formatDate(investment.date)}</TableCell>
                  <TableCell>{formatCurrency(investment.currentValue)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(investment)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(investment)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增/编辑对话框 */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedInvestment ? "编辑投资" : "新增投资"}
            </DialogTitle>
          </DialogHeader>
          <InvestmentForm
            investment={selectedInvestment}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        investment={selectedInvestment}
      />
    </div>
  )
} 