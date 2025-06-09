import { IProfile } from '../models/Profile';
import { logger } from '../utils/logger';

interface ProfileAnalysis {
  financialHealth: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    factors: {
      name: string;
      score: number;
      description: string;
    }[];
  };
  investmentBehavior: {
    riskProfile: string;
    investmentStyle: string;
    strengths: string[];
    weaknesses: string[];
  };
  financialGoals: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    progress: {
      goal: string;
      current: number;
      target: number;
      percentage: number;
    }[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  marketTiming: {
    score: number;
    opportunities: string[];
    risks: string[];
    marketSentiment: 'bullish' | 'bearish' | 'neutral';
  };
  taxEfficiency: {
    score: number;
    suggestions: string[];
    taxOptimization: {
      current: number;
      potential: number;
      improvement: number;
    };
  };
  retirementReadiness: {
    score: number;
    status: 'on-track' | 'behind' | 'ahead';
    analysis: {
      currentSavings: number;
      projectedNeeds: number;
      gap: number;
      yearsToRetirement: number;
    };
  };
}

export class ProfileAnalysisService {
  static analyzeProfile(profile: IProfile): ProfileAnalysis {
    try {
      // 分析财务状况
      const financialHealth = this.analyzeFinancialHealth(profile);

      // 分析投资行为
      const investmentBehavior = this.analyzeInvestmentBehavior(profile);

      // 分析财务目标
      const financialGoals = this.analyzeFinancialGoals(profile);

      // 分析市场时机
      const marketTiming = this.analyzeMarketTiming(profile);

      // 分析税收效率
      const taxEfficiency = this.analyzeTaxEfficiency(profile);

      // 分析退休准备
      const retirementReadiness = this.analyzeRetirementReadiness(profile);

      // 生成建议
      const recommendations = this.generateRecommendations(
        profile,
        financialHealth,
        investmentBehavior,
        financialGoals,
        marketTiming,
        taxEfficiency,
        retirementReadiness
      );

      return {
        financialHealth,
        investmentBehavior,
        financialGoals,
        marketTiming,
        taxEfficiency,
        retirementReadiness,
        recommendations
      };
    } catch (error) {
      logger.error('用户画像分析失败:', error);
      throw error;
    }
  }

