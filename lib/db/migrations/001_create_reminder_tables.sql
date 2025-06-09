-- 创建提醒模板表
CREATE TABLE IF NOT EXISTS reminder_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('email', 'notification', 'sms')),
  content TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建提醒队列表
CREATE TABLE IF NOT EXISTS reminder_queue (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'notification', 'sms')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  scheduled_time TIMESTAMP NOT NULL,
  sent_time TIMESTAMP,
  error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建提醒历史表
CREATE TABLE IF NOT EXISTS reminder_history (
  id TEXT PRIMARY KEY,
  queue_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'notification', 'sms')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  sent_time TIMESTAMP NOT NULL,
  error TEXT,
  response_time INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建提醒统计表
CREATE TABLE IF NOT EXISTS reminder_stats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  total_reminders INTEGER NOT NULL DEFAULT 0,
  sent_reminders INTEGER NOT NULL DEFAULT 0,
  failed_reminders INTEGER NOT NULL DEFAULT 0,
  average_response_time INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_reminder_queue_user_id ON reminder_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_queue_event_id ON reminder_queue(event_id);
CREATE INDEX IF NOT EXISTS idx_reminder_queue_status ON reminder_queue(status);
CREATE INDEX IF NOT EXISTS idx_reminder_queue_scheduled_time ON reminder_queue(scheduled_time);

CREATE INDEX IF NOT EXISTS idx_reminder_history_user_id ON reminder_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_history_event_id ON reminder_history(event_id);
CREATE INDEX IF NOT EXISTS idx_reminder_history_sent_time ON reminder_history(sent_time);

CREATE INDEX IF NOT EXISTS idx_reminder_stats_user_id ON reminder_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_stats_date ON reminder_stats(date);

-- 创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
CREATE TRIGGER update_reminder_templates_updated_at
  BEFORE UPDATE ON reminder_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminder_queue_updated_at
  BEFORE UPDATE ON reminder_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminder_stats_updated_at
  BEFORE UPDATE ON reminder_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 