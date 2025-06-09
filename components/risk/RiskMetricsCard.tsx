"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RiskMetrics } from "@/lib/risk"
import { cn } from "@/lib/utils"

interface RiskMetricsCardProps {
  metrics: RiskMetrics
}

export function RiskMetricsCard({ metrics }: RiskMetricsCardProps) {
  const getRiskLevelColor = (level: RiskMetrics["level"]) => {
    switch (level) {
      case "Low":
        return "text-green-500"
      case "Medium":
        return "text-yellow-500"
      case "High":
        return "text-red-500"
    }
  }

  const getProgressColor = (value: number, type: "positive" | "negative") => {
    if (type === "positive") {
      if (value >= 0.8) return "bg-green-500"
      if (value >= 0.5) return "bg-yellow-500"
      return "bg-red-500"
    } else {
      if (value <= 0.2) return "bg-green-500"
      if (value <= 0.5) return "bg-yellow-500"
      return "bg-red-500"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 风险等级 */}
      <Card>
        <CardHeader>
          <CardTitle>风险等级</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={cn(getRiskLevelColor(metrics.level))}>
              {metrics.level === "Low" && "低风险"}
              {metrics.level === "Medium" && "中等风险"}
              {metrics.level === "High" && "高风险"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 波动率 */}
      <Card>
        <CardHeader>
          <CardTitle>波动率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {(metrics.volatility * 100).toFixed(2)}%
            </div>
            <Progress
              value={metrics.volatility * 100}
              className={getProgressColor(metrics.volatility, "negative")}
            />
            <p className="text-sm text-muted-foreground">
              衡量投资组合收益率的波动程度
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Beta系数 */}
      <Card>
        <CardHeader>
          <CardTitle>Beta系数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {metrics.beta.toFixed(2)}
            </div>
            <Progress
              value={Math.min(metrics.beta * 50, 100)}
              className={getProgressColor(Math.abs(metrics.beta - 1), "negative")}
            />
            <p className="text-sm text-muted-foreground">
              衡量投资组合相对于市场的波动性
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sharpe比率 */}
      <Card>
        <CardHeader>
          <CardTitle>Sharpe比率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {metrics.sharpeRatio.toFixed(2)}
            </div>
            <Progress
              value={Math.min(metrics.sharpeRatio * 50, 100)}
              className={getProgressColor(metrics.sharpeRatio, "positive")}
            />
            <p className="text-sm text-muted-foreground">
              衡量投资组合的风险调整后收益
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 最大回撤 */}
      <Card>
        <CardHeader>
          <CardTitle>最大回撤</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {(metrics.maxDrawdown * 100).toFixed(2)}%
            </div>
            <Progress
              value={metrics.maxDrawdown * 100}
              className={getProgressColor(metrics.maxDrawdown, "negative")}
            />
            <p className="text-sm text-muted-foreground">
              衡量投资组合的最大亏损幅度
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 相关性 */}
      <Card>
        <CardHeader>
          <CardTitle>市场相关性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {(metrics.correlation * 100).toFixed(2)}%
            </div>
            <Progress
              value={Math.abs(metrics.correlation * 100)}
              className={getProgressColor(Math.abs(metrics.correlation), "negative")}
            />
            <p className="text-sm text-muted-foreground">
              衡量投资组合与市场的相关程度
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 