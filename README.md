# 리그린 (RE-GREEN)

RE-GREEN은 음식물 쓰레기를 줄이고 지속 가능한 소비를 촉진하기 위한 웹 애플리케이션입니다. 상점들이 폐기 예정인 상품을 할인된 가격에 등록하고, 소비자들이 이를 구매할 수 있게 함으로써 환경 보호에 기여합니다.

## 기술 스택

- **프론트엔드**: Next.js 15 (App Router), React, TypeScript
- **스타일링**: Tailwind CSS, shadcn/ui
- **상태 관리**: React Context API
- **데이터베이스**: (구현 중 - MySQL 또는 PostgreSQL 예정)
- **ORM**: (구현 중 - Drizzle ORM 예정)
- **인증**: (구현 중)
- **배포**: Vercel

## 주요 기능

- 사용자 인증 (로그인/회원가입)
- 상점 및 상품 목록 보기
- 상품 예약 및 결제 처리
- 실시간 알림 시스템 (SSE 기반)
- 인벤토리 관리 (상점 주인용)
- 예약 관리
- 환경 영향 측정 및 표시

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 패키지 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

## 프로젝트 구조


```

## 문서

더 자세한 정보는 다음 문서들을 참조하세요:

- [인증 시스템](./docs/auth.md)
- [알림 시스템](./docs/notifications.md)
- [인벤토리 관리](./docs/inventory.md)
- [예약 시스템](./docs/reservations.md)
- [컴포넌트 구조](./docs/components.md)

## 기여 방법

1. 이 저장소를 포크합니다. 
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/yourBranch`).
3. 변경 사항을 커밋합니다 (`git commit -m 'Add sth'`).
4. 브랜치에 푸시합니다 (`git push origin feature/yourBranch`).
5. Pull Request를 열어 주세요.

