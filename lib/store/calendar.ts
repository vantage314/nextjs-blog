import { create } from 'zustand';
import { InvestmentEvent, EventFilter, EventCategory, EventTag, ReminderRule, ReminderHistory } from '@/types/calendar';
import { calendarApi } from '@/lib/api/calendar';

interface CalendarState {
  events: InvestmentEvent[];
  categories: EventCategory[];
  tags: EventTag[];
  reminderRules: ReminderRule[];
  reminderHistory: ReminderHistory[];
  selectedDate: Date | null;
  filter: EventFilter;
  isLoading: boolean;
  error: string | null;
  setSelectedDate: (date: Date | null) => void;
  setFilter: (filter: Partial<EventFilter>) => void;
  fetchEvents: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchReminderRules: () => Promise<void>;
  fetchReminderHistory: () => Promise<void>;
  createEvent: (event: Partial<InvestmentEvent>) => Promise<void>;
  updateEvent: (id: string, event: Partial<InvestmentEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  createCategory: (category: Partial<EventCategory>) => Promise<void>;
  updateCategory: (id: string, category: Partial<EventCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createTag: (tag: Partial<EventTag>) => Promise<void>;
  updateTag: (id: string, tag: Partial<EventTag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  createReminderRule: (rule: Partial<ReminderRule>) => Promise<void>;
  updateReminderRule: (id: string, rule: Partial<ReminderRule>) => Promise<void>;
  deleteReminderRule: (id: string) => Promise<void>;
  importEvents: (events: InvestmentEvent[]) => Promise<void>;
  exportEvents: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  categories: [],
  tags: [],
  reminderRules: [],
  reminderHistory: [],
  selectedDate: null,
  filter: {},
  isLoading: false,
  error: null,

  setSelectedDate: (date) => set({ selectedDate: date }),

  setFilter: (filter) => {
    const currentFilter = get().filter;
    set({ filter: { ...currentFilter, ...filter } });
    get().fetchEvents();
  },

  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      const { events } = await calendarApi.getEvents(get().filter);
      set({ events, isLoading: false });
    } catch (error) {
      set({ error: '获取事件列表失败', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const categories = await calendarApi.getCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: '获取分类列表失败', isLoading: false });
    }
  },

  fetchTags: async () => {
    try {
      set({ isLoading: true, error: null });
      const tags = await calendarApi.getTags();
      set({ tags, isLoading: false });
    } catch (error) {
      set({ error: '获取标签列表失败', isLoading: false });
    }
  },

  fetchReminderRules: async () => {
    try {
      set({ isLoading: true, error: null });
      const rules = await calendarApi.getReminderRules();
      set({ reminderRules: rules, isLoading: false });
    } catch (error) {
      set({ error: '获取提醒规则列表失败', isLoading: false });
    }
  },

  fetchReminderHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      const history = await calendarApi.getReminderHistory();
      set({ reminderHistory: history, isLoading: false });
    } catch (error) {
      set({ error: '获取提醒历史记录失败', isLoading: false });
    }
  },

  createEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.createEvent(event);
      await get().fetchEvents();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '创建事件失败', isLoading: false });
    }
  },

  updateEvent: async (id, event) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.updateEvent(id, event);
      await get().fetchEvents();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '更新事件失败', isLoading: false });
    }
  },

  deleteEvent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.deleteEvent(id);
      await get().fetchEvents();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '删除事件失败', isLoading: false });
    }
  },

  createCategory: async (category) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.createCategory(category);
      await get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '创建分类失败', isLoading: false });
    }
  },

  updateCategory: async (id, category) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.updateCategory(id, category);
      await get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '更新分类失败', isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.deleteCategory(id);
      await get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '删除分类失败', isLoading: false });
    }
  },

  createTag: async (tag) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.createTag(tag);
      await get().fetchTags();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '创建标签失败', isLoading: false });
    }
  },

  updateTag: async (id, tag) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.updateTag(id, tag);
      await get().fetchTags();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '更新标签失败', isLoading: false });
    }
  },

  deleteTag: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.deleteTag(id);
      await get().fetchTags();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '删除标签失败', isLoading: false });
    }
  },

  createReminderRule: async (rule) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.createReminderRule(rule);
      await get().fetchReminderRules();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '创建提醒规则失败', isLoading: false });
    }
  },

  updateReminderRule: async (id, rule) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.updateReminderRule(id, rule);
      await get().fetchReminderRules();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '更新提醒规则失败', isLoading: false });
    }
  },

  deleteReminderRule: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.deleteReminderRule(id);
      await get().fetchReminderRules();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '删除提醒规则失败', isLoading: false });
    }
  },

  importEvents: async (events) => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.importEvents(events);
      await get().fetchEvents();
      set({ isLoading: false });
    } catch (error) {
      set({ error: '导入事件失败', isLoading: false });
    }
  },

  exportEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      await calendarApi.exportEvents(get().filter);
      set({ isLoading: false });
    } catch (error) {
      set({ error: '导出事件失败', isLoading: false });
    }
  },
})); 