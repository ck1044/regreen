/**
 * 사용자 역할 타입 정의
 */
export type UserRole = 'CUSTOMER' | 'STORE_OWNER';

/**
 * 회원가입 요청 데이터 인터페이스
 */
export interface SignupRequest {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
}

/**
 * 회원가입 응답 데이터 인터페이스
 */
export interface SignupResponse {
  accessToken: string;
}

/**
 * 회원가입 API를 호출하는 함수
 * @param data - 회원가입 요청 데이터
 * @returns 회원가입 응답 데이터 (액세스 토큰 포함)
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  try {
    // Next.js API 라우트를 통해 요청 (직접 외부 서버로 요청하지 않음)
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '회원가입 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    console.log('회원가입 응답 데이터:', result);
    return result;
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
} 