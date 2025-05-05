/**
 * API 라우트 정의 파일
 * 
 * 이 파일은 클라이언트와 서버 간의 API 엔드포인트를 정의합니다.
 * 클라이언트 코드와 서버 코드 간의 일관성을 유지하는 데 도움이 됩니다.
 */

// 인증 관련 엔드포인트
export const AUTH_ROUTES = {
  SIGNUP_CUSTOMER: '/auth/signup/customer',
  SIGNUP_STORE_OWNER: '/auth/signup/store-owner',
  SIGNIN: '/auth/signin',
  SIGNOUT: '/auth/signout',
};

// 사용자 관련 엔드포인트
export const USER_ROUTES = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  UPDATE_PASSWORD: '/user/password',
};

// 재고 관련 엔드포인트
export const INVENTORY_ROUTES = {
  BASE: '/inventory',
  DETAIL: (id: number) => `/inventory/${id}`,
};

// 예약 관련 엔드포인트
export const RESERVATION_ROUTES = {
  BASE: '/reservation',
  CUSTOMER: '/reservation/customer',
  STORE_OWNER: '/reservation/store-owner',
  UPDATE_STATUS: (id: number) => `/reservation/${id}`,
};

// 가게 관련 엔드포인트
export const STORE_ROUTES = {
  BASE: '/store',
  DETAIL: (id: number) => `/store/${id}`,
};

// 알림 관련 엔드포인트
export const NOTIFICATION_ROUTES = {
  BASE: '/notification',
};

// 외부 API의 기본 URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.201.108.28/v1/api/';

/**
 * 외부 API URL 형식화 함수
 * 슬래시 중복 방지 및 일관된 URL 구성
 */
export function formatExternalApiUrl(endpoint: string): string {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }
  
  if (API_BASE_URL.endsWith('/')) {
    return `${API_BASE_URL}${endpoint}`;
  } else {
    return `${API_BASE_URL}/${endpoint}`;
  }
}

/**
 * Next.js API 라우트 URL 형식화 함수
 */
export function formatInternalApiUrl(endpoint: string): string {
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }
  return `/api${endpoint}`;
} 