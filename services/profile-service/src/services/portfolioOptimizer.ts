import { IProfile } from '../models/Profile';
import { MarketDataService } from './marketData';
import { logger } from '../utils/logger';

interface Asset {
  type: string;
  weight: number;
  expectedReturn: number;
  risk: number;
}

interface OptimizedPortfolio {
  assets: Asset[];
  expectedReturn: number;
  risk: number;
  sharpeRatio: number;
  rebalancingNeeded: boolean;
  rebalancingSuggestions: {
    asset: string;
    currentWeight: number;
    targetWeight: number;
    action: 'increase' | 'decrease';
    amount: number;
  }[];
}

export class PortfolioOptimizer {
  static async optimizePortfolio(profile: IProfile): Promise<OptimizedPortfolio> {
    try {
      // 获取市场数据
      const marketData = await MarketDataService.getMarketData();

      // 计算当前资产配置
      const currentAssets = this.calculateCurrentAssets(profile);

      // 计算目标资产配置
      const targetAssets = this.calculateTargetAssets(profile, marketData);

      // 计算优化后的投资组合
      const optimizedPortfolio = this.calculateOptimizedPortfolio(
        currentAssets,
        targetAssets,
        profile
      );

      // 生成再平衡建议
      const rebalancingSuggestions = this.generateRebalancingSuggestions(
        currentAssets,
        optimizedPortfolio.assets
      );

      return {
        ...optimizedPortfolio,
        rebalancingNeeded: rebalancingSuggestions.length > 0,
        rebalancingSuggestions
      };
    } catch (error) {
      logger.error('投资组合优化失败:', error);
      throw error;
    }
  }

  private static calculateCurrentAssets(profile: IProfile): Asset[] {
    const totalAssets = Object.values(profile.assets).reduce(
      (sum, value) => sum + value,
      0
    );

    return [
      {
        type: 'stocks',
        weight: (profile.assets.stocks / totalAssets) * 100,
        expectedReturn: 0.08,
        risk: 0.15
      },
      {
        type: 'bonds',
        weight: (profile.assets.bonds / totalAssets) * 100,
        expectedReturn: 0.04,
        risk: 0.05
      },
      {
        type: 'cash',
        weight: (profile.assets.cash / totalAssets) * 100,
        expectedReturn: 0.02,
        risk: 0.01
      },
      {
        type: 'realEstate',
        weight: (profile.assets.realEstate / totalAssets) * 100,
        expectedReturn: 0.06,
        risk: 0.10
      }
    ];
  }

  private static calculateTargetAssets(
    profile: IProfile,
    marketData: any
  ): Asset[] {
    // 基于用户风险偏好和市场数据计算目标配置
    const riskFactor = profile.riskTolerance / 10;
    const marketRiskFactor = this.calculateMarketRiskFactor(marketData);

    return [
      {
        type: 'stocks',
        weight: 40 + (riskFactor * 20) - (marketRiskFactor * 10),
        expectedReturn: 0.08,
        risk: 0.15
      },
      {
        type: 'bonds',
        weight: 30 - (riskFactor * 10) + (marketRiskFactor * 5),
        expectedReturn: 0.04,
        risk: 0.05
      },
      {
        type: 'cash',
        weight: 15 - (riskFactor * 5) + (marketRiskFactor * 5),
        expectedReturn: 0.02,
        risk: 0.01
      },
      {
        type: 'realEstate',
        weight: 15 - (riskFactor * 5),
        expectedReturn: 0.06,
        risk: 0.10
      }
    ];
  }

  private static calculateMarketRiskFactor(marketData: any): number {
    // 基于市场数据计算风险因子
    const stockRisk = marketData.stocks.reduce(
      (sum: number, stock: any) => sum + Math.abs(stock.changePercent),
      0
    ) / marketData.stocks.length;

    const bondRisk = marketData.bonds.reduce(
      (sum: number, bond: any) => sum + Math.abs(bond.change),
      0
    ) / marketData.bonds.length;

    return (stockRisk + bondRisk) / 2;
  }

  private static calculateOptimizedPortfolio(
    currentAssets: Asset[],
    targetAssets: Asset[],
    profile: IProfile
  ): OptimizedPortfolio {
    // 计算投资组合的预期收益和风险
    const expectedReturn = targetAssets.reduce(
      (sum, asset) => sum + asset.expectedReturn * (asset.weight / 100),
      0
    );

    const risk = targetAssets.reduce(
      (sum, asset) => sum + asset.risk * (asset.weight / 100),
      0
    );

    // 计算夏普比率
    const riskFreeRate = 0.02; // 假设无风险利率为2%
    const sharpeRatio = (expectedReturn - riskFreeRate) / risk;

    return {
      assets: targetAssets,
      expectedReturn,
      risk,
      sharpeRatio,
      rebalancingNeeded: false,
      rebalancingSuggestions: []
    };
  }

  private static generateRebalancingSuggestions(
    currentAssets: Asset[],
    targetAssets: Asset[]
  ): { asset: string; currentWeight: number; targetWeight: number; action: 'increase' | 'decrease'; amount: number }[] {
    const suggestions: { asset: string; currentWeight: number; targetWeight: number; action: 'increase' | 'decrease'; amount: number }[] = [];
    const threshold = 5; // 5%的偏差阈值

    for (let i = 0; i < currentAssets.length; i++) {
      const current = currentAssets[i];
      const target = targetAssets[i];
      const difference = target.weight - current.weight;

      if (Math.abs(difference) > threshold) {
        suggestions.push({
          asset: current.type,
          currentWeight: current.weight,
          targetWeight: target.weight,
          action: difference > 0 ? 'increase' : 'decrease',
          amount: Math.abs(difference)
        });
      }
    }

    return suggestions;
  }
} 