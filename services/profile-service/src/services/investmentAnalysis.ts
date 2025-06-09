import { IProfile } from '../models/Profile';
import { MarketDataService } from './marketData';
import { logger } from '../utils/logger';

interface InvestmentAnalysis {
  portfolioHealth: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    factors: {
      name: string;
      score: number;
      description: string;
    }[];
  };
  marketInsights: {
    trend: 'bullish' | 'bearish' | 'neutral';
    opportunities: string[];
    risks: string[];
  };
  financialMetrics: {
    returnOnInvestment: number;
    riskAdjustedReturn: number;
    diversificationScore: number;
    liquidityRatio: number;
  };
  recommendations: {
    shortTerm: string[];
    longTerm: string[];
  };
}

export class InvestmentAnalysisService {
  static async analyzeInvestment(profile: IProfile): Promise<InvestmentAnalysis> {
    try {
      // 获取市场数据
      const marketData = await MarketDataService.getMarketData();

      // 分析投资组合健康状况
      const portfolioHealth = this.analyzePortfolioHealth(profile);

      // 分析市场洞察
      const marketInsights = this.analyzeMarketInsights(marketData);

      // 计算财务指标
      const financialMetrics = this.calculateFinancialMetrics(profile);

      // 生成投资建议
      const recommendations = this.generateRecommendations(
        profile,
        portfolioHealth,
        marketInsights,
        financialMetrics
      );

      return {
        portfolioHealth,
        marketInsights,
        financialMetrics,
        recommendations
      };
    } catch (error) {
      logger.error('投资分析失败:', error);
      throw error;
    }
  }

  private static analyzePortfolioHealth(profile: IProfile) {
    const factors = [
      this.analyzeDiversification(profile),
      this.analyzeRiskExposure(profile),
      this.analyzeLiquidity(profile),
      this.analyzeDebtLevel(profile)
    ];

    const totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
    const averageScore = totalScore / factors.length;

    let status: 'excellent' | 'good' | 'fair' | 'poor';
    if (averageScore >= 80) status = 'excellent';
    else if (averageScore >= 60) status = 'good';
    else if (averageScore >= 40) status = 'fair';
    else status = 'poor';

    return {
      score: averageScore,
      status,
      factors
    };
  }

  private static analyzeDiversification(profile: IProfile) {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const weights = Object.values(profile.assets).map(
      value => (value / totalAssets) * 100
    );

    // 计算赫芬达尔-赫希曼指数 (HHI)
    const hhi = weights.reduce((sum, weight) => sum + Math.pow(weight / 100, 2), 0);
    const diversificationScore = (1 - hhi) * 100;

    return {
      name: '资产多元化',
      score: diversificationScore,
      description: this.getDiversificationDescription(diversificationScore)
    };
  }

  private static analyzeRiskExposure(profile: IProfile) {
    const riskScore = profile.riskTolerance * 10;
    const riskExposure = this.calculateRiskExposure(profile);

    return {
      name: '风险敞口',
      score: Math.max(0, 100 - Math.abs(riskScore - riskExposure)),
      description: this.getRiskExposureDescription(riskExposure)
    };
  }

  private static analyzeLiquidity(profile: IProfile) {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const liquidAssets = profile.assets.cash;
    const liquidityRatio = (liquidAssets / totalAssets) * 100;

    return {
      name: '流动性',
      score: Math.min(100, liquidityRatio * 2),
      description: this.getLiquidityDescription(liquidityRatio)
    };
  }

  private static analyzeDebtLevel(profile: IProfile) {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const totalLiabilities = Object.values(profile.liabilities).reduce(
      (sum, value) => sum + value,
      0
    );
    const debtRatio = (totalLiabilities / totalAssets) * 100;

    return {
      name: '负债水平',
      score: Math.max(0, 100 - debtRatio),
      description: this.getDebtLevelDescription(debtRatio)
    };
  }

  private static analyzeMarketInsights(marketData: any) {
    const trend = this.determineMarketTrend(marketData);
    const opportunities = this.identifyOpportunities(marketData);
    const risks = this.identifyRisks(marketData);

    return {
      trend,
      opportunities,
      risks
    };
  }

  private static calculateFinancialMetrics(profile: IProfile) {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const totalLiabilities = Object.values(profile.liabilities).reduce(
      (sum, value) => sum + value,
      0
    );

    return {
      returnOnInvestment: this.calculateROI(profile),
      riskAdjustedReturn: this.calculateRiskAdjustedReturn(profile),
      diversificationScore: this.calculateDiversificationScore(profile),
      liquidityRatio: profile.assets.cash / totalAssets
    };
  }

