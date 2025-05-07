"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Calendar, Check, Info, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "./notification-provider";
import { NotificationType } from "@/app/api/notifications/sse/route";

// 알림 타입별 아이콘 매핑
const notificationIcons: Record<string, React.ReactNode> = {
  RESERVATION_REQUEST: <Calendar className="h-5 w-5 text-blue-500" />,
  RESERVATION_APPROVED: <Check className="h-5 w-5 text-green-500" />,
  RESERVATION_REJECTED: <X className="h-5 w-5 text-red-500" />,
  RESERVATION_COMPLETED: <Calendar className="h-5 w-5 text-orange-500" />,
  INVENTORY_UPDATED: <ShoppingBag className="h-5 w-5 text-purple-500" />,
  INVENTORY_LOW_STOCK: <ShoppingBag className="h-5 w-5 text-red-500" />,
  CONNECTED: <Bell className="h-5 w-5 text-gray-500" />,
};

// 알림 날짜 포맷팅
const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
}

export default function NotificationDialog({
  open,
  onOpenChange,
  isOwner = false,
}: NotificationDialogProps) {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const { notifications, unreadCount, markAsRead, markAllAsRead, sendTestNotification } = useNotifications();

  // // 탭별 필터링된 알림 목록
  // const filteredNotifications = notifications.filter((notification) => {
  //   if (selectedTab === "all") return true;
    
  //   if (selectedTab === "unread") {
  //     return !notification.isRead;
  //   }
    
  //   // 기타 탭은 알림 타입에 따라 필터링
  //   if (selectedTab === "reservation") {
  //     return notification.type.includes("RESERVATION");
  //   }
    
  //   if (selectedTab === "inventory") {
  //     return notification.type.includes("INVENTORY");
  //   }
    
  //   return notification.type === selectedTab;
  // });

  // 알림 클릭 처리
  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  // 테스트 알림 전송 (개발 중에만 사용)
  const handleSendTestNotification = () => {
    if (isOwner) {
      sendTestNotification(
        "RESERVATION_REQUEST", 
        "새로운 예약 요청", 
        "홍길동님이 유기농 당근 2개를 예약했습니다."
      );
    } else {
      sendTestNotification(
        "RESERVATION_APPROVED", 
        "예약이 승인되었습니다", 
        "유기농 당근 2개 예약이 승인되었습니다. 12월 30일 14:30에 픽업해주세요."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>알림</span>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  모두 읽음 표시
                </Button>
              )}
              <DialogClose>
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">
              전체
              {unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reservation">예약</TabsTrigger>
            <TabsTrigger value="inventory">재고</TabsTrigger>
            <TabsTrigger value="unread">읽지않음</TabsTrigger>
          </TabsList> */}
          
          <div className="mt-0">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                알림이 없습니다
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start p-3 rounded-lg cursor-pointer transition-colors",
                      !notification.isRead
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900"
                    )}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="mr-3 mt-0.5">
                      {notificationIcons[notification.type] || <Bell className="h-5 w-5 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 ml-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        {/* </Tabs> */}
        
        {/* {process.env.NODE_ENV === 'development' && ( */}
          <div className="pt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleSendTestNotification}>
              테스트 알림 보내기
            </Button>
          </div>
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
} 