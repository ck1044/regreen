# 인증 시스템

리그린 애플리케이션의 인증 시스템은 사용자(일반 소비자)와 상점 주인을 위한 인증 기능을 제공합니다.

## 주요 파일

- `src/app/auth/signin/page.tsx`: 로그인 페이지
- `src/app/auth/signup/page.tsx`: 회원가입 페이지
- `src/components/auth/auth-provider.tsx`: 인증 상태 관리 Provider

## 사용자 유형

- **일반 사용자(소비자)**: 상품을 검색하고 예약할 수 있습니다.
- **상점 주인**: 상품을 등록하고 예약을 관리할 수 있습니다.

## 인증 흐름

1. **회원가입**: 사용자/상점 주인은 이메일, 비밀번호, 및 기타 필요 정보를 입력하여 계정을 생성합니다.
2. **로그인**: 등록된 계정으로 로그인합니다.
3. **세션 관리**: 로그인 상태는 JWT 토큰을 통해 관리됩니다.
4. **인증 상태**: `AuthProvider`를 통해 애플리케이션 전체에서 사용자 인증 상태에 접근할 수 있습니다.

## 로그인 페이지

로그인 페이지는 다음 기능을 제공합니다:

- 이메일/비밀번호 로그인
- 로그인 상태 유지
- 회원가입 페이지 링크
- 비밀번호 재설정 링크

## 회원가입 페이지

회원가입 페이지는 다음 필드를 포함합니다:

- 이메일
- 비밀번호
- 비밀번호 확인
- 이름
- 전화번호
- 사용자 유형 선택 (소비자/상점 주인)
- 약관 동의

## 인증 상태 관리

`AuthProvider` 컴포넌트는 다음 기능을 제공합니다:

- 현재 사용자 정보 관리
- 로그인/로그아웃 기능
- 인증 상태에 따른 리디렉션 처리
- 보호된 라우트 관리

## 구현 예정 기능

- 소셜 로그인 (Google, Kakao)
- 이메일 인증
- 비밀번호 재설정
- 2단계 인증

## 사용 예시

```tsx
// AuthProvider를 이용해 인증 상태 관리
import { useAuth } from "@/components/auth/auth-provider";

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }
  
  return (
    <div>
      <h1>{user.name}님의 프로필</h1>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
} 