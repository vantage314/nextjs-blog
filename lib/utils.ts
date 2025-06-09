import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN });
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateReturnRate(currentValue: number, initialValue: number): number {
  if (initialValue === 0) return 0;
  return (currentValue - initialValue) / initialValue;
}

export function calculateTotalReturn(investments: Array<{ current_value: number; amount: number }>): number {
  return investments.reduce((total, inv) => total + (inv.current_value - inv.amount), 0);
}

export function calculatePortfolioRisk(investments: Array<{ risk_level: string }>): string {
  const riskWeights = {
    low: 1,
    medium: 2,
    high: 3
  };

  const totalWeight = investments.reduce((sum, inv) => sum + riskWeights[inv.risk_level as keyof typeof riskWeights], 0);
  const averageWeight = totalWeight / investments.length;

  if (averageWeight < 1.5) return 'low';
  if (averageWeight < 2.5) return 'medium';
  return 'high';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000000; // 最大10亿
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = async (retriesLeft: number) => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (retriesLeft === 0) {
          reject(error);
          return;
        }
        setTimeout(() => attempt(retriesLeft - 1), delay);
      }
    };
    attempt(retries);
  });
}
