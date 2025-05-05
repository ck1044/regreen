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

// API 기본 URL 설정 (환경 변수 사용)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://43.201.108.28/v1/api/";

// 디버깅을 위한 API URL 로깅
console.log('API 클라이언트에서 사용 중인 API URL:', API_BASE_URL);

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

// 인증 관련 타입
export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
}

// 회원가입 관련 타입
import { 
  CustomerSignupRequest,
  StoreOwnerSignupRequest,
  SignupResponse
} from '@/auth/signup';


/**
 * 사용자 프로필 인터페이스
 */
export interface UserProfile {
  role: UserRole;
  email: string;
  name: string;
  phoneNumber: string;
  university?: string;
}

/**
 * 프로필 업데이트 요청 인터페이스
 */
export interface UpdateProfileRequest {
  name?: string;
  university?: string;
  phoneNumber?: string;
}

/**
 * 비밀번호 변경 요청 인터페이스
 */
export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
}

/**
 * 사용자 API 타입 정의
 */
export type UserAPI = {
  getProfile: () => Promise<UserProfile>;
  updateProfile: (data: UpdateProfileRequest) => Promise<UserProfile>;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
}; 

// 재고 관련 타입
export interface InventoryCreateRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  availableTime: string;
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

// 공통 타입 정의
export type UserRole = "CUSTOMER" | "STORE_OWNER" | "ADMIN";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type StoreCategory = "Bakery" | "Salad" | "Lunchbox" | "Fruit";

// 인터페이스 정의
interface SignupRequest {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
}

interface AuthResponse {
  accessToken: string;
}

interface StoreOwnerProfileRequest {
  shopName: string;
  shopLocation: string;
  shopPhoneNumber: string;
  verificationPhoto?: File;
  storePhoneNumber: string;
}

// 매장 미리보기 정보 인터페이스
interface StorePreview {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
}

// 매장 상세 정보 인터페이스
interface StoreDetail extends StorePreview {
  phoneNumber: string;
  inventories: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    endTime: string;
  }>;
  storeInfo: string;
  storePickupTime: string;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// 시간 변환 유틸리티 함수
export const convertTimeToISO = (time: string) => {
  const [hours, minutes] = time.split(':');
  const now = new Date();
  now.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return now.toISOString();
};

// API 클라이언트 클래스
class ApiClient {
  private token: string | null = null;
  private userProfile: UserProfile | null = null;
  private isServer: boolean;
  
  constructor() {
    // 서버 측 렌더링인지 클라이언트 측 렌더링인지 확인
    this.isServer = typeof window === 'undefined';
    
    // 브라우저 환경에서 로컬 스토리지에서 토큰 복원
    if (!this.isServer) {
      // 토큰 복원
      this.token = localStorage.getItem('accessToken');
      
      // 사용자 프로필 복원
      try {
        const userProfileStr = localStorage.getItem('userProfile');
        if (userProfileStr) {
          this.userProfile = JSON.parse(userProfileStr);
        }
      } catch (error) {
        console.error('사용자 프로필 복원 오류:', error);
        this.userProfile = null;
      }
    }
  }
  
  // 토큰 설정
  setToken(token: string) {
    this.token = token;
    if (!this.isServer) {
      localStorage.setItem('accessToken', token);
    }
  }
  
