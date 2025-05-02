"use client";

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from './notification-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationDialog from './notification-dialog';

interface NotificationBellProps {
  isOwner?: boolean;
}

export function NotificationBell({ isOwner = false }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { unreadCount, connected } = useNotifications();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="알림"
      >
        <Bell size={20} className={connected ? "text-primary" : "text-muted-foreground"} />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 px-1.5 min-w-[1rem] h-4 flex items-center justify-center text-[0.65rem]"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      <NotificationDialog open={open} onOpenChange={setOpen} notifications={[]} onReadAll={() => {}} onNotificationClick={() => {}} />
    </>
  );
} 