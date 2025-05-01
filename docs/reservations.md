# 예약 시스템

리그린의 예약 시스템은 소비자가 할인 상품을 예약하고, 상점 주인이 예약을 관리할 수 있는 기능을 제공합니다.

## 주요 파일

- `src/app/reservations/page.tsx`: 예약 목록 페이지
- `src/app/reservations/[id]/page.tsx`: 예약 상세 페이지
- `src/app/reservations/create/page.tsx`: 예약 생성 페이지
- `src/components/custom/reservation-card.tsx`: 예약 카드 컴포넌트
- `src/components/custom/reservation-list.tsx`: 예약 목록 컴포넌트
- `src/components/custom/reservation-form.tsx`: 예약 폼 컴포넌트

## 예약 시스템 기능

### 예약 생성

소비자는 다음 단계로 상품을 예약합니다:

1. 상품 상세 페이지에서 예약 시작
2. 수량 선택
3. 픽업 일시 선택
4. 연락처 정보 확인
5. 예약 요청 제출

```tsx
// 예약 폼 스키마 예시
const reservationFormSchema = z.object({
  quantity: z.number().min(1, "최소 1개 이상 선택해야 합니다."),
  pickupDate: z.date().min(new Date(), "현재 시간 이후로 선택해야 합니다."),
  pickupTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "유효한 시간 형식이 아닙니다."),
  contactPhone: z.string().regex(/^\d{3}-\d{3,4}-\d{4}$/, "유효한 전화번호 형식이 아닙니다."),
  note: z.string().optional()
});
```

### 예약 목록 조회

사용자 유형에 따라 다른 예약 목록을 제공합니다:

- **소비자**: 자신의 예약 목록 조회
- **상점 주인**: 자신의 상점에 들어온 예약 목록 조회

예약 목록은 상태별로 필터링할 수 있습니다:
- 대기 중
- 승인됨
- 거절됨
- 완료됨
- 취소됨

```tsx
// 예약 목록 컴포넌트 예시
function ReservationList() {
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected, completed, cancelled
  
  return (
    <div>
      {/* 필터 UI */}
      <div className="space-y-4">
        {filteredReservations.map(reservation => (
          <ReservationCard key={reservation.id} {...reservation} />
        ))}
      </div>
    </div>
  );
}
```

### 예약 상세 정보

예약 상세 페이지에서는 다음 정보를 제공합니다:

- 예약 상태
- 상품 정보
- 픽업 정보 (일시 및 장소)
- 상점 정보
- 고객 정보
- 결제 정보
- 예약 관리 옵션 (승인, 거절, 완료, 취소)

### 예약 상태 관리

예약은 다음과 같은 상태를 가질 수 있습니다:

- `PENDING`: 대기 중
- `APPROVED`: 승인됨
- `REJECTED`: 거절됨
- `COMPLETED`: 완료됨
- `CANCELLED`: 취소됨

각 상태 전환은 권한 체크 후 이루어지며, 상태 변경 시 관련 사용자에게 알림이 전송됩니다.

## 구현 예시

### 예약 상세 페이지

```tsx
export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 예약 정보 로딩
  useEffect(() => {
    // API에서 예약 정보 가져오기
  }, [id]);
  
  // 예약 상태 변경 함수
  const handleStatusChange = async (newStatus: ReservationStatus) => {
    // API를 통해 상태 변경 요청
  };
  
  // 결제 처리 함수 (아직 구현되지 않음)
  const handlePayment = async () => {
    // 결제 처리 로직
  };
  
  if (isLoading) return <LoadingSkeleton />;
  if (!reservation) return <NotFound />;
  
  return (
    <div>
      {/* 예약 상세 정보 UI */}
      
      {/* 상태에 따른 액션 버튼 */}
      {reservation.status === "PENDING" && isShopOwner && (
        <div className="flex gap-2">
          <Button onClick={() => handleStatusChange("APPROVED")}>승인</Button>
          <Button variant="destructive" onClick={() => handleStatusChange("REJECTED")}>거절</Button>
        </div>
      )}
      
      {reservation.status === "APPROVED" && (
        <Button onClick={() => handleStatusChange("COMPLETED")}>픽업 완료</Button>
      )}
      
      {(reservation.status === "PENDING" || reservation.status === "APPROVED") && !isShopOwner && (
        <Button variant="destructive" onClick={() => handleStatusChange("CANCELLED")}>예약 취소</Button>
      )}
    </div>
  );
}
```

## 데이터 모델

예약의 데이터 모델은 다음과 같습니다:

```typescript
interface Reservation {
  id: string;
  inventoryId: string;
  customerId: string;
  shopId: string;
  quantity: number;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  pickupDate: Date;
  pickupTime: string;
  contactPhone: string;
  note?: string;
  paymentId?: string;
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: Date;
  updatedAt: Date;
}
```

## 향후 개선 계획

- QR 코드를 이용한 픽업 확인 시스템
- 결제 시스템 연동
- 반복 예약 기능
- 상점 영업 시간 기반 픽업 시간 지정
- 리뷰 및 평점 시스템 