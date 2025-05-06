import { NextRequest, NextResponse } from "next/server";


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
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
} 