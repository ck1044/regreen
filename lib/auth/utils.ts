// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import apiClient from "@/lib/api";

// 서버 컴포넌트에서 현재 세션 가져오기
export async function getSession() {
  // return await getServerSession(authOptions);
  // 실제 API 호출을 통한 세션 정보 가져오기
  const user = apiClient.getUserProfile();
  return user ? { user } : null;
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