  private static generateRecommendations(
    profile: IProfile,
    portfolioHealth: any,
    marketInsights: any,
    financialMetrics: any
  ) {
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // 基于投资组合健康状况的建议
    if (portfolioHealth.status === 'poor') {
      shortTerm.push('建议立即调整资产配置，降低高风险资产比例');
    }

    // 基于市场洞察的建议
    if (marketInsights.trend === 'bearish') {
      shortTerm.push('市场下行风险增加，建议增加防御性资产配置');
    }

    // 基于财务指标的建议
    if (financialMetrics.liquidityRatio < 0.1) {
      shortTerm.push('流动性不足，建议增加现金储备');
    }

    // 长期建议
    if (profile.investmentExperience === 'beginner') {
      longTerm.push('建议逐步建立投资知识体系，可以考虑参加投资培训');
    }

    if (portfolioHealth.factors.find((f: { name: string; score: number }) => f.name === '负债水平')?.score < 60) {
      longTerm.push('建议制定长期债务偿还计划，优化债务结构');
    }

    return {
      shortTerm,
      longTerm
    };
  }

  // 辅助方法
  private static getDiversificationDescription(score: number): string {
    if (score >= 80) return '投资组合高度多元化，风险分散良好';
    if (score >= 60) return '投资组合多元化程度适中，可以进一步优化';
    return '投资组合多元化程度不足，建议增加资产类别';
  }

  private static getRiskExposureDescription(exposure: number): string {
    if (exposure >= 80) return '风险敞口较高，适合激进型投资者';
    if (exposure >= 50) return '风险敞口适中，适合平衡型投资者';
    return '风险敞口较低，适合保守型投资者';
  }

  private static getLiquidityDescription(ratio: number): string {
    if (ratio >= 20) return '流动性充足，可以应对紧急情况';
    if (ratio >= 10) return '流动性适中，建议适当增加现金储备';
    return '流动性不足，建议增加现金储备';
  }

  private static getDebtLevelDescription(ratio: number): string {
    if (ratio <= 30) return '负债水平健康，债务负担较轻';
    if (ratio <= 50) return '负债水平适中，建议控制新增债务';
    return '负债水平较高，建议优先偿还高息债务';
  }

  private static determineMarketTrend(marketData: any): 'bullish' | 'bearish' | 'neutral' {
    const stockTrend = marketData.stocks.reduce(
      (sum: number, stock: any) => sum + stock.changePercent,
      0
    ) / marketData.stocks.length;

    if (stockTrend > 1) return 'bullish';
    if (stockTrend < -1) return 'bearish';
    return 'neutral';
  }

  private static identifyOpportunities(marketData: any): string[] {
    const opportunities: string[] = [];

    // 分析股票市场机会
    const stockOpportunities = marketData.stocks
      .filter((stock: any) => stock.changePercent < -5)
      .map((stock: any) => `${stock.index}近期下跌，可能存在投资机会`);

    // 分析债券市场机会
    const bondOpportunities = marketData.bonds
      .filter((bond: any) => bond.yield > 3)
      .map((bond: any) => `${bond.type}收益率较高，可以考虑配置`);

    return [...stockOpportunities, ...bondOpportunities];
  }

  private static identifyRisks(marketData: any): string[] {
    const risks: string[] = [];

    // 分析股票市场风险
    const stockRisks = marketData.stocks
      .filter((stock: any) => stock.changePercent > 5)
      .map((stock: any) => `${stock.index}近期涨幅较大，注意回调风险`);

    // 分析债券市场风险
    const bondRisks = marketData.bonds
      .filter((bond: any) => bond.change < -0.1)
      .map((bond: any) => `${bond.type}价格下跌，注意利率风险`);

    return [...stockRisks, ...bondRisks];
  }

  private static calculateROI(profile: IProfile): number {
    // 简化的 ROI 计算
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const monthlySavings = profile.monthlyIncome - profile.monthlyExpense;
    return (monthlySavings * 12) / totalAssets;
  }

  private static calculateRiskAdjustedReturn(profile: IProfile): number {
    const roi = this.calculateROI(profile);
    const riskFactor = profile.riskTolerance / 10;
    return roi / riskFactor;
  }

  private static calculateDiversificationScore(profile: IProfile): number {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const weights = Object.values(profile.assets).map(
      value => (value / totalAssets) * 100
    );
    const hhi = weights.reduce((sum, weight) => sum + Math.pow(weight / 100, 2), 0);
    return (1 - hhi) * 100;
  }

  private static calculateRiskExposure(profile: IProfile): number {
    const stockWeight = profile.assets.stocks / Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    return stockWeight * 100;
  }
} 