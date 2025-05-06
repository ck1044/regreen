import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 보호된 라우트 정의
const customerRoutes = [
  '/main',
  '/inventory',
  '/my-reservations',
  '/shops',
  '/(customer)/profile',
];

const ownerRoutes = [
  '/owner_profile',
  '/owner/reservations',
  '/manage-inventory',
  '/manage-inventory/register',

];

// 공통 라우트 (로그인한 사용자 모두 접근 가능)
const commonProtectedRoutes: string[] = [];

// 인증 확인 및 리디렉션 처리 미들웨어
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // API 라우트는 처리하지 않음
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // 토큰(세션) 확인
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // 사용자가 로그인하지 않은 경우
  if (!token) {
    // 보호된 라우트에 접근하려는 경우 로그인 페이지로 리디렉션
    if (
      customerRoutes.some(route => pathname.startsWith(route)) ||
      ownerRoutes.some(route => pathname.startsWith(route)) ||
      commonProtectedRoutes.some(route => pathname.startsWith(route))
    ) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // 인증이 필요 없는 페이지는 그대로 진행
    return NextResponse.next();
  }
  
  // 로그인했으나 역할에 맞지 않는 경우
  const userRole = token.role as string || 'CUSTOMER'; // 기본값은 고객
  
  // 판매자(STORE_OWNER)가 고객 전용 페이지에 접근하는 경우
  if (
    userRole === 'STORE_OWNER' && 
    customerRoutes.some(route => pathname.startsWith(route)) &&
    !commonProtectedRoutes.some(route => pathname.startsWith(route))
  ) {
    // 판매자 메인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/manage-inventory', request.url));
  }
  
  // 고객(CUSTOMER)이 판매자 전용 페이지에 접근하는 경우
  if (
    userRole === 'CUSTOMER' && 
    ownerRoutes.some(route => pathname.startsWith(route))
  ) {
    // 고객 메인 페이지로 리디렉션
    return NextResponse.redirect(new URL('/main', request.url));
  }
  
  // 그 외의 경우는 정상적으로 처리
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    // 인증이 필요한 라우트
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}; 