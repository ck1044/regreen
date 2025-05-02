// import { API_CONFIG } from "@/db";

// API 기본 URL 설정 (환경 변수 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://43.201.108.28/v1/api/";
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

interface SigninRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  // refreshToken: string; // 추후 구현 예정
}

interface StoreOwnerProfileRequest {
  name: string;
  phoneNumber: string;
  storeName: string;
  storeAddress: string;
  storeCategory: string;
  storePhoneNumber: string;
}

interface UserProfile {
  role: UserRole;
  email: string;
  name: string;
  phoneNumber: string;
}

interface InventoryRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  availableTime: string;
}

interface InventoryDetail {
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
    verificationStatus: VerificationStatus;
    verificationPhoto: string;
  };
}

interface ReservationRequest {
  inventoryId: number;
  pickUpTime: string;
  amount: number;
}

interface CustomerReservation {
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

interface StoreOwnerReservation {
  id: number;
  userName: string;
  amount: number;
  pickUpTime: string;
  status: ReservationStatus;
  createdAt: string;
}

interface ReservationStatusUpdateRequest {
  status: ReservationStatus;
}

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

interface StoreInfo {
  id: number;
  monday?: boolean;
  mondayStartTime?: string;
  mondayEndTime?: string;
  tuesday?: boolean;
  tuesdayStartTime?: string;
  tuesdayEndTime?: string;
  wednesday?: boolean;
  wednesdayStartTime?: string;
  wednesdayEndTime?: string;
  thursday?: boolean;
  thursdayStartTime?: string;
  thursdayEndTime?: string;
  friday?: boolean;
  fridayStartTime?: string;
  fridayEndTime?: string;
  saturday?: boolean;
  saturdayStartTime?: string;
  saturdayEndTime?: string;
  sunday?: boolean;
  sundayStartTime?: string;
  sundayEndTime?: string;
  lat?: number;
  lng?: number;
}

interface StoreDetail extends StorePreview {
  phoneNumber: string;
  inventories: Array<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    endTime: string;
  }>;
  storeInfo: StoreInfo;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface ApiError {
  status: number;
  message: string;
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
  
  constructor() {
    // 브라우저 환경에서 로컬 스토리지에서 토큰 복원
    if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }
  
  // 토큰 제거
  clearToken() {
    this.token = null;
    this.userProfile = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userProfile');
    }
  }
  
  // 사용자 프로필 설정
  setUserProfile(profile: UserProfile) {
    this.userProfile = profile;
    if (typeof window !== 'undefined') {
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
  
  // 기본 API 요청 함수
  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any, 
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(isFormData ? undefined : 'application/json');
    
    const options: RequestInit = {
      method,
      headers,
      // credentials: 'include', // 필요한 경우 쿠키 포함
    };
    
    if (data) {
      if (isFormData) {
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json() as ApiError;
      throw new Error(errorData.message || `API 호출 실패: ${response.status}`);
    }
    
    // 응답이 비어있을 경우 빈 객체 반환
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json() as T;
  }
  
  // 파일 업로드를 위한 FormData 생성 헬퍼
  private createFormData(data: any, file?: File, fileField: string = 'file'): FormData {
    const formData = new FormData();
    
    // JSON 데이터를 FormData에 추가
    for (const key in data) {
      formData.append(key, typeof data[key] === 'object' ? 
        JSON.stringify(data[key]) : data[key].toString());
    }
    
    // 파일이 있으면 추가
    if (file) {
      formData.append(fileField, file);
    }
    
    return formData;
  }
  
  // 인증 관련 API
  auth = {
    // 회원가입
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
      return this.request<AuthResponse>('/auth/signup', 'POST', data);
    },
    
    // 로그인
    signin: async (data: SigninRequest): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/auth/signin', 'POST', data);
      this.setToken(response.accessToken);
      return response;
    },
    
    // 로그아웃
    signout: () => {
      this.clearToken();
    }
  };
  
  // 사용자 관련 API
  user = {
    // 점주 프로필 생성
    createStoreOwnerProfile: async (data: StoreOwnerProfileRequest, verificationPhoto: File): Promise<void> => {
      const formData = this.createFormData(data, verificationPhoto);
      return this.request<void>('/user/profile/store-owner', 'POST', formData, true);
    },
    
    // 프로필 상태 조회
    getProfile: async (): Promise<UserProfile> => {
      const profile = await this.request<UserProfile>('/user/profile', 'GET');
      this.setUserProfile(profile);
      return profile;
    }
  };
  
  // 재고 관련 API
  inventory = {
    // 재고 생성
    create: async (data: InventoryRequest, image?: File): Promise<void> => {
      const formData = this.createFormData(data, image);
      return this.request<void>('/inventory', 'POST', formData, true);
    },
    
    // 재고 상세 조회
    getDetail: async (inventoryId: number): Promise<InventoryDetail> => {
      return this.request<InventoryDetail>(`/inventory/${inventoryId}`, 'GET');
    }
  };
  
  // 예약 관련 API
  reservation = {
    // 예약 생성
    create: async (data: ReservationRequest): Promise<void> => {
      return this.request<void>('/reservation', 'POST', data);
    },
    
    // 고객 예약 목록 조회
    getCustomerReservations: async (): Promise<CustomerReservation[]> => {
      return this.request<CustomerReservation[]>('/reservation/customer', 'GET');
    },
    
    // 점주 당일 예약 목록 조회
    getStoreOwnerReservations: async (): Promise<StoreOwnerReservation[]> => {
      return this.request<StoreOwnerReservation[]>('/reservation/store-owner', 'GET');
    },
    
    // 예약 상태 업데이트
    updateStatus: async (reservationId: number, data: ReservationStatusUpdateRequest): Promise<void> => {
      return this.request<void>(`/reservation/${reservationId}`, 'PATCH', data);
    }
  };
  
  // 가게 관련 API
  store = {
    // 전체 가게 조회
    getAll: async (): Promise<StorePreview[]> => {
      return this.request<StorePreview[]>('/store', 'GET');
    },
    
    // 가게 상세 조회
    getDetail: async (storeId: number): Promise<StoreDetail> => {
      return this.request<StoreDetail>(`/store/${storeId}`, 'GET');
    }
  };
  
  // 알림 관련 API
  notification = {
    // 알림 조회 (24시간 이내)
    getAll: async (): Promise<Notification[]> => {
      return this.request<Notification[]>('/notification', 'GET');
    }
  };
}

// API 클라이언트 인스턴스 생성
const apiClient = new ApiClient();

export default apiClient; 