  private static analyzeFinancialHealth(profile: IProfile) {
    const factors = [
      this.analyzeSavingsRate(profile),
      this.analyzeDebtToIncome(profile),
      this.analyzeEmergencyFund(profile),
      this.analyzeInvestmentDiversity(profile)
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

  private static analyzeSavingsRate(profile: IProfile) {
    const savingsRate = profile.savingsRate;
    let score = 0;
    let description = '';

    if (savingsRate >= 30) {
      score = 100;
      description = '储蓄率优秀，继续保持';
    } else if (savingsRate >= 20) {
      score = 80;
      description = '储蓄率良好，有提升空间';
    } else if (savingsRate >= 10) {
      score = 60;
      description = '储蓄率一般，建议提高';
    } else {
      score = 40;
      description = '储蓄率较低，需要改善';
    }

    return {
      name: '储蓄率',
      score,
      description
    };
  }

  private static analyzeDebtToIncome(profile: IProfile) {
    const totalLiabilities = Object.values(profile.liabilities).reduce(
      (sum, value) => sum + value,
      0
    );
    const annualIncome = profile.monthlyIncome * 12;
    const debtToIncomeRatio = (totalLiabilities / annualIncome) * 100;

    let score = 0;
    let description = '';

    if (debtToIncomeRatio <= 20) {
      score = 100;
      description = '债务负担较轻，财务状况健康';
    } else if (debtToIncomeRatio <= 40) {
      score = 80;
      description = '债务负担适中，建议控制新增债务';
    } else if (debtToIncomeRatio <= 60) {
      score = 60;
      description = '债务负担较重，需要制定还款计划';
    } else {
      score = 40;
      description = '债务负担过重，建议优先处理高息债务';
    }

    return {
      name: '债务收入比',
      score,
      description
    };
  }

  private static analyzeEmergencyFund(profile: IProfile) {
    const monthlyExpenses = profile.monthlyExpense;
    const emergencyFund = profile.assets.cash;
    const monthsCovered = emergencyFund / monthlyExpenses;

    let score = 0;
    let description = '';

    if (monthsCovered >= 6) {
      score = 100;
      description = '应急资金充足，可以应对突发情况';
    } else if (monthsCovered >= 3) {
      score = 80;
      description = '应急资金基本充足，建议继续积累';
    } else if (monthsCovered >= 1) {
      score = 60;
      description = '应急资金不足，需要增加储备';
    } else {
      score = 40;
      description = '应急资金严重不足，建议优先建立应急基金';
    }

    return {
      name: '应急资金',
      score,
      description
    };
  }

  private static analyzeInvestmentDiversity(profile: IProfile) {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const weights = Object.values(profile.assets).map(
      value => (value / totalAssets) * 100
    );
    const hhi = weights.reduce((sum, weight) => sum + Math.pow(weight / 100, 2), 0);
    const diversityScore = (1 - hhi) * 100;

    let score = 0;
    let description = '';

    if (diversityScore >= 80) {
      score = 100;
      description = '投资组合高度多元化，风险分散良好';
    } else if (diversityScore >= 60) {
      score = 80;
      description = '投资组合多元化程度适中，可以进一步优化';
    } else if (diversityScore >= 40) {
      score = 60;
      description = '投资组合多元化程度不足，建议增加资产类别';
    } else {
      score = 40;
      description = '投资组合过于集中，风险较高';
    }

    return {
      name: '投资多元化',
      score,
      description
    };
  }

  private static analyzeInvestmentBehavior(profile: IProfile) {
    const riskProfile = this.determineRiskProfile(profile);
    const investmentStyle = this.determineInvestmentStyle(profile);
    const { strengths, weaknesses } = this.analyzeStrengthsAndWeaknesses(profile);

    return {
      riskProfile,
      investmentStyle,
      strengths,
      weaknesses
    };
  }

  private static determineRiskProfile(profile: IProfile): string {
    const riskScore = profile.riskTolerance;
    const stockWeight = profile.assets.stocks / Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    ) * 100;

    if (riskScore >= 8 && stockWeight >= 60) return '激进型投资者';
    if (riskScore >= 6 && stockWeight >= 40) return '积极型投资者';
    if (riskScore >= 4 && stockWeight >= 20) return '平衡型投资者';
    return '保守型投资者';
  }

  private static determineInvestmentStyle(profile: IProfile): string {
    const { investmentExperience, riskTolerance } = profile;
    
    if (investmentExperience === 'beginner') {
      return '稳健型投资风格';
    } else if (investmentExperience === 'intermediate') {
      return riskTolerance >= 7 ? '积极型投资风格' : '平衡型投资风格';
    } else {
      return riskTolerance >= 8 ? '进取型投资风格' : '灵活型投资风格';
    }
  }

  private static analyzeStrengthsAndWeaknesses(profile: IProfile) {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // 分析优势
    if (profile.savingsRate >= 20) {
      strengths.push('良好的储蓄习惯');
    }
    if (profile.assets.cash >= profile.monthlyExpense * 3) {
      strengths.push('充足的应急资金');
    }
    if (profile.investmentExperience === 'advanced') {
      strengths.push('丰富的投资经验');
    }

    // 分析劣势
    if (profile.savingsRate < 10) {
      weaknesses.push('储蓄率较低');
    }
    if (Object.values(profile.liabilities).reduce((sum, value) => sum + value, 0) > 0) {
      weaknesses.push('存在债务负担');
    }
    if (profile.investmentExperience === 'beginner') {
      weaknesses.push('投资经验不足');
    }

    return { strengths, weaknesses };
  }

  private static analyzeFinancialGoals(profile: IProfile) {
    const goals = this.categorizeGoals(profile.investmentGoals);
    const progress = this.calculateGoalProgress(profile);

    return {
      shortTerm: goals.shortTerm,
      mediumTerm: goals.mediumTerm,
      longTerm: goals.longTerm,
      progress
    };
  }

  private static categorizeGoals(goals: string[]) {
    const shortTerm: string[] = [];
    const mediumTerm: string[] = [];
    const longTerm: string[] = [];

    goals.forEach(goal => {
      if (goal.includes('应急') || goal.includes('短期')) {
        shortTerm.push(goal);
      } else if (goal.includes('中期') || goal.includes('教育')) {
        mediumTerm.push(goal);
      } else {
        longTerm.push(goal);
      }
    });

    return { shortTerm, mediumTerm, longTerm };
  }

  private static calculateGoalProgress(profile: IProfile) {
    const progress = [];

    // 计算应急资金目标进度
    const emergencyFundTarget = profile.monthlyExpense * 6;
    progress.push({
      goal: '应急资金',
      current: profile.assets.cash,
      target: emergencyFundTarget,
      percentage: Math.min(100, (profile.assets.cash / emergencyFundTarget) * 100)
    });

    // 计算投资目标进度
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const investmentTarget = profile.monthlyIncome * 12;
    progress.push({
      goal: '年度投资',
      current: totalAssets,
      target: investmentTarget,
      percentage: Math.min(100, (totalAssets / investmentTarget) * 100)
    });

    return progress;
  }

  private static analyzeMarketTiming(profile: IProfile) {
    const marketTimingScore = this.calculateMarketTimingScore(profile);
    const opportunities = this.identifyMarketOpportunities(profile);
    const risks = this.identifyMarketRisks(profile);
    const marketSentiment = this.determineMarketSentiment(profile);

    return {
      score: marketTimingScore,
      opportunities,
      risks,
      marketSentiment
    };
  }

  private static calculateMarketTimingScore(profile: IProfile): number {
    const factors = [
      this.calculateMarketValuationScore(profile),
      this.calculateEconomicCycleScore(profile),
      this.calculateInterestRateScore(profile)
    ];

    return factors.reduce((sum, score) => sum + score, 0) / factors.length;
  }

  private static calculateMarketValuationScore(profile: IProfile): number {
    // 基于市场估值指标计算得分
    const stockWeight = profile.assets.stocks / Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );
    const marketValuation = this.getMarketValuation(); // 假设这个方法从外部获取市场估值数据

    if (marketValuation > 1.5) return 40; // 市场估值过高
    if (marketValuation > 1.2) return 60; // 市场估值偏高
    if (marketValuation > 0.8) return 80; // 市场估值合理
    return 100; // 市场估值偏低，投资机会好
  }

