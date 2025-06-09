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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { EventCategory, EventTag } from '@/types/calendar';

export function CategoryManager() {
  const {
    categories,
    tags,
    createCategory,
    updateCategory,
    deleteCategory,
    createTag,
    updateTag,
    deleteTag,
  } = useCalendarStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [editingCategory, setEditingCategory] = useState<Partial<EventCategory> | null>(null);
  const [editingTag, setEditingTag] = useState<Partial<EventTag> | null>(null);

  const handleCreateCategory = async () => {
    if (editingCategory?.name) {
      await createCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  const handleUpdateCategory = async (category: EventCategory) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('确定要删除这个分类吗？')) {
      await deleteCategory(id);
    }
  };

  const handleCreateTag = async () => {
    if (editingTag?.name) {
      await createTag(editingTag);
      setEditingTag(null);
    }
  };

  const handleUpdateTag = async (tag: EventTag) => {
    setEditingTag(tag);
  };

  const handleDeleteTag = async (id: string) => {
    if (confirm('确定要删除这个标签吗？')) {
      await deleteTag(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">管理分类和标签</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>管理分类和标签</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">分类</TabsTrigger>
            <TabsTrigger value="tags">标签</TabsTrigger>
          </TabsList>
          <TabsContent value="categories" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="输入分类名称"
                value={editingCategory?.name || ''}
                onChange={(e) =>
                  setEditingCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <Button onClick={handleCreateCategory}>
                <Plus className="h-4 w-4 mr-2" />
                添加
              </Button>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tags" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="输入标签名称"
                value={editingTag?.name || ''}
                onChange={(e) =>
                  setEditingTag((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <Button onClick={handleCreateTag}>
                <Plus className="h-4 w-4 mr-2" />
                添加
              </Button>
            </div>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateTag(tag)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 