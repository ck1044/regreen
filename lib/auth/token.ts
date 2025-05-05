import { NextRequest } from 'next/server';

/**
 * 요청에서 인증 토큰을 추출하는 유틸리티 함수
 * @param request Next.js 요청 객체
 * @returns 액세스 토큰 또는 null
 */
export async function getAuthToken(request: NextRequest): Promise<string | null> {
  // 요청 헤더에서 Authorization 가져오기
  const authHeader = request.headers.get('Authorization');
  
  // 요청 헤더에 토큰이 있으면 Bearer 프리픽스 제거 후 반환
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 쿠키에서 토큰 시도
  const cookies = request.cookies;
  const tokenCookie = cookies.get('auth-token')?.value;
  if (tokenCookie) {
    return tokenCookie;
  }
  
  // 세션 스토리지/로컬 스토리지는 서버 측에서 접근할 수 없으므로 여기서는 구현 불가
  // 클라이언트에서 인증 헤더를 추가하도록 제안
  
  return null;
} 