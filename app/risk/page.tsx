"use client"

import { useState } from "react"
import { usePortfolioStore } from "@/lib/store/portfolio"
import { calculateRiskMetrics } from "@/lib/risk"
import { RiskMetricsCard } from "@/components/risk/RiskMetricsCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCwIcon } from "lucide-react"

export default function RiskPage() {
  const { investments } = usePortfolioStore()
  const [metrics, setMetrics] = useState(() => calculateRiskMetrics(investments))

  const handleRefresh = () => {
    setMetrics(calculateRiskMetrics(investments))
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">风险评估</h1>
        <Button onClick={handleRefresh}>
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          刷新评估
        </Button>
      </div>

      {/* 风险指标卡片 */}
      <RiskMetricsCard metrics={metrics} />

      {/* 风险说明 */}
      <Card>
        <CardHeader>
          <CardTitle>风险说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">风险等级说明</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>低风险：适合保守型投资者，波动较小，收益相对稳定</li>
              <li>中等风险：适合平衡型投资者，收益和风险较为均衡</li>
              <li>高风险：适合激进型投资者，波动较大，潜在收益较高</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">风险指标说明</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>波动率：反映投资组合收益率的波动程度，越低越好</li>
              <li>Beta系数：反映投资组合相对于市场的波动性，接近1较为理想</li>
              <li>Sharpe比率：反映风险调整后的收益，越高越好</li>
              <li>最大回撤：反映投资组合的最大亏损幅度，越低越好</li>
              <li>市场相关性：反映投资组合与市场的相关程度，越低越好</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">风险提示</h3>
            <p className="text-muted-foreground">
              本评估结果仅供参考，不构成投资建议。投资有风险，入市需谨慎。
              建议投资者根据自身风险承受能力，合理配置资产，分散投资风险。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 