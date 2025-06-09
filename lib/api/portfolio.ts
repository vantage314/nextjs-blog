import axios from 'axios';
import { Investment, PortfolioStats } from '@/types/portfolio';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const portfolioApi = {
  // 获取投资列表
  getInvestments: async (): Promise<Investment[]> => {
    const response = await axios.get(`${API_BASE_URL}/portfolio/investments`);
    return response.data;
  },

  // 创建投资
  createInvestment: async (investment: Omit<Investment, 'id'>): Promise<Investment> => {
    const response = await axios.post(`${API_BASE_URL}/portfolio/investments`, investment);
    return response.data;
  },

  // 更新投资
  updateInvestment: async (id: string, investment: Partial<Investment>): Promise<Investment> => {
    const response = await axios.patch(`${API_BASE_URL}/portfolio/investments/${id}`, investment);
    return response.data;
  },

  // 删除投资
  deleteInvestment: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/portfolio/investments/${id}`);
  },

  // 获取投资组合统计
  getPortfolioStats: async (): Promise<PortfolioStats> => {
    const response = await axios.get(`${API_BASE_URL}/portfolio/stats`);
    return response.data;
  },

  // 获取风险评估
  getRiskAssessment: async (): Promise<PortfolioStats> => {
    const response = await axios.get(`${API_BASE_URL}/portfolio/risk-assessment`);
    return response.data;
  }
}; 