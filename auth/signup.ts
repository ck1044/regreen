/**
 * 사용자 역할 타입 정의
 */
export type UserRole = 'CUSTOMER' | 'STORE_OWNER';

/**
 * 기본 회원가입 공통 정보 인터페이스
 */
interface BaseSignupInfo {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

/**
 * 일반 고객 회원가입 요청 데이터 인터페이스
 */
export interface CustomerSignupRequest extends BaseSignupInfo {
  university: string;
}

/**
 * 가게 정보 인터페이스
 */
export interface StoreInfo {
  storeName: string;
  storeAddress: string;
  storePhoneNumber: string;
  storeCategory: number;
  storeInfo: string;
  storePickupTime: string;
}

/**
 * 사장님 회원가입 요청 데이터 인터페이스
 */
export interface StoreOwnerSignupRequest extends BaseSignupInfo {
  store: StoreInfo;
}

/**
 * 회원가입 응답 데이터 인터페이스
 */
export interface SignupResponse {
  accessToken: string;
}

/**
 * 일반 고객 회원가입 API를 호출하는 함수
 * @param data - 회원가입 요청 데이터
 * @returns 회원가입 응답 데이터 (액세스 토큰 포함)
 */
export async function signupCustomer(data: CustomerSignupRequest): Promise<SignupResponse> {
  try {
    const response = await fetch('/api/auth/signup/customer', {
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
    return result;
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
}

/**
 * 사장님 회원가입 API를 호출하는 함수
 * @param data - 회원가입 요청 데이터
 * @param storeVerificationImage - 가게 인증 이미지 파일
 * @returns 회원가입 응답 데이터 (액세스 토큰 포함)
 */
export async function signupStoreOwner(
  data: StoreOwnerSignupRequest, 
  storeVerificationImage: File
): Promise<SignupResponse> {
  try {
    const formData = new FormData();
    formData.append('file', storeVerificationImage);
    formData.append('data', JSON.stringify(data));

    const response = await fetch('/api/auth/signup/store-owner', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '회원가입 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('사장님 회원가입 오류:', error);
    throw error;
  }
} 