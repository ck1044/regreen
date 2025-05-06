import React from "react";
import { ShopCard } from "@/components/custom/shop-card";
// API 클라이언트 제거됨: 필요한 API 타입 및 경로만 임포트
import { formatInternalApiUrl, STORE_ROUTES } from "@/app/api/routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// 가게 정보 인터페이스 정의
interface ShopData {
  id: number;
  name: string;
  imageUrl?: string | null;
  address?: string | null;
  category: { id: number; name: string };
}



// 가게 목록을 가져오는 비동기 함수
async function getShops(accessToken?: string): Promise<ShopData[]> {
  try {
    // API URL 설정
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiEndpoint = `${baseUrl}store`;
    console.log('API 엔드포인트:', apiEndpoint);
    
    // 직접 API 호출로 가게 목록 요청
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // 토큰이 있는 경우 Authorization 헤더 추가
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    
    if (!response.ok) {
        // 401 오류는 인증 실패이므로 더미 데이터 사용
        if (response.status === 401) {
          console.log("인증 실패로 더미 데이터를 사용합니다.");
          return [];
        }
        throw new Error(`가게 목록 가져오기 실패: ${response.status} - ${response.statusText}`);
  
    }
    
    const shops = await response.json();
    console.log('가져온 가게 데이터 수:', shops.length);
    
    // API 응답을 ShopData 형식으로 변환
    return shops.map((shop: ShopData) => ({
      id: shop.id.toString(),
      name: shop.name,
      imageUrl: shop.imageUrl,
      address: shop.address,
      category: shop.category
    }));
  } catch (error) {
    console.error("가게 목록 가져오기 오류:", error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

export default async function ShopsPage() {
  // 서버 세션 가져오기
  const session = await getServerSession(authOptions);
  
  // 세션에서 액세스 토큰 가져오기
  // @ts-ignore - accessToken 속성이 타입 정의에 없어서 무시
  const accessToken = session?.user?.accessToken;
  
  // 토큰 존재 여부에 따라 다른 메시지 출력
  console.log('사용자 로그인 상태:', session ? '로그인됨' : '로그인되지 않음');
  console.log('토큰 존재 여부:', accessToken ? '있음' : '없음');
  
  // API를 통해 가게 목록 가져오기
  const shops = await getShops(accessToken);

  return (
    <div>
      {/* 인기 가게 섹션 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0f172a]">인기 가게</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {shops.map((shop: ShopData) => (
            <ShopCard
              key={shop.id}
              id={shop.id.toString()}
              name={shop.name}
              image={shop.imageUrl || ''} 
              location={shop.address || ''}
              category={typeof shop.category === 'object' ? shop.category.name : shop.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}