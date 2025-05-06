// import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import db from "@/lib/db";
// import { and, eq } from "drizzle-orm";
// import { users, userRoleEnum } from "@/lib/db/schema";

// API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 사용자 세션 타입 확장
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken?: string; // 액세스 토큰 추가
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      accessToken?: string; // 액세스 토큰을 세션에도 포함
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken?: string; // JWT에 액세스 토큰 추가
  }
}

// 사용자 프로필을 가져오는 함수
async function fetchUserProfile(accessToken: string) {
  try {
    const response = await fetch(`${API_URL}user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
    
    if (!response.ok) {
      console.error('프로필 가져오기 실패:', response.status);
      return null;

    }


    return await response.json();
  } catch (error) {
    console.error('프로필 요청 오류:', error);
    return null;
  }
}

// 인증 옵션 생성 및 내보내기
export const authOptions: NextAuthOptions = {
  // DB 어댑터 대신 API 사용
  // adapter: DrizzleAdapter(db),
  
  // 세션 설정
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24시간 (1일)
  },
  
  // 페이지 설정
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  
  // 인증 제공자 설정
  providers: [
    CredentialsProvider({
      name: "자격 증명",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('로그인 실패: 이메일 또는 비밀번호가 없음');
          return null;
        }

        try {
          // API 요청 URL 로깅
          const apiUrl = `${API_URL}auth/signin`;
          console.log('API 요청 URL:', apiUrl);
          
          // API를 통한 로그인 요청
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          // API 응답에서 토큰과 사용자 정보 가져오기
          if (data.accessToken) {
            console.log('로그인 성공: 토큰 받음');
            
            // 토큰을 이용해 사용자 프로필 정보 가져오기
            const userProfile = await fetchUserProfile(data.accessToken);
            console.log(userProfile);
            // 사용자 정보 반환
            return {
              id: userProfile?.id || data.user?.id || 'user-id',
              email: userProfile?.email || data.user?.email || credentials.email,
              name: userProfile?.name || data.user?.name || '사용자',
              role: userProfile?.role || data.user?.role || 'CUSTOMER',
              accessToken: data.accessToken, // 토큰을 user 객체에 포함시킴
            };
          }
          
          console.log('로그인 실패: 토큰이 없음');
          return null;
        } catch (error) {
          console.error('로그인 오류:', error);
          return null;
        }
      },
    }),
  ],

  // JWT 콜백 설정
  callbacks: {
    // JWT 토큰에 사용자 정보 추가
    async jwt({ token, user, account }) {
      if (user) {
        console.log('JWT 토큰 생성:', user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        // 액세스 토큰도 JWT에 포함시킴
        if ('accessToken' in user) {
          token.accessToken = user.accessToken;
        }
      } else if (token.accessToken) {
        // 토큰 재발급 또는 세션 유지할 때 프로필 정보 업데이트
        try {
          const userProfile = await fetchUserProfile(token.accessToken as string);
          if (userProfile) {
            token.id = userProfile.id || token.id;
            token.email = userProfile.email || token.email;
            token.name = userProfile.name || token.name;
            token.role = userProfile.role || token.role;
          }
        } catch (error) {
          console.error('토큰 갱신 중 프로필 가져오기 실패:', error);
        }
      }
      return token;
    },
    
    // 세션에 사용자 정보 추가
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        // 액세스 토큰을 세션에도 포함시킴 (클라이언트에서 사용 가능)
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  
  // 이벤트 핸들러
  events: {
    async signIn({ user }) {
      // 로그인 성공 이벤트 (클라이언트에서 처리할 수 있도록 window 객체에 이벤트 발생)
      if (user.accessToken && typeof window !== 'undefined') {
        // 토큰을 저장하는 이벤트 발생 - 클라이언트 측에서 처리
        const event = new CustomEvent('auth:token-received', { 
          detail: { accessToken: user.accessToken } 
        });
        window.dispatchEvent(event);
      }
    },
    async signOut() {
      // 로그아웃 이벤트 (토큰 삭제 이벤트 발생)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:signout'));
      }
    },
  },
  
  // 보안 설정
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 