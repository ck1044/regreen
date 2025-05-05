import { NextResponse } from 'next/server';
import { SignupRequest } from '@/auth/signup';
import { AUTH_ROUTES, formatExternalApiUrl } from '@/app/api/routes';

/**
 * 회원가입 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const requestData: SignupRequest = await request.json();
    console.log('회원가입 요청 데이터:', requestData);
    
    // API 엔드포인트 구성 (routes.ts 사용)
    const apiEndpoint = formatExternalApiUrl(AUTH_ROUTES.SIGNUP);
    console.log('최종 API 엔드포인트:', apiEndpoint);
    
    // 외부 API 호출 (서버 사이드에서는 CORS 제한이 없음)
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('API 응답 상태:', response.status);
      
      // 응답 데이터 파싱
      let responseData;
      try {
        responseData = await response.json();
        console.log('API 응답 데이터:', responseData);
      } catch (parseError) {
        console.error('응답 데이터 파싱 오류:', parseError);
        
        // 응답 본문 텍스트로 시도
        const responseText = await response.text();
        console.error('원본 응답 텍스트:', responseText);
        
        return NextResponse.json(
          { message: '서버 응답을 파싱할 수 없습니다.' },
          { status: 500 }
        );
      }
      
      // API 서버 응답이 실패일 경우
      if (!response.ok) {
        console.error('회원가입 실패:', responseData);
        return NextResponse.json(
          { message: responseData.message || '회원가입 처리 중 오류가 발생했습니다.' },
          { status: response.status }
        );
      }
      
      // 성공 응답 반환
      return NextResponse.json(responseData);
      
    } catch (fetchError) {
      console.error('API 서버 통신 오류:', fetchError);
      return NextResponse.json(
        { message: '외부 API 서버와 통신 중 오류가 발생했습니다.' },
        { status: 502 }
      );
    }
    
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