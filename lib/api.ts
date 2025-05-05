// import { API_CONFIG } from "@/db";
import { 
  AUTH_ROUTES, 
  USER_ROUTES, 
  INVENTORY_ROUTES, 
  RESERVATION_ROUTES, 
  STORE_ROUTES, 
  NOTIFICATION_ROUTES,
  formatExternalApiUrl,
  formatInternalApiUrl
} from "@/app/api/routes";

// API 기본 URL 설정 (환경 변수 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://43.201.108.28/v1/api/";

// 디버깅을 위한 API URL 로깅
console.log('API 클라이언트에서 사용 중인 API URL:', API_BASE_URL);

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
    // 회원가입
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
      console.log('회원가입 요청:', data);
      
      const result = await this.request<AuthResponse>(AUTH_ROUTES.SIGNUP, 'POST', data);
      
      // 액세스 토큰이 있으면 저장
      if (result.accessToken) {
        this.setToken(result.accessToken);
      }
      
      return result;
    },
    
    // 로그인
    signin: async (data: SigninRequest): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>(AUTH_ROUTES.SIGNIN, 'POST', data);
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
    // 점주 프로필 생성
    createStoreOwnerProfile: async (data: StoreOwnerProfileRequest, verificationPhoto: File | null): Promise<void> => {
      if (!verificationPhoto) {
        // 파일이 없는 경우 일반 JSON 요청
        return this.request<void>(USER_ROUTES.STORE_OWNER_PROFILE, 'POST', data);
      } else {
        // 파일이 있는 경우 FormData 요청
        const formData = this.createFormData(data, verificationPhoto);
        return this.request<void>(USER_ROUTES.STORE_OWNER_PROFILE, 'POST', formData, true);
      }
    },
    
    // 프로필 상태 조회
    getProfile: async (): Promise<UserProfile> => {
      const profile = await this.request<UserProfile>(USER_ROUTES.PROFILE, 'GET');
      this.setUserProfile(profile);
      return profile;
    },
    
    // 프로필 업데이트
    updateProfile: async (data: Partial<UserProfile>): Promise<void> => {
      const profile = await this.request<UserProfile>(USER_ROUTES.PROFILE, 'PATCH', data);
      // 업데이트된 프로필 정보로 로컬 상태 갱신
      this.setUserProfile(profile);
      return;
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
  
  // 재고 관련 API
  inventory = {
    // 재고 생성
    create: async (data: InventoryRequest, image?: File): Promise<void> => {
      const formData = this.createFormData(data, image);
      return this.request<void>(INVENTORY_ROUTES.BASE, 'POST', formData, true);
    },
    
    // 재고 상세 조회
    getDetail: async (inventoryId: number): Promise<InventoryDetail> => {
      return this.request<InventoryDetail>(INVENTORY_ROUTES.DETAIL(inventoryId), 'GET');
    }
  };
  
  // 예약 관련 API
  reservation = {
    // 예약 생성
    create: async (data: ReservationRequest): Promise<void> => {
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
}

// API 클라이언트 인스턴스 생성
const apiClient = new ApiClient();

export default apiClient; 