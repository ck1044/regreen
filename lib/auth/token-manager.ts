/**
 * 인증 토큰 관리 유틸리티
 * 토큰을 저장, 가져오기, 삭제하는 함수들을 제공합니다.
 */

// 토큰 저장소 키
const ACCESS_TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// 토큰 만료 시간 (24시간)
const TOKEN_EXPIRY_HOURS = 24;

/**
 * 토큰 저장하기
 * @param token 저장할 액세스 토큰
 */
export const saveToken = (token: string): void => {
  if (typeof window === 'undefined') return; // 서버 사이드에서는 실행하지 않음
  
  try {
    // 토큰 저장
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    
    // 만료 시간 설정 (현재 시간 + 24시간)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + TOKEN_EXPIRY_HOURS);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toISOString());
    
    // 세션 스토리지에도 동일하게 저장 (새로고침해도 유지되도록)
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toISOString());
    
    // 쿠키에도 저장 (서버 사이드 렌더링에서 접근 가능하도록)
    document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_EXPIRY_HOURS * 3600}; SameSite=Lax`;
  } catch (error) {
    console.error('토큰 저장 중 오류 발생:', error);
  }
};

/**
 * 토큰 가져오기
 * @returns 저장된 토큰 또는 null
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null; // 서버 사이드에서는 실행하지 않음
  
  try {
    // 로컬 스토리지에서 토큰과 만료 시간 가져오기
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiryTimeStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    // 토큰이 없으면 null 반환
    if (!token || !expiryTimeStr) return null;
    
    // 만료 시간 확인
    const expiryTime = new Date(expiryTimeStr);
    const currentTime = new Date();
    
    // 토큰이 만료되었으면 삭제하고 null 반환
    if (currentTime > expiryTime) {
      removeToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('토큰 가져오기 중 오류 발생:', error);
    return null;
  }
};

/**
 * 토큰 삭제하기
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return; // 서버 사이드에서는 실행하지 않음
  
  try {
    // 로컬 스토리지 및 세션 스토리지에서 삭제
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    
    // 쿠키에서 삭제
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch (error) {
    console.error('토큰 삭제 중 오류 발생:', error);
  }
};

/**
 * 토큰 유효성 검사
 * @returns 토큰이 유효하면 true, 그렇지 않으면 false
 */
export const isTokenValid = (): boolean => {
  return getToken() !== null;
};

/**
 * 헤더에 토큰 추가하기
 * @param headers 기존 헤더 객체
 * @returns 토큰이 추가된 헤더 객체
 */
export const addTokenToHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getToken();
  if (token) {
    return {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return headers;
}; 