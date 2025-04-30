import React from "react";
import Link from "next/link";
import { Bell, CheckCheck, Calendar, Store, Tag, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = 
  | "reservation_confirmed" 
  | "reservation_cancelled" 
  | "reservation_reminder" 
  | "new_discount" 
  | "promo" 
  | "system";

type NotificationItemProps = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
  className?: string;
  onRead?: (id: string) => void;
};

const NotificationItem = ({
  id,
  type,
  title,
  message,
  time,
  isRead,
  actionUrl,
  className,
  onRead,
}: NotificationItemProps) => {
  // 알림 유형에 따른 아이콘 설정
  const getIcon = () => {
    switch (type) {
      case "reservation_confirmed":
        return <CheckCheck className="text-green-500" />;
      case "reservation_cancelled":
        return <AlertCircle className="text-red-500" />;
      case "reservation_reminder":
        return <Calendar className="text-blue-500" />;
      case "new_discount":
        return <Tag className="text-purple-500" />;
      case "promo":
        return <Store className="text-amber-500" />;
      case "system":
        return <Info className="text-gray-500" />;
      default:
        return <Bell className="text-[#5DCA69]" />;
    }
  };

  // 읽음 상태에 따른 배경색 설정
  const getBgColor = () => {
    return isRead ? "" : "bg-blue-50 bg-blue-900/20";
  };
  
  // 컨테이너 클릭 핸들러
  const handleClick = () => {
    if (!isRead && onRead) {
      onRead(id);
    }
  };

  const content = (
    <div
      className={cn(
        "p-4 border-b border-[#e1e7ef] border-[#303642] transition-colors",
        getBgColor(),
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#f1f5f9] bg-[#334155] flex items-center justify-center">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0f172a] text-white text-sm">{title}</h3>
            <span className="text-xs text-[#64748b] text-[#94a3b8] whitespace-nowrap ml-2">
              {time}
            </span>
          </div>
          
          <p className="text-sm text-[#64748b] text-[#94a3b8] mt-1 line-clamp-2">
            {message}
          </p>
          
          {!isRead && onRead && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRead(id);
              }}
              className="text-xs text-[#5b87f0] mt-2 hover:underline"
            >
              읽음 표시
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (actionUrl) {
    return (
      <Link href={actionUrl}>
        {content}
      </Link>
    );
  }

  return content;
};

export { NotificationItem }; 