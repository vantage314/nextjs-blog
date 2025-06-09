'use client';

import { useState, useEffect } from 'react';
import { useCalendarStore } from '@/lib/store/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { CalendarIcon, Search, Filter, X } from 'lucide-react';
import { EventType } from '@/types/calendar';

export function EventFilter() {
  const { filter, setFilter, categories, tags, fetchCategories, fetchTags } = useCalendarStore();
  const [searchTerm, setSearchTerm] = useState(filter.search || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  const handleSearch = () => {
    setFilter({ search: searchTerm });
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilter({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索事件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter className="h-4 w-4 mr-2" />
          筛选
        </Button>
        {(searchTerm || Object.keys(filter).length > 0) && (
          <Button variant="ghost" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            清除
          </Button>
        )}
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">日期范围</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filter.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.startDate ? (
                      format(filter.startDate, 'PPP', { locale: zhCN })
                    ) : (
                      <span>开始日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filter.startDate}
                    onSelect={(date) => setFilter({ startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filter.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.endDate ? (
                      format(filter.endDate, 'PPP', { locale: zhCN })
                    ) : (
                      <span>结束日期</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filter.endDate}
                    onSelect={(date) => setFilter({ endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">事件类型</label>
            <Select
              value={filter.eventTypes?.[0]}
              onValueChange={(value) => setFilter({ eventTypes: [value as EventType] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dividend">分红</SelectItem>
                <SelectItem value="earnings">财报</SelectItem>
                <SelectItem value="ipo">IPO</SelectItem>
                <SelectItem value="meeting">会议</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">分类</label>
            <Select
              value={filter.categoryIds?.[0]}
              onValueChange={(value) => setFilter({ categoryIds: [value] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">标签</label>
            <Select
              value={filter.tagIds?.[0]}
              onValueChange={(value) => setFilter({ tagIds: [value] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择标签" />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">提醒</label>
            <Select
              value={filter.hasReminder?.toString()}
              onValueChange={(value) => setFilter({ hasReminder: value === 'true' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择提醒状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">已设置提醒</SelectItem>
                <SelectItem value="false">未设置提醒</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
} 