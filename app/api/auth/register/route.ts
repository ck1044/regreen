import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import db from "@/lib/db";
// import { users, userRoleEnum } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";


// API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phoneNumber, role } = body;

    // 필수 필드 검증
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { message: "필수 정보가 누락되었습니다" },
        { status: 400 }
      );
    }

    // API를 통한 회원가입 요청
    try {
      const response = await fetch(`${API_URL}auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber,
          role: role || 'CUSTOMER',
        }),
      });

      // API 응답 처리
      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || "회원가입 처리 중 오류가 발생했습니다" },
          { status: response.status }
        );
      }

      return NextResponse.json(
        { 
          message: "회원가입이 완료되었습니다", 
          accessToken: data.accessToken,
          user: data.user,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("API 호출 오류:", error);
      return NextResponse.json(
        { message: "외부 API 연결 중 오류가 발생했습니다" },
        { status: 500 }
      );
    }

    /* DB 직접 접근 코드 주석 처리
    // 이메일 중복 체크
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다" },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 역할 검증
    // 기본값은 'CUSTOMER'로 설정하되, 요청된 역할이 유효하면 해당 역할 사용
    const validRole = userRoleEnum.enumValues.includes(role)
      ? role
      : "CUSTOMER";

    // 사용자 생성
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      phone,
      role: validRole,
    }).returning();

    // 민감한 정보 제외하고 응답
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(
      { 
        message: "회원가입이 완료되었습니다", 
        user: userWithoutPassword,
      },
      { status: 201 }
    );
    */
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
} 