import NextAuth from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);

// Next.js 라우트 핸들러 함수 내보내기
export { handler as GET, handler as POST }; 