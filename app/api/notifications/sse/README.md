# RE-GREEN 알림 시스템 가이드

RE-GREEN 앱에서는 Server-Sent Events(SSE)를 활용한 실시간 알림 시스템을 구현했습니다. 이 문서에서는 알림 시스템의 사용법과 구조에 대해 설명합니다.

## 구현된 기능

1. 클라이언트-서버 간 SSE 기반 실시간 알림 전송
2. 브라우저 알림 (Notification API) 지원
3. 알림 읽음 상태 관리
4. 알림 필터링 및 카테고리 분류
5. 개발 환경에서 테스트 알림 전송 기능
6. 특정 가게 재고 알림 구독 기능
7. 구독 중인 가게 관리 기능

## 알림 타입

시스템은 다음과 같은 알림 타입을 지원합니다:

- `RESERVATION_REQUEST`: 새로운 예약 요청
- `RESERVATION_APPROVED`: 예약 승인
- `RESERVATION_REJECTED`: 예약 거절
- `RESERVATION_COMPLETED`: 예약 완료
- `INVENTORY_UPDATED`: 재고 업데이트
- `INVENTORY_LOW_STOCK`: 재고 부족 알림

## 시스템 구조

### 서버 측 (API 라우트)

- `src/app/api/notifications/sse/route.ts`: SSE 엔드포인트 구현
  - `GET`: SSE 연결 설정
  - `POST`: 알림 전송 테스트용 API
- `src/app/api/notifications/subscriptions/route.ts`: 구독 관리 API
  - `GET`: 구독 상태 확인 및 목록 조회
  - `POST`: 구독 추가
  - `DELETE`: 구독 취소
- `src/app/api/notifications/inventory/route.ts`: 재고 알림 전송 API
  - `POST`: 구독자에게 재고 관련 알림 전송

### 클라이언트 측

- `src/components/notification/notification-provider.tsx`: 알림 컨텍스트 제공
- `src/components/notification/notification-bell.tsx`: 알림 벨 UI 컴포넌트
- `src/components/notification/notification-dialog.tsx`: 알림 목록 및 상세 정보 표시
- `src/components/shop/subscription-button.tsx`: 가게 구독 토글 버튼
- `src/hooks/useSubscription.ts`: 구독 상태 관리 커스텀 훅
- `src/hooks/useSubscriptionList.ts`: a구독 목록 관리 커스텀 훅

## 사용법

### 1. 레이아웃에 NotificationProvider 추가

```tsx
import { NotificationProvider } from "@/components/notification";

export default function Layout({ children }) {
  return (
    <NotificationProvider userId="user-1">
      {children}
    </NotificationProvider>
  );
}
```

### 2. 알림 벨 컴포넌트 사용

```tsx
import { NotificationBell } from "@/components/notification";

export default function Header() {
  return (
    <header>
      <NotificationBell isOwner={false} />
    </header>
  );
}
```

### 3. useNotifications 훅 사용

```tsx
import { useNotifications } from "@/components/notification";

export default function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  return (
    <div>
      <p>읽지 않은 알림: {unreadCount}</p>
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

### 4. 구독 버튼 컴포넌트 사용

```tsx
import { SubscriptionButton } from '@/components/shop/subscription-button';

export default function ShopPage({ shop }) {
  return (
    <div>
      <h1>{shop.name}</h1>
      <SubscriptionButton
        userId="user-1"
        shopId={shop.id}
        shopName={shop.name}
      />
    </div>
  );
}
```

### 5. 서버에서 알림 전송 (서버 코드 내부)

```ts
import { sendNotification } from "@/app/api/notifications/sse/route";

// 서버 내부에서 알림 전송 (예: 예약 처리 로직 내부)
await sendNotification(userId, {
  id: crypto.randomUUID(),
  userId,
  type: "RESERVATION_APPROVED",
  title: "예약이 승인되었습니다",
  message: "12월 30일 14:30에 픽업해주세요.",
  isRead: false,
  createdAt: new Date().toISOString(),
});
```

### 6. 재고 변경 시 구독자에게 알림 전송

```ts
// 재고 등록/수정 API 내부에서 호출
const response = await fetch('/api/notifications/inventory', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    shopId: '123',
    shopName: '지구샵 강남점',
    productId: '456',
    productName: '친환경 대나무 칫솔',
    action: 'add', // 'add', 'update', 'low_stock', 'expired'
    price: 5000,
    discountPrice: 4000,
    imageUrl: 'https://example.com/image.jpg'
  }),
});
```

## 알림 시스템 확장

추가 기능 구현 시 고려할 사항:

1. **데이터베이스 연동**: 알림 기록 및 구독 정보 저장/불러오기
2. **푸시 알림**: 모바일 기기를 위한 FCM/APNS 연동
3. **알림 템플릿**: 일관된 알림 메시지 형식화
4. **사용자 설정**: 알림 수신 여부 및 타입별 설정
5. **배치 처리**: 알림 전송 실패 시 재시도 로직
6. **구독 필터링**: 특정 조건(카테고리, 가격 등)에 따른 구독 설정

## 테스트 방법

1. 개발 환경에서는 알림 다이얼로그에 '테스트 알림 보내기' 버튼이 표시됩니다. 
   이 버튼을 클릭하여 실시간 알림 전송을 테스트할 수 있습니다.
