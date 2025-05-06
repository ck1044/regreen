import { NextRequest, NextResponse } from 'next/server';
import { INVENTORY_ROUTES, formatExternalApiUrl, InventoryDetail } from '@/app/api/routes';
import { getAuthToken } from '@/lib/auth/token';

/**
 * 재고 상세 조회 API 핸들러
 * @param request - Next.js 요청 객체
 * @param params - 라우트 파라미터
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { inventoryId: string } }
) {
  try {
    const inventoryId = params.inventoryId;
    
    if (!inventoryId || isNaN(Number(inventoryId))) {
      return NextResponse.json(
        { message: '유효하지 않은 재고 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 토큰 가져오기 (선택적 - 인증 없이도 조회 가능한 경우)
    const token = await getAuthToken(request);
    
    // API 엔드포인트 구성
    const apiEndpoint = formatExternalApiUrl(INVENTORY_ROUTES.DETAIL(Number(inventoryId)));
    
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
    let responseData: InventoryDetail;
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
      console.error('재고 상세 조회 실패:', responseData);
      return NextResponse.json(
        { message: '재고 상세 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }
    
    // 성공 응답 반환
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('재고 상세 조회 API 오류:', error);
    
    // 에러 응답 반환
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 