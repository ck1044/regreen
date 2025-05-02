import { NextResponse } from 'next/server';
import { SignupRequest } from '@/auth/signup';

/**
 * 회원가입 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const requestData: SignupRequest = await request.json();
    
    // API 서버로 요청 전달
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.201.108.28/v1/api/';
    
    // DB 연결이 아닌 외부 API 호출을 사용
    const response = await fetch(`${API_URL}auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    // 응답 데이터 파싱
    const responseData = await response.json();
    
    // API 서버 응답이 실패일 경우
    if (!response.ok) {
      return NextResponse.json(
        { message: responseData.message || '회원가입 처리 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/*
// DB 관련 코드 주석처리 - 이제 직접 DB를 사용하지 않고 API만 사용함
import { db } from '@/lib/db';

async function createUser(userData) {
  return await db.user.create({
    data: userData
  });
}

async function checkExistingUser(email) {
  return await db.user.findUnique({
    where: { email }
  });
}
*/ 