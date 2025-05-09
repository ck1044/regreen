/**
 * API 라우트 정의 파일
 * 
 * 이 파일은 클라이언트와 서버 간의 API 엔드포인트를 정의합니다.
 * 클라이언트 코드와 서버 코드 간의 일관성을 유지하는 데 도움이 됩니다.
 */

// 공통 타입 정의
export type UserRole = "CUSTOMER" | "STORE_OWNER" | "ADMIN";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type StoreCategory = "Bakery" | "Salad" | "Lunchbox" | "Fruit" | "Dessert" | "Other";

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
  TODAY: '/inventory',  // 오늘의 재고 조회 엔드포인트
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
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 외부 API URL 형식화 함수
 * 슬래시 중복 방지 및 일관된 URL 구성
 */
export function formatExternalApiUrl(endpoint: string): string {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1);
  }
  
  if (API_BASE_URL && API_BASE_URL.endsWith('/')) {
    return `${API_BASE_URL}${endpoint}`;
  } else {
    return `${API_BASE_URL}/${endpoint}`;
  }
}

/**
 * Next.js API 라우트 URL 형식화 함수
 */
export function formatInternalApiUrl(path: string): string {
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  
  if (API_BASE_URL && API_BASE_URL.endsWith('/')) {
    return `${API_BASE_URL}${path}`;
  } else {
    return `${API_BASE_URL}/${path}`;
  }
}

// 인증 관련 타입
export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
}

// 회원가입 관련 타입
interface BaseSignupInfo {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface CustomerSignupRequest extends BaseSignupInfo {
  university: string;
}

export interface StoreInfo {
  storeName: string;
  storeAddress: string;
  storePhoneNumber: string;
  storeCategory: number;
  storeInfo: string;
  storePickupTime: string;
}

export interface StoreOwnerSignupRequest extends BaseSignupInfo {
  store: StoreInfo;
}

export interface SignupResponse {
  accessToken: string;
}

// 사용자 관련 타입
export interface UserProfile {
  role: UserRole;
  email: string;
  name: string;
  phoneNumber: string;
  university?: string;
  isAdmin?: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  university?: string;
  phoneNumber?: string;
}

export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
}

// 재고 관련 타입
export interface InventoryCreateRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  startTime: string;
  endTime: string;
}

// 오늘의 재고 조회 응답 타입
export interface TodayInventoryItem {
  inventory: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    startTime: string;
    endTime: string;
  };
  store: {
    name: string;
    category: string;
  };
}

export interface InventoryDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  startTime: string;
  endTime: string;
  store: {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    lat: number;
    lng: number;
    storeInfo: string;
    storePickupTime: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    category: {
      id: number;
      name: string;
    }
  }
}

export interface InventoryPreview {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  startTime: string;
  endTime: string;
}

// 예약 관련 타입
export interface ReservationCreateRequest {
  inventoryId: number;
  pickUpTime: string;
  amount: number;
}

export interface CustomerReservation {
  id: number;
  inventoryImage: string;
  inventoryName: string;
  inventoryPrice: number;
  storeName: string;
  storeAddress: string;
  storeCategory: string;
  amount: number;
  pickUpTime: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface StoreOwnerReservation {
  id: number;
  userName: string;
  amount: number;
  pickUpTime: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface ReservationStatusUpdateRequest {
  status: ReservationStatus;
}

// 시간 변환 유틸리티 함수
export const convertTimeToISO = (time: string) => {
  const [hours, minutes] = time.split(':');
  const now = new Date();
  now.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return now.toISOString();
}; 