  private static calculateEconomicCycleScore(profile: IProfile): number {
    // 基于经济周期阶段计算得分
    const economicCycle = this.getEconomicCycle(); // 假设这个方法从外部获取经济周期数据

    switch (economicCycle) {
      case 'expansion': return 80;
      case 'peak': return 40;
      case 'contraction': return 60;
      case 'trough': return 100;
      default: return 70;
    }
  }

  private static calculateInterestRateScore(profile: IProfile): number {
    // 基于利率环境计算得分
    const interestRate = this.getInterestRate(); // 假设这个方法从外部获取利率数据

    if (interestRate > 5) return 40; // 利率过高
    if (interestRate > 3) return 60; // 利率偏高
    if (interestRate > 1) return 80; // 利率适中
    return 100; // 利率偏低，适合投资
  }

  private static identifyMarketOpportunities(profile: IProfile): string[] {
    const opportunities: string[] = [];
    const marketData = this.getMarketData(); // 假设这个方法从外部获取市场数据

    // 分析股票市场机会
    if (marketData.stocks.valuation < 0.8) {
      opportunities.push('股票市场估值偏低，可以考虑增加配置');
    }

    // 分析债券市场机会
    if (marketData.bonds.yield > 4) {
      opportunities.push('债券收益率较高，可以考虑配置高收益债券');
    }

    // 分析房地产市场机会
    if (marketData.realEstate.priceToRent < 15) {
      opportunities.push('房地产市场租金回报率较高，可以考虑投资房产');
    }

    return opportunities;
  }

