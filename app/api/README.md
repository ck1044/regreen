# API 가이드

이 폴더는 RE-GREEN 프로젝트의 API 엔드포인트 및 타입 정의를 포함합니다.

## 주요 파일 설명

- `routes.ts`: API 엔드포인트 경로 및 인터페이스 정의
  - API 엔드포인트 경로 상수
  - API 요청/응답 타입 정의
  - 유틸리티 함수 (URL 포맷팅 등)

## ⚠️ apiClient 제거 가이드

API 클라이언트(apiClient)가 제거되었습니다. 모든 API 요청은 이제 `routes.ts`에서 정의된 타입과 상수를 사용하여 직접 fetch로 구현해야 합니다.

### apiClient 참조 제거 방법

1. 임포트 변경:
   ```typescript
   // 변경 전
   import apiClient from "@/app/api/client";
   
   // 변경 후
   import { formatInternalApiUrl, ROUTES_CONSTANT } from "@/app/api/routes";
   ```

2. API 호출 변경:
   ```typescript
   // 변경 전
   const data = await apiClient.someModule.someMethod(params);
   
   // 변경 후
   const response = await fetch(formatInternalApiUrl(SOME_ROUTES.ENDPOINT), {
     method: 'METHOD',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
     },
     body: params ? JSON.stringify(params) : undefined,
   });
   
   if (!response.ok) {
     throw new Error(`API 요청 실패: ${response.status}`);
   }
   
   const data = await response.json();
   ```

## API 사용 방법

### 1. 필요한 경로 및 타입 임포트

```typescript
import { formatInternalApiUrl, AUTH_ROUTES, UserProfile, SigninRequest } from "@/app/api/routes";
```

### 2. API 요청 예시

#### GET 요청 예시

```typescript
async function getShops() {
  try {
    const response = await fetch(formatInternalApiUrl(STORE_ROUTES.BASE), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 인증이 필요한 경우 토큰 추가
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    return null;
  }
}
```

#### POST 요청 예시

```typescript
async function signUp(data: CustomerSignupRequest) {
  try {
    const url = formatInternalApiUrl(AUTH_ROUTES.SIGNUP_CUSTOMER);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "요청 중 오류가 발생했습니다");
    }
    
    const result = await response.json();
    
    // 액세스 토큰 저장
    if (result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
    }
    
    return result;
  } catch (error) {
    console.error('API 오류:', error);
    throw error;
  }
}
```

### 3. 인증 관리

로그인/로그아웃 시 로컬 스토리지를 사용하여 인증 토큰 관리:

```typescript
// 로그인 토큰 저장
localStorage.setItem('accessToken', token);

// 토큰 가져오기
const token = localStorage.getItem('accessToken');

// 로그아웃 시 토큰 제거
localStorage.removeItem('accessToken');
```

## 인터페이스 정의

API 요청 및 응답에 사용되는 모든 타입은 `routes.ts`에 정의되어 있습니다. 필요한 타입을 임포트하여 사용하세요:

```typescript
import { 
  UserProfile, 
  CustomerSignupRequest, 
  InventoryDetail 
} from "@/app/api/routes";
``` 