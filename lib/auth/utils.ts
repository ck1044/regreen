// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
// API 클라이언트 제거됨: 필요한 API 타입 및 경로만 임포트
import { formatInternalApiUrl, UserProfile, USER_ROUTES } from "@/app/api/routes";

// 브라우저 환경에서 로컬 스토리지에서 사용자 프로필 조회
function getUserProfileFromLocalStorage(): UserProfile | null {
  if (typeof window !== 'undefined') {
    try {
      const profileStr = localStorage.getItem('userProfile');
      if (profileStr) {
        return JSON.parse(profileStr) as UserProfile;
      }
    } catch (error) {
      console.error('사용자 프로필 복원 오류:', error);
    }
  }
  return null;
}

// 서버 컴포넌트에서 토큰을 사용하여 사용자 정보 조회
async function fetchUserProfile(token: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(formatInternalApiUrl(USER_ROUTES.PROFILE), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json() as UserProfile;
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    return null;
  }
}

// 서버 컴포넌트에서 현재 세션 가져오기
export async function getSession() {
  // 서버 컴포넌트에서는 쿠키를 통해 토큰 접근 필요
  // 클라이언트 컴포넌트에서는 로컬 스토리지에서 유저 정보 가져오기
  const userProfile = getUserProfileFromLocalStorage();
  return userProfile ? { user: userProfile } : null;
}

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// 인증이 필요한 경로 보호
export async function requireAuth(redirectTo = "/auth/signin") {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect(redirectTo);
  }
  
  return user;
}

// 특정 역할이 필요한 경로 보호
export async function requireRole(roles: string | string[], redirectTo = "/") {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  if (!allowedRoles.includes(user.role)) {
    redirect(redirectTo);
  }
  
  return user;
}

// 관리자 권한 확인
export async function requireAdmin(redirectTo = "/") {
  return requireRole("ADMIN", redirectTo);
}

// 매장 소유자 권한 확인
export async function requireStoreOwner(redirectTo = "/") {
  return requireRole(["ADMIN", "STORE_OWNER"], redirectTo);
}

// 사용자 역할에 따른 대시보드 경로
export function getDashboardPath(role: string) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STORE_OWNER":
      return "/stores/manage";
    default:
      return "/profile";
  }
} 