  private static identifyMarketRisks(profile: IProfile): string[] {
    const risks: string[] = [];
    const marketData = this.getMarketData();

    // 分析股票市场风险
    if (marketData.stocks.valuation > 1.5) {
      risks.push('股票市场估值偏高，注意回调风险');
    }

    // 分析债券市场风险
    if (marketData.bonds.yield < 2) {
      risks.push('债券收益率较低，注意利率风险');
    }

    // 分析房地产市场风险
    if (marketData.realEstate.priceToRent > 30) {
      risks.push('房地产市场估值偏高，注意价格回调风险');
    }

    return risks;
  }

  private static determineMarketSentiment(profile: IProfile): 'bullish' | 'bearish' | 'neutral' {
    const marketData = this.getMarketData();
    const sentimentScore = this.calculateSentimentScore(marketData);

    if (sentimentScore > 70) return 'bullish';
    if (sentimentScore < 30) return 'bearish';
    return 'neutral';
  }

  private static analyzeTaxEfficiency(profile: IProfile) {
    const taxEfficiencyScore = this.calculateTaxEfficiencyScore(profile);
    const suggestions = this.generateTaxEfficiencySuggestions(profile);
    const taxOptimization = this.calculateTaxOptimization(profile);

    return {
      score: taxEfficiencyScore,
      suggestions,
      taxOptimization
    };
  }

  private static calculateTaxEfficiencyScore(profile: IProfile): number {
    const factors = [
      this.calculateTaxDeferredScore(profile),
      this.calculateTaxExemptScore(profile),
      this.calculateTaxLossHarvestingScore(profile)
    ];

    return factors.reduce((sum, score) => sum + score, 0) / factors.length;
  }

  private static generateTaxEfficiencySuggestions(profile: IProfile): string[] {
    const suggestions: string[] = [];

    // 检查税收递延账户使用情况
    if (profile.assets.taxDeferred < profile.monthlyIncome * 12) {
      suggestions.push('建议充分利用税收递延账户，如401(k)、IRA等');
    }

    // 检查税收优惠投资
    if (profile.assets.taxExempt < profile.assets.taxable * 0.2) {
      suggestions.push('建议增加税收优惠投资，如市政债券等');
    }

    // 检查税收损失收割
    if (!profile.taxLossHarvesting) {
      suggestions.push('建议实施税收损失收割策略，优化税收效率');
    }

    return suggestions;
  }

  private static calculateTaxOptimization(profile: IProfile) {
    const currentTaxBurden = this.calculateCurrentTaxBurden(profile);
    const potentialTaxBurden = this.calculatePotentialTaxBurden(profile);
    const improvement = currentTaxBurden - potentialTaxBurden;

    return {
      current: currentTaxBurden,
      potential: potentialTaxBurden,
      improvement
    };
  }

  private static analyzeRetirementReadiness(profile: IProfile) {
    const retirementScore = this.calculateRetirementScore(profile);
    const analysis = this.analyzeRetirementGap(profile);
    const status = this.determineRetirementStatus(analysis);

    return {
      score: retirementScore,
      status,
      analysis
    };
  }

  private static calculateRetirementScore(profile: IProfile): number {
    const factors = [
      this.calculateSavingsRateScore(profile),
      this.calculateInvestmentReturnScore(profile),
      this.calculateRetirementIncomeScore(profile)
    ];

    return factors.reduce((sum, score) => sum + score, 0) / factors.length;
  }

  private static analyzeRetirementGap(profile: IProfile) {
    const currentSavings = this.calculateCurrentRetirementSavings(profile);
    const projectedNeeds = this.calculateProjectedRetirementNeeds(profile);
    const gap = projectedNeeds - currentSavings;
    const yearsToRetirement = this.calculateYearsToRetirement(profile);

    return {
      currentSavings,
      projectedNeeds,
      gap,
      yearsToRetirement
    };
  }

