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
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

// 인증 옵션 생성 및 내보내기
export const authOptions: NextAuthOptions = {
  // DB 어댑터 대신 API 사용
  // adapter: DrizzleAdapter(db),
  
  // 세션 설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
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
            // 액세스 토큰은 JWT 콜백에서 별도로 처리 (쿠키 세팅은 클라이언트에서 처리)
            console.log('로그인 성공: 토큰 및 사용자 정보 반환');
            
            // 사용자 정보 반환
            return {
              id: data.user?.id || 'user-id',
              email: data.user?.email || credentials.email,
              name: data.user?.name || '사용자',
              role: data.user?.role || 'CUSTOMER',
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
    async jwt({ token, user }) {
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
        // 액세스 토큰은 보안상 세션에 포함하지 않음
      }
      return session;
    },
  },
  
  // 보안 설정
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 