import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PortfolioState, Investment, PortfolioStats } from '@/types/portfolio';
import { portfolioApi } from '@/lib/api/portfolio';

interface PortfolioStore extends PortfolioState {
  // 投资组合操作
  fetchInvestments: () => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  
  // 风险评估
  fetchPortfolioStats: () => Promise<void>;
  
  // 工具方法
  calculateTotalInvestment: () => number;
  calculateCurrentValue: () => number;
  calculateReturnRate: () => number;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      investments: [],
      stats: {
        total_investment: 0,
        current_value: 0,
        total_return: 0,
        return_rate: 0,
        risk_level: 'low',
        analysis: {
          volatility: 0,
          beta: 0,
          sharpe_ratio: 0
        }
      },
      loading: false,
      error: null,

      // 获取投资列表
      fetchInvestments: async () => {
        try {
          set({ loading: true, error: null });
          const investments = await portfolioApi.getInvestments();
          set({ investments, loading: false });
        } catch (error) {
          set({ error: '获取投资列表失败', loading: false });
        }
      },

      // 添加投资
      addInvestment: (investment) => {
        const newInvestment = {
          ...investment,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          investments: [...state.investments, newInvestment],
        }));
      },

      // 更新投资
      updateInvestment: (id, investment) => {
        set((state) => ({
          investments: state.investments.map((item) =>
            item.id === id ? { ...item, ...investment } : item
          ),
        }));
      },

      // 删除投资
      deleteInvestment: (id) => {
        set((state) => ({
          investments: state.investments.filter((item) => item.id !== id),
        }));
      },

      // 获取投资组合统计
      fetchPortfolioStats: async () => {
        try {
          set({ loading: true, error: null });
          const stats = await portfolioApi.getPortfolioStats();
          set({ stats, loading: false });
        } catch (error) {
          set({ error: '获取投资统计失败', loading: false });
        }
      },

      // 计算总投资额
      calculateTotalInvestment: () => {
        return get().investments.reduce((sum, item) => sum + item.amount, 0);
      },

      // 计算当前总价值
      calculateCurrentValue: () => {
        return get().investments.reduce((sum, item) => sum + item.currentValue, 0);
      },

      // 计算收益率
      calculateReturnRate: () => {
        const totalInvestment = get().calculateTotalInvestment();
        const currentValue = get().calculateCurrentValue();
        return totalInvestment > 0 ? (currentValue - totalInvestment) / totalInvestment : 0;
      },
    }),
    {
      name: "portfolio-storage",
    }
  )
); 