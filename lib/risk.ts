import { Investment } from "@/lib/store/portfolio"

export interface RiskMetrics {
  level: "Low" | "Medium" | "High"
  volatility: number
  beta: number
  sharpeRatio: number
  maxDrawdown: number
  correlation: number
}

// 模拟市场数据
const MARKET_RETURN = 0.08 // 市场年化收益率
const RISK_FREE_RATE = 0.03 // 无风险利率
const MARKET_VOLATILITY = 0.15 // 市场波动率

// 计算投资组合的波动率
function calculateVolatility(investments: Investment[]): number {
  if (investments.length === 0) return 0

  // 计算每个投资的收益率
  const returns = investments.map((inv) => {
    const returnRate = (inv.currentValue - inv.amount) / inv.amount
    return returnRate
  })

  // 计算平均收益率
  const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length

  // 计算方差
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length

  // 计算波动率（标准差）
  return Math.sqrt(variance)
}

// 计算Beta系数
function calculateBeta(investments: Investment[]): number {
  if (investments.length === 0) return 1

  const volatility = calculateVolatility(investments)
  return volatility / MARKET_VOLATILITY
}

// 计算Sharpe比率
function calculateSharpeRatio(investments: Investment[]): number {
  if (investments.length === 0) return 0

  const volatility = calculateVolatility(investments)
  if (volatility === 0) return 0

  // 计算投资组合收益率
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const portfolioReturn = (totalValue - totalInvestment) / totalInvestment

  // 计算超额收益率
  const excessReturn = portfolioReturn - RISK_FREE_RATE

  // 计算Sharpe比率
  return excessReturn / volatility
}

// 计算最大回撤
function calculateMaxDrawdown(investments: Investment[]): number {
  if (investments.length === 0) return 0

  // 计算每个投资的回撤率
  const drawdowns = investments.map((inv) => {
    const drawdown = (inv.amount - inv.currentValue) / inv.amount
    return Math.max(0, drawdown)
  })

  // 返回最大回撤
  return Math.max(...drawdowns)
}

// 计算相关性
function calculateCorrelation(investments: Investment[]): number {
  if (investments.length <= 1) return 0

  // 计算每个投资的收益率
  const returns = investments.map((inv) => {
    const returnRate = (inv.currentValue - inv.amount) / inv.amount
    return returnRate
  })

  // 计算平均收益率
  const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length

  // 计算协方差
  const covariance = returns.reduce((sum, ret) => sum + (ret - meanReturn) * (MARKET_RETURN - meanReturn), 0) / returns.length

  // 计算投资组合标准差
  const portfolioStdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length)

  // 计算市场标准差
  const marketStdDev = MARKET_VOLATILITY

  // 计算相关性
  return covariance / (portfolioStdDev * marketStdDev)
}

// 确定风险等级
function determineRiskLevel(metrics: Omit<RiskMetrics, "level">): "Low" | "Medium" | "High" {
  const { volatility, beta, sharpeRatio, maxDrawdown } = metrics

  // 风险评分（0-100）
  let score = 0

  // 波动率评分（0-25）
  score += Math.min(volatility * 100, 25)

  // Beta评分（0-25）
  score += Math.min(Math.abs(beta - 1) * 25, 25)

  // Sharpe比率评分（0-25）
  score += Math.max(0, 25 - sharpeRatio * 10)

  // 最大回撤评分（0-25）
  score += maxDrawdown * 100

  // 根据总分确定风险等级
  if (score < 40) return "Low"
  if (score < 70) return "Medium"
  return "High"
}

// 计算风险指标
export function calculateRiskMetrics(investments: Investment[]): RiskMetrics {
  const volatility = calculateVolatility(investments)
  const beta = calculateBeta(investments)
  const sharpeRatio = calculateSharpeRatio(investments)
  const maxDrawdown = calculateMaxDrawdown(investments)
  const correlation = calculateCorrelation(investments)

  const metrics = {
    volatility,
    beta,
    sharpeRatio,
    maxDrawdown,
    correlation,
  }

  return {
    ...metrics,
    level: determineRiskLevel(metrics),
  }
} 