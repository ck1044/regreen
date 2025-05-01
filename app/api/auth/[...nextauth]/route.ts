import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "../../../../db";
import { and, eq } from "drizzle-orm";
import { users, userRoleEnum } from "../../../../db/schema";
import { cookies } from "next/headers";

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
  // Drizzle 어댑터 사용
  adapter: DrizzleAdapter(db),
  
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

        // 이메일로 사용자 찾기
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) {
          return null;
        }

        // 비밀번호 확인
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // 인증 성공 시 사용자 정보 반환
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
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