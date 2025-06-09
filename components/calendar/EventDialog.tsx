'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { InvestmentEvent } from '@/types/calendar';
import { useState } from 'react';

interface EventDialogProps {
  children: React.ReactNode;
  onSubmit: (data: Partial<InvestmentEvent>) => void;
  initialData?: Partial<InvestmentEvent>;
}

export function EventDialog({
  children,
  onSubmit,
  initialData,
}: EventDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: Partial<InvestmentEvent>) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? '编辑事件' : '添加事件'}
          </DialogTitle>
        </DialogHeader>
        <EventForm onSubmit={handleSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
} 