  private static determineRetirementStatus(analysis: any): 'on-track' | 'behind' | 'ahead' {
    const { currentSavings, projectedNeeds, yearsToRetirement } = analysis;
    const requiredAnnualSavings = (projectedNeeds - currentSavings) / yearsToRetirement;
    const currentAnnualSavings = this.calculateCurrentAnnualSavings(profile);

    if (currentAnnualSavings >= requiredAnnualSavings * 1.2) return 'ahead';
    if (currentAnnualSavings >= requiredAnnualSavings * 0.8) return 'on-track';
    return 'behind';
  }

  // 辅助方法
  private static getMarketValuation(): number {
    // 实现市场估值计算逻辑
    return 1.0;
  }

  private static getEconomicCycle(): string {
    // 实现经济周期判断逻辑
    return 'expansion';
  }

  private static getInterestRate(): number {
    // 实现利率获取逻辑
    return 2.5;
  }

  private static getMarketData(): any {
    // 实现市场数据获取逻辑
    return {
      stocks: { valuation: 1.2, trend: 'up' },
      bonds: { yield: 3.5, trend: 'down' },
      realEstate: { priceToRent: 20, trend: 'stable' }
    };
  }

  private static calculateSentimentScore(marketData: any): number {
    // 实现市场情绪计算逻辑
    return 60;
  }

  private static calculateTaxDeferredScore(profile: IProfile): number {
    // 实现税收递延得分计算逻辑
    return 70;
  }

  private static calculateTaxExemptScore(profile: IProfile): number {
    // 实现税收优惠得分计算逻辑
    return 60;
  }

  private static calculateTaxLossHarvestingScore(profile: IProfile): number {
    // 实现税收损失收割得分计算逻辑
    return 50;
  }

  private static calculateCurrentTaxBurden(profile: IProfile): number {
    // 实现当前税收负担计算逻辑
    return 10000;
  }

  private static calculatePotentialTaxBurden(profile: IProfile): number {
    // 实现潜在税收负担计算逻辑
    return 8000;
  }

  private static calculateSavingsRateScore(profile: IProfile): number {
    // 实现储蓄率得分计算逻辑
    return 75;
  }

  private static calculateInvestmentReturnScore(profile: IProfile): number {
    // 实现投资回报得分计算逻辑
    return 65;
  }

  private static calculateRetirementIncomeScore(profile: IProfile): number {
    // 实现退休收入得分计算逻辑
    return 70;
  }

  private static calculateCurrentRetirementSavings(profile: IProfile): number {
    // 实现当前退休储蓄计算逻辑
    return 500000;
  }

  private static calculateProjectedRetirementNeeds(profile: IProfile): number {
    // 实现预计退休需求计算逻辑
    return 2000000;
  }

  private static calculateYearsToRetirement(profile: IProfile): number {
    // 实现距离退休年数计算逻辑
    return 20;
  }

  private static calculateCurrentAnnualSavings(profile: IProfile): number {
    // 实现当前年度储蓄计算逻辑
    return 50000;
  }

  private static generateRecommendations(
    profile: IProfile,
    financialHealth: any,
    investmentBehavior: any,
    financialGoals: any,
    marketTiming: any,
    taxEfficiency: any,
    retirementReadiness: any
  ) {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // 即时建议
    if (financialHealth.status === 'poor') {
      immediate.push('建议立即调整资产配置，降低高风险资产比例');
    }
    if (profile.assets.cash < profile.monthlyExpense * 3) {
      immediate.push('建议优先建立应急资金');
    }

    // 短期建议
    if (profile.savingsRate < 20) {
      shortTerm.push('建议提高储蓄率至20%以上');
    }
    if (investmentBehavior.weaknesses.includes('投资经验不足')) {
      shortTerm.push('建议参加投资培训，提升投资知识');
    }

    // 长期建议
    if (financialGoals.longTerm.length > 0) {
      longTerm.push('建议制定长期投资计划，实现长期财务目标');
    }
    if (investmentBehavior.riskProfile === '保守型投资者') {
      longTerm.push('建议逐步提高风险承受能力，优化投资组合');
    }

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }
} 