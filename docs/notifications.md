# 알림 시스템

리그린의 알림 시스템은 Server-Sent Events(SSE)를 기반으로 하여 실시간 알림을 제공합니다.

## 주요 파일

- `src/app/api/notifications/sse/route.ts`: SSE API 라우트 구현
- `src/app/api/notifications/subscriptions/route.ts`: 알림 구독 관리 API
- `src/components/notification/notification-provider.tsx`: 알림 상태 관리 Provider
- `src/components/notification/notification-bell.tsx`: 알림 UI 컴포넌트
- `src/components/notification/notification-dialog.tsx`: 알림 목록 및 상세 보기

## 알림 유형

다음과 같은 알림 유형을 지원합니다:

- `RESERVATION_REQUEST`: 새로운 예약 요청 (상점 주인에게 전송)
- `RESERVATION_APPROVED`: 예약 승인 (소비자에게 전송)
- `RESERVATION_REJECTED`: 예약 거절 (소비자에게 전송)
- `RESERVATION_COMPLETED`: 예약 완료 (양쪽 모두에게 전송)
- `INVENTORY_UPDATED`: 재고 업데이트 (구독자에게 전송)
- `INVENTORY_LOW_STOCK`: 재고 부족 알림 (상점 주인에게 전송)

## 기술적 구현

### 서버 측

1. **SSE 엔드포인트**: `/api/notifications/sse` 엔드포인트는 클라이언트의 연결 요청을 처리합니다.
2. **클라이언트 연결 관리**: 각 사용자 ID별로 연결을 저장 및 관리합니다.
3. **알림 전송**: `sendNotification` 함수를 통해 특정 사용자에게 알림을 전송합니다.
4. **구독 관리**: 특정 상점의 재고 변경에 대한 알림을 구독/취소할 수 있습니다.

### 클라이언트 측

1. **NotificationProvider**: 애플리케이션 전체에서 알림 상태를 관리하고 SSE 연결을 설정합니다.
2. **연결 관리**: 최대 재시도 횟수, 백오프 전략 등을 통해 안정적인 연결을 유지합니다.
3. **알림 UI**: 읽지 않은 알림 개수를 표시하고, 알림 목록을 볼 수 있는 UI를 제공합니다.
4. **브라우저 알림**: Web Notification API를 통해 브라우저 알림을 표시합니다.

## 사용법

### 알림 Provider 설정

```tsx
// MobileLayout.tsx
import NotificationProvider from "@/components/notification/notification-provider";

function MobileLayout({ children, userId }) {
  return (
    <NotificationProvider userId={userId}>
      {children}
    </NotificationProvider>
  );
}
```

### 알림 훅 사용

```tsx
// 컴포넌트에서 알림 사용
import { useNotifications } from "@/components/notification";

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <h2>알림 ({unreadCount})</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} onClick={() => markAsRead(notification.id)}>
            {notification.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 상점 구독 설정

```tsx
// 상점 구독 버튼
import { useSubscription } from "@/hooks/useSubscription";

function SubscribeButton({ shopId, shopName }) {
  const { isSubscribed, toggleSubscription } = useSubscription(shopId);
  
  return (
    <button onClick={toggleSubscription}>
      {isSubscribed ? "구독 취소" : "구독하기"}
    </button>
  );
}
```

## 최적화 및 개선 사항

1. **최대 재시도 횟수**: 연결 실패 시 무한 재시도를 방지하기 위해 최대 재시도 횟수를 제한합니다.
2. **지수적 백오프**: 연결 실패 후 점점 더 긴 간격으로 재시도합니다.
3. **연결 청소**: 중복 연결 및 불필요한 연결을 방지하기 위한 메커니즘이 구현되어 있습니다.
4. **조건부 활성화**: 사용자가 로그인한 경우에만 알림 시스템이 활성화됩니다. 