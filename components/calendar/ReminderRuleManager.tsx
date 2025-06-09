'use client';

import { useState } from 'react';
import { useCalendarStore } from '@/lib/store/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { ReminderRule } from '@/types/calendar';

interface ReminderRuleManagerProps {
  eventId: string;
  onUpdate?: () => void;
}

export function ReminderRuleManager({ eventId, onUpdate }: ReminderRuleManagerProps) {
  const {
    createReminderRule,
    updateReminderRule,
    deleteReminderRule,
    reminderRules,
  } = useCalendarStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<ReminderRule> | null>(null);

  const handleCreateRule = async () => {
    if (editingRule?.type && editingRule?.time) {
      await createReminderRule({
        ...editingRule,
        eventId,
        status: 'pending',
        retryCount: 0,
      });
      setEditingRule(null);
      onUpdate?.();
    }
  };

  const handleUpdateRule = async (rule: ReminderRule) => {
    setEditingRule(rule);
  };

  const handleDeleteRule = async (id: string) => {
    if (confirm('确定要删除这个提醒规则吗？')) {
      await deleteReminderRule(id);
      onUpdate?.();
    }
  };

  const eventRules = reminderRules.filter((rule) => rule.eventId === eventId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">管理提醒规则</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>管理提醒规则</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={editingRule?.type}
              onValueChange={(value) =>
                setEditingRule((prev) => ({
                  ...prev,
                  type: value as 'email' | 'notification' | 'sms',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择提醒类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">邮件</SelectItem>
                <SelectItem value="notification">通知</SelectItem>
                <SelectItem value="sms">短信</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !editingRule?.time && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editingRule?.time ? (
                    format(editingRule.time, 'PPP HH:mm', { locale: zhCN })
                  ) : (
                    <span>选择提醒时间</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editingRule?.time}
                  onSelect={(date) =>
                    setEditingRule((prev) => ({
                      ...prev,
                      time: date,
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleCreateRule}>
              <Plus className="h-4 w-4 mr-2" />
              添加
            </Button>
          </div>
          <div className="space-y-2">
            {eventRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {rule.type === 'email'
                      ? '邮件'
                      : rule.type === 'notification'
                      ? '通知'
                      : '短信'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(rule.time, 'PPP HH:mm', { locale: zhCN })}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      rule.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : rule.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {rule.status === 'pending'
                      ? '待发送'
                      : rule.status === 'sent'
                      ? '已发送'
                      : '发送失败'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateRule(rule)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 