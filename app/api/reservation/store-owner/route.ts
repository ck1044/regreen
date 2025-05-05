import { NextRequest, NextResponse } from 'next/server';
import { RESERVATION_ROUTES, formatExternalApiUrl } from '@/app/api/routes';
import { getAuthToken } from '@/lib/auth/token';

/**
 * 점주 당일 예약 목록 조회 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function GET(request: NextRequest) {
  try {
    // 토큰 가져오기
    const token = await getAuthToken(request);
    
    if (!token) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(RESERVATION_ROUTES.STORE_OWNER);
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    // 응답 데이터 파싱
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('응답 데이터 파싱 오류:', parseError);
      
      const responseText = await response.text();
      console.error('원본 응답 텍스트:', responseText);
      
      return NextResponse.json(
        { message: '서버 응답을 파싱할 수 없습니다.' },
        { status: 500 }
      );
    }
    
    // API 서버 응답이 실패일 경우
    if (!response.ok) {
      console.error('점주 예약 목록 조회 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '예약 목록 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('점주 예약 목록 조회 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 