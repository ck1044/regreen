import { NextRequest, NextResponse } from 'next/server';
import { RESERVATION_ROUTES, formatExternalApiUrl } from '@/app/api/routes';
import { getAuthToken } from '@/lib/auth/token';

/**
 * 예약 생성 요청 인터페이스
 */
interface ReservationCreateRequest {
  inventoryId: number;
  pickUpTime: string;
  amount: number;
}

/**
 * 예약 생성 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function POST(request: NextRequest) {
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
    const requestData: ReservationCreateRequest = await request.json();
    
    // 필수 필드 확인
    if (!requestData.inventoryId || !requestData.pickUpTime || !requestData.amount) {
      return NextResponse.json(
        { message: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(RESERVATION_ROUTES.BASE);
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    // 응답 데이터 파싱 (응답이 없을 수 있음)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return new NextResponse(null, { status: 204 });
    }
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('응답 데이터 파싱 오류:', parseError);
      
      // 성공 응답이면 그대로 반환 (데이터가 없는 경우)
      if (response.ok) {
        return new NextResponse(null, { status: response.status });
      }
      
      return NextResponse.json(
        { message: '서버 응답을 파싱할 수 없습니다.' },
        { status: 500 }
      );
    }
    
    // API 서버 응답이 실패일 경우
    if (!response.ok) {
      console.error('예약 생성 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '예약 생성 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData || { message: '예약이 성공적으로 생성되었습니다.' });
    
  } catch (error) {
    console.error('예약 생성 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 