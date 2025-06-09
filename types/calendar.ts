export type EventType = 'dividend' | 'earnings' | 'ipo' | 'meeting' | 'other';

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface EventTag {
  id: string;
  name: string;
  color: string;
}

export interface ReminderRule {
  id: string;
  eventId: string;
  type: 'email' | 'notification' | 'sms';
  time: Date;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
  lastRetryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderHistory {
  id: string;
  ruleId: string;
  eventId: string;
  type: 'email' | 'notification' | 'sms';
  status: 'success' | 'failed';
  error?: string;
  sentAt: Date;
}

export interface InvestmentEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: Date;
  eventType: EventType;
  categoryId?: string;
  tags: string[];
  reminder: boolean;
  reminderTime?: Date;
  reminderRules?: ReminderRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFilter {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  eventTypes?: EventType[];
  categoryIds?: string[];
  tagIds?: string[];
  hasReminder?: boolean;
}

export interface EventSearchResult {
  events: InvestmentEvent[];
  total: number;
  categories: EventCategory[];
  tags: EventTag[];
}

export interface EventStatistics {
  totalEvents: number;
  eventsByType: Record<EventType, number>;
  eventsByCategory: Record<string, number>;
  eventsByTag: Record<string, number>;
  eventsByMonth: Record<string, number>;
  eventsWithReminder: number;
  upcomingEvents: number;
}

export interface EventTemplate {
  id: string;
  name: string;
  description?: string;
  eventType: EventType;
  categoryId?: string;
  tags: string[];
  reminder: boolean;
  reminderTime?: Date;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventShare {
  id: string;
  eventId: string;
  shareType: 'link' | 'email' | 'user';
  shareWith: string;
  permissions: ('view' | 'edit' | 'delete')[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarFilters {
  types: EventType[];
  dateRange: {
    start: Date;
    end: Date;
  };
  showReminders: boolean;
} 