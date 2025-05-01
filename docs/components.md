# 컴포넌트 구조

리그린 프로젝트는 재사용 가능한 컴포넌트를 기반으로 구축되었습니다. 컴포넌트는 다음과 같이 구성되어 있습니다.

## 디렉토리 구조

```
src/components/
├── custom/            # 프로젝트 전용 컴포넌트
├── layout/            # 레이아웃 관련 컴포넌트
├── ui/                # 기본 UI 컴포넌트 (shadcn/ui)
├── auth/              # 인증 관련 컴포넌트
├── notification/      # 알림 관련 컴포넌트
├── profile/           # 프로필 관련 컴포넌트
└── shop/              # 상점 관련 컴포넌트
```

## UI 컴포넌트 (src/components/ui)

shadcn/ui 라이브러리를 기반으로 한 기본 UI 컴포넌트들입니다.

- `button.tsx`: 버튼 컴포넌트
- `card.tsx`: 카드 컴포넌트
- `form.tsx`: 폼 관련 컴포넌트
- `input.tsx`: 입력 필드 컴포넌트
- `select.tsx`: 선택 컴포넌트
- `textarea.tsx`: 텍스트 영역 컴포넌트
- `dialog.tsx`: 다이얼로그 컴포넌트
- `badge.tsx`: 배지 컴포넌트
- `sidebar.tsx`: 사이드바 컴포넌트
- `chart.tsx`: 차트 컴포넌트
- 그 외 다양한 기본 UI 컴포넌트들

### 예시: 버튼 컴포넌트

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  // 컴포넌트 구현
}
```

## 커스텀 컴포넌트 (src/components/custom)

프로젝트 전용으로 개발된 컴포넌트들입니다.

- `shop-card.tsx`: 상점 정보를 표시하는 카드 컴포넌트
- `inventory-card.tsx`: 인벤토리 아이템을 표시하는 카드 컴포넌트
- `reservation-card.tsx`: 예약 정보를 표시하는 카드 컴포넌트
- `eco-impact-card.tsx`: 환경 영향을 표시하는 카드 컴포넌트
- `inventory-form.tsx`: 인벤토리 등록/수정 폼 컴포넌트
- `reservation-list.tsx`: 예약 목록을 표시하는 컴포넌트

### 예시: 인벤토리 카드 컴포넌트

```tsx
interface InventoryCardProps {
  id: string;
  name: string;
  image: string;
  shopName: string;
  shopId: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  quantity: number;
  expiresAt: string;
}

export function InventoryCard({
  id,
  name,
  image,
  shopName,
  shopId,
  originalPrice,
  discountPrice,
  discountRate,
  quantity,
  expiresAt,
}: InventoryCardProps) {
  return (
    <div className="...">
      {/* 컴포넌트 구현 */}
    </div>
  );
}
```

## 레이아웃 컴포넌트 (src/components/layout)

애플리케이션의 레이아웃을 구성하는 컴포넌트들입니다.

- `MobileLayout.tsx`: 모바일 레이아웃 컴포넌트
- `Header.tsx`: 헤더 컴포넌트
- `NavigationBar.tsx`: 하단 네비게이션 바 컴포넌트
- `ShopLayout.tsx`: 상점 페이지 레이아웃 컴포넌트

### 예시: MobileLayout 컴포넌트

```tsx
interface MobileLayoutProps {
  children: ReactNode;
  userId?: string | null;
  isOwner?: boolean;
}

export default function MobileLayout({
  children,
  userId,
  isOwner = false
}: MobileLayoutProps) {
  // 컴포넌트 구현
}
```

## 알림 컴포넌트 (src/components/notification)

알림 시스템 관련 컴포넌트들입니다.

- `notification-provider.tsx`: 알림 상태 관리 Provider
- `notification-bell.tsx`: 알림 벨 UI 컴포넌트
- `notification-dialog.tsx`: 알림 목록 및 상세 정보 다이얼로그

## 컴포넌트 디자인 원칙

1. **재사용성**: 컴포넌트는 최대한 재사용 가능하도록 설계되었습니다.
2. **합성**: 작은 컴포넌트를 조합하여 더 복잡한 UI를 구성합니다.
3. **타입 안전성**: TypeScript를 사용하여 props의 타입을 명확히 정의합니다.
4. **접근성**: 모든 컴포넌트는 웹 접근성 표준을 준수하도록 노력했습니다.
5. **테마**: Tailwind CSS와 변수를 사용하여 일관된 디자인 시스템을 구축했습니다.

## 상태 관리

컴포넌트의 상태 관리는 주로 다음 방식으로 이루어집니다:

1. **로컬 상태**: React의 `useState` 훅을 사용
2. **컨텍스트 API**: 애플리케이션 전체 상태는 React Context API를 활용
3. **커스텀 훅**: 자주 사용되는 로직은 커스텀 훅으로 추출

```tsx
// 커스텀 훅 예시
export function useSubscription(shopId: string) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 구독 상태 확인 로직
  }, [shopId]);

  const toggleSubscription = async () => {
    // 구독 토글 로직
  };

  return { isSubscribed, isLoading, toggleSubscription };
}
```

## 컴포넌트 문서화

추후 Storybook을 도입하여 각 컴포넌트의 사용법과 변형을 문서화할 계획입니다. 