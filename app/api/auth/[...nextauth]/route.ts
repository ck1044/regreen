// import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import db from "@/lib/db";
// import { and, eq } from "drizzle-orm";
// import { users, userRoleEnum } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { API_CONFIG } from "@/db";

// API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.baseUrl;

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

// NextAuth 옵션 설정
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
          return null;
        }

        try {
          // API를 통한 로그인 요청
          const response = await fetch(`${API_URL}auth/signin`, {
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
            
            // 사용자 정보 반환
            return {
              id: data.user?.id || 'user-id',
              email: data.user?.email || credentials.email,
              name: data.user?.name || '사용자',
              role: data.user?.role || 'CUSTOMER',
              accessToken: data.accessToken, // 토큰을 user 객체에 포함시킴
            };
          }
          
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

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 