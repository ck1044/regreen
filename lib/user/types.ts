/**
 * 사용자 역할 타입
 */
export type UserRole = 'CUSTOMER' | 'STORE_OWNER' | 'ADMIN';

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