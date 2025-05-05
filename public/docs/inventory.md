# 인벤토리 관리 시스템

리그린의 인벤토리 관리 시스템은 상점 주인이 할인 상품을 등록하고 관리할 수 있는 기능을 제공합니다.

## 주요 파일

- `src/app/inventory/page.tsx`: 인벤토리 목록 페이지
- `src/app/inventory/register/page.tsx`: 상품 등록 페이지
- `src/app/inventory/[id]/page.tsx`: 상품 상세 페이지
- `src/app/inventory/[id]/edit/page.tsx`: 상품 편집 페이지
- `src/components/custom/inventory-card.tsx`: 인벤토리 카드 컴포넌트
- `src/components/custom/inventory-form.tsx`: 인벤토리 등록/수정 폼 컴포넌트

## 인벤토리 관리 기능

### 상품 등록

상점 주인은 다음 정보를 포함하여 상품을 등록할 수 있습니다:

- 상품명
- 상품 설명
- 원래 가격
- 할인 가격
- 수량
- 유통기한
- 이미지

```tsx
// 상품 등록 폼 스키마
const inventoryFormSchema = z.object({
  name: z.string().min(1, "상품명은 필수입니다."),
  description: z.string(),
  originalPrice: z.number().min(0, "가격은 0 이상이어야 합니다."),
  discountPrice: z.number().min(0, "가격은 0 이상이어야 합니다."),
  quantity: z.number().int().min(1, "수량은 최소 1개 이상이어야 합니다."),
  expiryDate: z.date()
});
```

### 상품 목록 조회

상점 주인은 자신이 등록한 모든 상품을 조회할 수 있으며, 다음과 같은 필터링 및 정렬 옵션을 제공합니다:

- 마감 임박순
- 할인율 높은순
- 최신 등록순
- 소진된 상품 포함/제외

```tsx
// 인벤토리 목록 컴포넌트 예시
function InventoryList() {
  const [filter, setFilter] = useState("all"); // all, active, expired
  const [sort, setSort] = useState("expiring-soon"); // expiring-soon, discount, newest
  
  // ... 필터링 및 정렬 로직
  
  return (
    <div>
      {/* 필터 및 정렬 UI */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <InventoryCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
```

### 상품 상세 정보

상품 상세 페이지에서는 다음 정보를 제공합니다:

- 상품의 모든 정보 (이름, 설명, 가격 등)
- 예약 현황
- 상품 수정 및 삭제 옵션
- 상품 상태 변경 (재고 변경, 판매 중지 등)

### 이미지 업로드

상품 이미지 업로드는 다음 기능을 포함합니다:

- 이미지 미리보기
- 다중 이미지 업로드 (추후 구현 예정)
- 이미지 크롭 기능 (추후 구현 예정)

## 구현 예시

### 인벤토리 등록 페이지

인벤토리 등록 페이지는 React Hook Form과 Zod를 사용하여 폼 데이터를 검증하고 제출합니다.

```tsx
export default function InventoryRegisterPage() {
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      originalPrice: 0,
      discountPrice: 0,
      quantity: 1,
      expiryDate: new Date()
    }
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 이미지 업로드 처리 로직
  };
  
  const onSubmit = async (data: InventoryFormValues) => {
    // 폼 제출 처리 로직
  };
  
  return (
    // Form UI 구현
  );
}
```

## 데이터 모델

인벤토리 아이템의 데이터 모델은 다음과 같습니다:

```typescript
interface InventoryItem {
  id: string;
  shopId: string;
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number; // 계산값
  quantity: number;
  expiryDate: Date;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "sold_out" | "expired" | "deleted";
}
```

## 향후 개선 계획

- 바코드 스캔을 통한 상품 등록
- 재고 자동 관리 기능
- 상품 통계 및 분석
- 카테고리 분류 기능
- 유사 상품 추천 알고리즘 