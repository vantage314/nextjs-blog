import { IProfile } from '../models/Profile';
import { logger } from '../utils/logger';

interface InvestmentAdvice {
  assetAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    realEstate: number;
  };
  recommendations: string[];
  riskLevel: string;
}

export class InvestmentAdviceService {
  static calculateAssetAllocation(profile: IProfile): InvestmentAdvice {
    const { riskLevel, riskTolerance, investmentExperience } = profile;
    
    // 基础资产配置
    let baseAllocation = {
      stocks: 0,
      bonds: 0,
      cash: 0,
      realEstate: 0
    };

    // 根据风险等级调整配置
    switch (riskLevel) {
      case 'conservative':
        baseAllocation = {
          stocks: 20,
          bonds: 50,
          cash: 20,
          realEstate: 10
        };
        break;
      case 'moderate':
        baseAllocation = {
          stocks: 40,
          bonds: 30,
          cash: 15,
          realEstate: 15
        };
        break;
      case 'aggressive':
        baseAllocation = {
          stocks: 60,
          bonds: 20,
          cash: 10,
          realEstate: 10
        };
        break;
    }

    // 根据风险承受能力微调
    const riskAdjustment = (riskTolerance - 5) * 2; // -8 到 +10 的调整范围
    baseAllocation.stocks += riskAdjustment;
    baseAllocation.bonds -= riskAdjustment;

    // 确保所有比例在 0-100 之间
    Object.keys(baseAllocation).forEach(key => {
      baseAllocation[key as keyof typeof baseAllocation] = Math.max(
        0,
        Math.min(100, baseAllocation[key as keyof typeof baseAllocation])
      );
    });

    // 生成投资建议
    const recommendations = this.generateRecommendations(profile, baseAllocation);

    return {
      assetAllocation: baseAllocation,
      recommendations,
      riskLevel
    };
  }

  private static generateRecommendations(
    profile: IProfile,
    allocation: { [key: string]: number }
  ): string[] {
    const recommendations: string[] = [];

    // 基于投资经验
    if (profile.investmentExperience === 'beginner') {
      recommendations.push('建议从指数基金开始投资，降低个股投资风险');
      recommendations.push('考虑使用定投策略，分散投资时间风险');
    }

    // 基于资产配置
    if (allocation.stocks > 50) {
      recommendations.push('股票配置较高，建议适当增加债券配置以平衡风险');
    }

    // 基于负债情况
    const totalLiabilities = Object.values(profile.liabilities).reduce(
      (sum, value) => sum + value,
      0
    );
    if (totalLiabilities > 0) {
      recommendations.push('建议优先偿还高息负债，如信用卡债务');
    }

    // 基于储蓄率
    const savingsRate = profile.savingsRate;
    if (savingsRate < 20) {
      recommendations.push('当前储蓄率较低，建议适当控制支出，提高储蓄率');
    }

    return recommendations;
  }
} 