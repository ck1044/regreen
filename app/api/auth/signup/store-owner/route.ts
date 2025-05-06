import { NextResponse } from 'next/server';
import { StoreOwnerSignupRequest, AUTH_ROUTES, formatExternalApiUrl } from '@/app/api/routes';

/**
 * 사장님 회원가입 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function POST(request: Request) {
  try {
    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dataString = formData.get('data') as string;
    
    if (!file || !dataString) {
      return NextResponse.json(
        { message: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 요청 데이터 파싱
    const requestData: StoreOwnerSignupRequest = JSON.parse(dataString);
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(AUTH_ROUTES.SIGNUP_STORE_OWNER);
    
    // FormData 생성 및 외부 API로 전달
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    
    // JSON 데이터를 FormData에 추가
    Object.entries(requestData).forEach(([key, value]) => {
      if (key === 'store') {
        // store 객체는 각 필드별로 추가
        Object.entries(value as Record<string, any>).forEach(([storeKey, storeValue]) => {
          apiFormData.append(`store.${storeKey}`, storeValue.toString());
        });
      } else {
        apiFormData.append(key, value as string);
      }
    });
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      body: apiFormData,
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
      console.error('사장님 회원가입 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '회원가입 처리 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('사장님 회원가입 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 