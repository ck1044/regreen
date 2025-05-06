import { NextRequest, NextResponse } from 'next/server';
import { INVENTORY_ROUTES, formatExternalApiUrl, InventoryCreateRequest, TodayInventoryItem } from '@/app/api/routes';
import { getAuthToken } from '@/lib/auth/token';

/**
 * 재고 생성 요청 인터페이스
 */
interface InventoryCreateRequestForm {
  name: string;
  description: string;
  price: number;
  quantity: number;
  availableTime: string;
}

/**
 * 재고 생성 API 핸들러
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
    
    // FormData 파싱
    const formData = await request.formData();
    
    // 이미지 파일 추출
    const file = formData.get('file') as File | null;
    
    // FormData에서 재고 데이터 추출
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const quantity = Number(formData.get('quantity'));
    const availableTime = formData.get('availableTime') as string;
    
    if (!name || !description || isNaN(price) || isNaN(quantity) || !availableTime) {
      return NextResponse.json(
        { message: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 데이터 구성
    const inventoryData: InventoryCreateRequest = {
      name,
      description,
      price,
      quantity,
      availableTime
    };
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(INVENTORY_ROUTES.BASE);
    
    // 외부 API로 전송할 FormData 생성
    const apiFormData = new FormData();
    
    // 데이터 필드 추가
    Object.entries(inventoryData).forEach(([key, value]) => {
      apiFormData.append(key, value.toString());
    });
    
    // 파일이 있으면 추가
    if (file) {
      apiFormData.append('file', file);
    }
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: apiFormData,
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
      console.error('재고 생성 실패:', responseData);
      return NextResponse.json(
        { message: responseData.message || '재고 생성 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData || { message: '재고가 성공적으로 생성되었습니다.' });
    
  } catch (error) {
    console.error('재고 생성 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 오늘의 재고 목록 조회 API 핸들러
 * @param request - Next.js 요청 객체
 */
export async function GET(request: NextRequest) {
  try {
    // 토큰 가져오기 (선택적 - 인증 없이도 조회 가능한 경우)
    const token = await getAuthToken(request);
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(INVENTORY_ROUTES.TODAY);
    
    // 요청 헤더 구성
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 외부 API 호출
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers,
    });
    
    // 응답 데이터 파싱
    let responseData: TodayInventoryItem[];
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
      console.error('재고 목록 조회 실패:', responseData);
      return NextResponse.json(
        { message: '재고 목록 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('재고 목록 조회 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 