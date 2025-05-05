import { NextRequest, NextResponse } from 'next/server';
import { USER_ROUTES, formatExternalApiUrl } from '@/app/api/routes';
import { getAuthToken } from '@/lib/auth/token';

/**
 * 사용자 프로필 조회 API 핸들러
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
    const apiEndpoint = formatExternalApiUrl(USER_ROUTES.PROFILE);
    
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
      console.error('프로필 조회 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '프로필 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('프로필 조회 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 사용자 프로필 업데이트 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function PATCH(request: NextRequest) {
  try {
    // 토큰 가져오기
    const token = await getAuthToken(request);
    
    if (!token) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    // 요청 데이터 파싱
    const requestData = await request.json();
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(USER_ROUTES.UPDATE_PROFILE);
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
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
      
      const responseText = await response.text();
      console.error('원본 응답 텍스트:', responseText);
      
      return NextResponse.json(
        { message: '서버 응답을 파싱할 수 없습니다.' },
        { status: 500 }
      );
    }
    
    // API 서버 응답이 실패일 경우
    if (!response.ok) {
      console.error('프로필 업데이트 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '프로필 업데이트 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('프로필 업데이트 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 