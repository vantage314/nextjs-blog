'use client';

import { useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { InvestmentEvent } from '@/types/calendar';
import { EventDialog } from './EventDialog';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useCalendarStore } from '@/lib/store/calendar';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { EventFilter } from './EventFilter';
import { CategoryManager } from './CategoryManager';

export function InvestmentCalendar() {
  const {
    events,
    selectedDate,
    isLoading,
    error,
    setSelectedDate,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    importEvents,
    exportEvents,
  } = useCalendarStore();

  // 初始化加载事件
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 处理文件导入
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/json': ['.json'],
    },
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const events = JSON.parse(e.target?.result as string);
            await importEvents(events);
            toast.success('导入成功');
          } catch (error) {
            toast.error('导入失败：无效的文件格式');
          }
        };
        reader.readAsText(file);
      } catch (error) {
        toast.error('导入失败');
      }
    },
  });

  // 处理导出
  const handleExport = async () => {
    try {
      await exportEvents();
      toast.success('导出成功');
    } catch (error) {
      toast.error('导出失败');
    }
  };

  // 处理事件创建
  const handleCreateEvent = async (event: Partial<InvestmentEvent>) => {
    try {
      await createEvent(event);
      toast.success('创建成功');
    } catch (error) {
      toast.error('创建失败');
    }
  };

  // 处理事件更新
  const handleUpdateEvent = async (id: string, event: Partial<InvestmentEvent>) => {
    try {
      await updateEvent(id, event);
      toast.success('更新成功');
    } catch (error) {
      toast.error('更新失败');
    }
  };

  // 处理事件删除
  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      toast.success('删除成功');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  // 获取当日事件
  const filteredEvents = events.filter(
    (event) =>
      selectedDate &&
      format(new Date(event.date), 'yyyy-MM-dd') ===
        format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">投资日历</h2>
        <div className="flex items-center gap-2">
          <CategoryManager />
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              导入
            </Button>
          </div>
          <EventDialog onSubmit={handleCreateEvent}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              添加事件
            </Button>
          </EventDialog>
        </div>
      </div>

      <EventFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
          />
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate
              ? `事件列表 (${selectedDate.toLocaleDateString()})`
              : '选择日期查看事件'}
          </h3>
          {isLoading ? (
            <div>加载中...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-2">
              {events
                .filter(
                  (event) =>
                    !selectedDate ||
                    new Date(event.eventDate).toDateString() ===
                      selectedDate.toDateString()
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <EventDialog
                        initialData={event}
                        onSubmit={(data) => handleUpdateEvent(event.id, data)}
                      >
                        <Button variant="ghost" size="sm">
                          编辑
                        </Button>
                      </EventDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 