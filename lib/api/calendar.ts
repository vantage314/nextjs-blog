import axios from 'axios';
import {
  InvestmentEvent,
  EventFilter,
  EventSearchResult,
  EventCategory,
  EventTag,
  ReminderRule,
  ReminderHistory,
} from '@/types/calendar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 事件相关 API
export const calendarApi = {
  // 获取事件列表
  getEvents: async (filter?: EventFilter): Promise<EventSearchResult> => {
    const response = await api.get('/calendar/events', { params: filter });
    return response.data;
  },

  // 创建事件
  createEvent: async (event: Partial<InvestmentEvent>): Promise<InvestmentEvent> => {
    const response = await api.post('/calendar/events', event);
    return response.data;
  },

  // 更新事件
  updateEvent: async (id: string, event: Partial<InvestmentEvent>): Promise<InvestmentEvent> => {
    const response = await api.put(`/calendar/events/${id}`, event);
    return response.data;
  },

  // 删除事件
  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/calendar/events/${id}`);
  },

  // 导入事件
  importEvents: async (events: InvestmentEvent[]): Promise<void> => {
    await api.post('/calendar/events/import', { events });
  },

  // 导出事件
  exportEvents: async (filter?: EventFilter): Promise<InvestmentEvent[]> => {
    const response = await api.get('/calendar/events/export', { params: filter });
    return response.data;
  },

  // 获取分类列表
  getCategories: async (): Promise<EventCategory[]> => {
    const response = await api.get('/calendar/categories');
    return response.data;
  },

  // 创建分类
  createCategory: async (category: Partial<EventCategory>): Promise<EventCategory> => {
    const response = await api.post('/calendar/categories', category);
    return response.data;
  },

  // 更新分类
  updateCategory: async (id: string, category: Partial<EventCategory>): Promise<EventCategory> => {
    const response = await api.put(`/calendar/categories/${id}`, category);
    return response.data;
  },

  // 删除分类
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/calendar/categories/${id}`);
  },

  // 获取标签列表
  getTags: async (): Promise<EventTag[]> => {
    const response = await api.get('/calendar/tags');
    return response.data;
  },

  // 创建标签
  createTag: async (tag: Partial<EventTag>): Promise<EventTag> => {
    const response = await api.post('/calendar/tags', tag);
    return response.data;
  },

  // 更新标签
  updateTag: async (id: string, tag: Partial<EventTag>): Promise<EventTag> => {
    const response = await api.put(`/calendar/tags/${id}`, tag);
    return response.data;
  },

  // 删除标签
  deleteTag: async (id: string): Promise<void> => {
    await api.delete(`/calendar/tags/${id}`);
  },

  // 获取提醒规则列表
  getReminderRules: async (): Promise<ReminderRule[]> => {
    const response = await api.get('/calendar/reminder-rules');
    return response.data;
  },

  // 创建提醒规则
  createReminderRule: async (rule: Partial<ReminderRule>): Promise<ReminderRule> => {
    const response = await api.post('/calendar/reminder-rules', rule);
    return response.data;
  },

  // 更新提醒规则
  updateReminderRule: async (id: string, rule: Partial<ReminderRule>): Promise<ReminderRule> => {
    const response = await api.put(`/calendar/reminder-rules/${id}`, rule);
    return response.data;
  },

  // 删除提醒规则
  deleteReminderRule: async (id: string): Promise<void> => {
    await api.delete(`/calendar/reminder-rules/${id}`);
  },

  // 获取提醒历史记录
  getReminderHistory: async (): Promise<ReminderHistory[]> => {
    const response = await api.get('/calendar/reminder-history');
    return response.data;
  },
}; 