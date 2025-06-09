export interface Investment {
  id: string;
  name: string;
  amount: number;
  date: string;
  current_value: number;
  type: 'stock' | 'fund' | 'bond' | 'other';
  risk_level: 'low' | 'medium' | 'high';
  description?: string;
  tags?: string[];
}

export interface PortfolioStats {
  total_investment: number;
  current_value: number;
  total_return: number;
  return_rate: number;
  risk_level: 'low' | 'medium' | 'high';
  analysis: {
    volatility: number;
    beta: number;
    sharpe_ratio: number;
  };
}

export interface PortfolioState {
  investments: Investment[];
  stats: PortfolioStats;
  loading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  investment_id?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unread_count: number;
  loading: boolean;
  error: string | null;
} 