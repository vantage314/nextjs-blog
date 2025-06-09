import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { formatPercentage } from '@/lib/utils';

export function RiskAssessment() {
  const { stats, fetchPortfolioStats } = usePortfolioStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPortfolioStats();
  }, [fetchPortfolioStats]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>风险评估</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">投资组合风险评估</h2>
          
          <div className="space-y-6">
            {/* 风险等级 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">风险等级</h3>
              <p className={`text-2xl font-bold ${getRiskLevelColor(stats.risk_level)}`}>
                {stats.risk_level === 'low' ? '低风险' : 
                 stats.risk_level === 'medium' ? '中等风险' : '高风险'}
              </p>
            </div>

            {/* 风险指标 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">波动率</h4>
                <p className="text-xl font-bold">{formatPercentage(stats.analysis.volatility)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  衡量投资组合收益率的波动程度
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">Beta值</h4>
                <p className="text-xl font-bold">{stats.analysis.beta.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  衡量投资组合相对于市场的敏感度
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">夏普比率</h4>
                <p className="text-xl font-bold">{stats.analysis.sharpe_ratio.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  衡量风险调整后的收益表现
                </p>
              </div>
            </div>

            {/* 风险建议 */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">风险建议</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {stats.risk_level === 'low' && (
                  <p className="text-sm text-gray-600">
                    您的投资组合风险较低，适合保守型投资者。建议：
                    <ul className="list-disc list-inside mt-2">
                      <li>可以考虑适当增加一些中等风险的投资</li>
                      <li>关注长期稳定的收益</li>
                      <li>保持投资组合的多样性</li>
                    </ul>
                  </p>
                )}
                {stats.risk_level === 'medium' && (
                  <p className="text-sm text-gray-600">
                    您的投资组合风险适中，适合平衡型投资者。建议：
                    <ul className="list-disc list-inside mt-2">
                      <li>保持当前的风险水平</li>
                      <li>定期评估投资表现</li>
                      <li>根据市场情况调整配置</li>
                    </ul>
                  </p>
                )}
                {stats.risk_level === 'high' && (
                  <p className="text-sm text-gray-600">
                    您的投资组合风险较高，适合激进型投资者。建议：
                    <ul className="list-disc list-inside mt-2">
                      <li>考虑降低部分高风险投资</li>
                      <li>增加防御性资产配置</li>
                      <li>密切关注市场变化</li>
                    </ul>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
} 