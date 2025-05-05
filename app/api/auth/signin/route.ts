import { NextResponse } from 'next/server';
import { AUTH_ROUTES, formatExternalApiUrl } from '@/app/api/routes';

/**
 * 로그인 요청 데이터 인터페이스
 */
interface SigninRequest {
  email: string;
  password: string;
}

/**
 * 로그인 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function POST(request: Request) {
  try {
    // 요청 데이터 파싱
    const requestData: SigninRequest = await request.json();
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(AUTH_ROUTES.SIGNIN);
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    // 응답 데이터 파싱
    let responseData;
    try {
      responseData = await response.json();
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
      console.error('로그인 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '로그인 처리 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('로그인 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 