  // 토큰 제거
  clearToken() {
    this.token = null;
    this.userProfile = null;
    if (!this.isServer) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userProfile');
    }
  }
  
  // 사용자 프로필 설정
  setUserProfile(profile: UserProfile) {
    this.userProfile = profile;
    if (!this.isServer) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }
  
  // 사용자 프로필 가져오기
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }
  
  // 관리자 여부 확인
  isAdmin(): boolean {
    return this.userProfile?.role === 'ADMIN';
  }
  
  // 로그인 여부 확인
  isLoggedIn(): boolean {
    return !!this.token;
  }
  
  // 기본 헤더 생성
  private getHeaders(contentType = 'application/json'): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  // API URL 구성 (슬래시 중복 처리)
  private formatUrl(endpoint: string, isDirectApi: boolean = false): string {
    // 직접 API 호출인 경우
    if (isDirectApi) {
      return formatExternalApiUrl(endpoint);
    } 
    // Next.js API 라우트인 경우
    else {
      return formatInternalApiUrl(endpoint);
    }
  }
  
  // 기본 API 요청 함수 - 통합 방식
  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: unknown, // any 대신 unknown 사용
    isFormData: boolean = false,
    useDirectApi: boolean = false // 직접 API 호출 여부
  ): Promise<T> {
    // 서버 측에서는 항상 직접 API를 호출
    // 클라이언트 측에서는 CORS 회피를 위해 Next.js API 라우트 사용
    const shouldUseDirectApi = this.isServer || useDirectApi;
    
    const url = this.formatUrl(endpoint, shouldUseDirectApi);
    const headers = this.getHeaders(isFormData ? undefined : 'application/json');
    
    console.log(`API 요청: ${method} ${url} (직접 API 호출: ${shouldUseDirectApi})`);
    if (data) {
      console.log('요청 데이터:', isFormData ? '(FormData)' : data);
    }
    
    const options: RequestInit = {
      method,
      headers,
    };
    
    if (data) {
      if (isFormData) {
        options.body = data as FormData;
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    try {
      const response = await fetch(url, options);
      console.log(`API 응답 상태: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = '';
        try {
          const errorData = await response.json();
          console.error('API 오류 응답:', errorData);
          errorMessage = errorData.message || `API 오류: ${response.status}`;
        } catch (parseError) {
          const textResponse = await response.text();
          console.error('API 오류 응답 (텍스트):', textResponse, parseError);
          errorMessage = `API 오류: ${response.status} - ${textResponse || '응답 없음'}`;
        }
        throw new Error(errorMessage);
      }
      
      // 응답이 비어있을 경우 빈 객체 반환
      if (response.status === 204) {
        return {} as T;
      }
      
      const responseData = await response.json();
      console.log('API 응답 데이터:', responseData);
      return responseData as T;
    } catch (error) {
      console.error(`API 요청 실패 (${url}):`, error);
      throw error;
    }
  }
  
  // 인증 관련 API
  auth = {
    // 고객 회원가입
    signupCustomer: async (data: CustomerSignupRequest): Promise<SignupResponse> => {
      console.log('고객 회원가입 요청:', data);
      
      const result = await this.request<SignupResponse>(AUTH_ROUTES.SIGNUP_CUSTOMER, 'POST', data);
      
      // 액세스 토큰이 있으면 저장
      if (result.accessToken) {
        this.setToken(result.accessToken);
      }
      
      return result;
    },
    
    // 사장님 회원가입
    signupStoreOwner: async (data: StoreOwnerSignupRequest, verificationPhoto: File): Promise<SignupResponse> => {
      console.log('사장님 회원가입 요청:', data);
      
      const formData = new FormData();
      formData.append('file', verificationPhoto);
      formData.append('data', JSON.stringify(data));
      
      const result = await this.request<SignupResponse>(AUTH_ROUTES.SIGNUP_STORE_OWNER, 'POST', formData, true);
      
      // 액세스 토큰이 있으면 저장
      if (result.accessToken) {
        this.setToken(result.accessToken);
      }
      
      return result;
    },
    
    // 로그인
    signin: async (data: SigninRequest): Promise<SigninResponse> => {
      const response = await this.request<SigninResponse>(AUTH_ROUTES.SIGNIN, 'POST', data);
      this.setToken(response.accessToken);
      
      // 로그인 후 사용자 프로필 정보 자동으로 가져오기
      try {
        const profile = await this.user.getProfile();
        this.setUserProfile(profile);
      } catch (error) {
        console.error('프로필 정보 가져오기 실패:', error);
      }
      
      return response;
    },
    
    // 로그아웃
    signout: () => {
      this.clearToken();
    }
  };
  
  // 사용자 관련 API
  user = {
    // 프로필 조회
    getProfile: async (): Promise<UserProfile> => {
      const profile = await this.request<UserProfile>(USER_ROUTES.PROFILE, 'GET');
      this.setUserProfile(profile);
      return profile;
    },
    
    // 프로필 업데이트
    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
      const profile = await this.request<UserProfile>(USER_ROUTES.UPDATE_PROFILE, 'PATCH', data);
      // 업데이트된 프로필 정보로 로컬 상태 갱신
      this.setUserProfile(profile);
      return profile;
    },
    
    // 비밀번호 변경
    updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
      await this.request<void>(USER_ROUTES.UPDATE_PASSWORD, 'PATCH', data);
    }
  };
  
  // 재고 관련 API
  inventory = {
    // 재고 생성
    create: async (data: InventoryCreateRequest, image?: File): Promise<void> => {
      const formData = this.createFormData(data, image);
      return this.request<void>(INVENTORY_ROUTES.BASE, 'POST', formData, true);
    },
    
    // 오늘의 재고 목록 조회
    getAll: async (): Promise<InventoryPreview[]> => {
      return this.request<InventoryPreview[]>(INVENTORY_ROUTES.BASE, 'GET');
    },
    
    // 재고 상세 조회
    getDetail: async (inventoryId: number): Promise<InventoryDetail> => {
      return this.request<InventoryDetail>(INVENTORY_ROUTES.DETAIL(inventoryId), 'GET');
    }
  };
  
  // 예약 관련 API
  reservation = {
    // 예약 생성
    create: async (data: ReservationCreateRequest): Promise<void> => {
      return this.request<void>(RESERVATION_ROUTES.BASE, 'POST', data);
    },
    
    // 고객 예약 목록 조회
    getCustomerReservations: async (): Promise<CustomerReservation[]> => {
      return this.request<CustomerReservation[]>(RESERVATION_ROUTES.CUSTOMER, 'GET');
    },
    
    // 점주 당일 예약 목록 조회
    getStoreOwnerReservations: async (): Promise<StoreOwnerReservation[]> => {
      return this.request<StoreOwnerReservation[]>(RESERVATION_ROUTES.STORE_OWNER, 'GET');
    },
    
    // 예약 상태 업데이트
    updateStatus: async (reservationId: number, data: ReservationStatusUpdateRequest): Promise<void> => {
      return this.request<void>(RESERVATION_ROUTES.UPDATE_STATUS(reservationId), 'PATCH', data);
    }
  };
  
  // 가게 관련 API
  store = {
    // 전체 가게 조회
    getAll: async (): Promise<StorePreview[]> => {
      return this.request<StorePreview[]>(STORE_ROUTES.BASE, 'GET');
    },
    
    // 가게 상세 조회
    getDetail: async (storeId: number): Promise<StoreDetail> => {
      return this.request<StoreDetail>(STORE_ROUTES.DETAIL(storeId), 'GET');
    }
  };
  
  // 알림 관련 API
  notification = {
    // 알림 조회 (24시간 이내)
    getAll: async (): Promise<Notification[]> => {
      return this.request<Notification[]>(NOTIFICATION_ROUTES.BASE, 'GET');
    }
  };

  // 파일 업로드를 위한 FormData 생성 헬퍼
  private createFormData(data: unknown, file?: File | null, fileField: string = 'file'): FormData {
    const formData = new FormData();
    
    // JSON 데이터를 FormData에 추가
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? 
          JSON.stringify(value) : String(value || ''));
      });
    }
    
    // 파일이 있으면 추가
    if (file) {
      formData.append(fileField, file);
    }
    
    return formData;
  }
}

// API 클라이언트 인스턴스 생성
const apiClient = new ApiClient();

export default apiClient; 