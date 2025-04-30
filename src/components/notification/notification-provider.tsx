"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import type { Notification as AppNotification, NotificationType } from '@/app/api/notifications/sse/route';

// 알림 컨텍스트 타입 정의
interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  connected: boolean;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  sendTestNotification: (type: NotificationType, title: string, message: string) => Promise<void>;
}

// 기본값 생성
const defaultContext: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  connected: false,
  markAsRead: () => {},
  markAllAsRead: () => {},
  sendTestNotification: async () => {},
};

// 컨텍스트 생성
const NotificationContext = createContext<NotificationContextType>(defaultContext);

// 컨텍스트 훅
export const useNotifications = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
  userId: string;
}

const NotificationProvider = ({ children, userId }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 알림을 읽음으로 표시
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 모든 알림을 읽음으로 표시
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // 테스트용 알림 전송 함수
  const sendTestNotification = async (type: NotificationType, title: string, message: string) => {
    try {
      const response = await fetch('/api/notifications/sse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          title,
          message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('알림 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('알림 전송 오류:', error);
    }
  };

  // SSE 연결 설정
  useEffect(() => {
    if (!userId || userId === "null" || userId === "undefined") return;

    // 이미 연결되어 있으면 중복 연결 방지
    if (eventSource) return;

    // 브라우저 호환성 체크
    if (!window.EventSource) {
      console.error('이 브라우저는 Server-Sent Events를 지원하지 않습니다.');
      return;
    }

    // 이벤트 소스 생성
    const sse = new EventSource(`/api/notifications/sse?userId=${userId}`);
    setEventSource(sse);

    // 연결 이벤트 핸들러
    sse.onopen = () => {
      console.log('알림 서버에 연결되었습니다.');
      setConnected(true);
      retryCountRef.current = 0; // 연결 성공 시 재시도 횟수 초기화
    };

    // 메시지 이벤트 핸들러
    sse.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        
        if (notification.type === 'CONNECTED') {
          console.log(notification.message);
        } else {
          // 새 알림 추가
          setNotifications(prev => [notification, ...prev]);
          
          // 브라우저 알림 표시 (권한 있을 경우)
          if (window.Notification && window.Notification.permission === 'granted') {
            new window.Notification(notification.title, {
              body: notification.message,
            });
          }
        }
      } catch (error) {
        console.error('알림 처리 오류:', error);
      }
    };

    // 오류 이벤트 핸들러
    sse.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      setConnected(false);
      
      // 연결 종료
      sse.close();
      setEventSource(null);
      
      // 최대 재시도 횟수 확인 후 재연결 시도
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        console.log(`알림 재연결 시도 ${retryCountRef.current}/${maxRetries}`);
        // 재시도 간격을 지수적으로 증가 (백오프 전략)
        const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        setTimeout(() => {
          // state 업데이트가 아닌 null 체크를 위해 의존성에서 제외
          if (!eventSource) {
            setEventSource(null); // 다음 useEffect 실행 트리거
          }
        }, retryDelay);
      } else {
        console.log('최대 재시도 횟수 초과. 알림 연결 중단.');
      }
    };

    // 클린업 함수
    return () => {
      sse.close();
      setEventSource(null);
      setConnected(false);
    };
  }, [userId]);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (window.Notification.permission !== 'granted' && window.Notification.permission !== 'denied') {
        window.Notification.requestPermission();
      }
    }
  }, []);

  // 컨텍스트 값
  const value = {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    sendTestNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 