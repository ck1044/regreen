import React from "react";
import Image from "next/image";
import { formatInternalApiUrl } from "@/app/api/routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// 가게 상세 정보 인터페이스
interface InventoryItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  endTime: string;
}

interface ShopDetail {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  siteUrl: string;
  category: {
    id: number;
    name: string;
  };
  phoneNumber: string;
  inventories: InventoryItem[];
  storeInfo: string;
  storePickupTime: string;
}

// 가게 상세 정보를 가져오는 비동기 함수
async function getShopDetail(id: string, accessToken?: string): Promise<ShopDetail | null> {
  try {
    // API URL 설정
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiEndpoint = `${baseUrl}store/${id}`;
    console.log('API 엔드포인트:', apiEndpoint);
    
    // 직접 API 호출로 가게 상세 정보 요청
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
      // 401 오류는 인증 실패이므로 null 반환
      if (response.status === 401) {
        console.log("인증 실패로 가게 상세 정보를 가져오지 못했습니다.");
        return null;
      }
      throw new Error(`가게 상세 정보 가져오기 실패: ${response.status} - ${response.statusText}`);
    }
    
    const shopDetail = await response.json();
    console.log('가져온 가게 상세 정보:', shopDetail);
    
    return shopDetail;
  } catch (error) {
    console.error("가게 상세 정보 가져오기 오류:", error);
    return null;
  }
}

// 날짜 포맷 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
  // 서버 세션 가져오기
  const session = await getServerSession(authOptions);
  
  // 세션에서 액세스 토큰 가져오기
  const accessToken = session?.user?.accessToken;
  
  // 토큰 존재 여부에 따라 다른 메시지 출력
  console.log('사용자 로그인 상태:', session ? '로그인됨' : '로그인되지 않음');
  console.log('토큰 존재 여부:', accessToken ? '있음' : '없음');
  
  // API를 통해 가게 상세 정보 가져오기
  const shopDetail = await getShopDetail(params.id, accessToken);

  if (!shopDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500">가게 정보를 찾을 수 없습니다</h1>
        <p className="mt-2">요청한 가게 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* 가게 기본 정보 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 w-full">
          {shopDetail.imageUrl ? (
            <Image
              src={shopDetail.imageUrl}
              alt={shopDetail.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">이미지 없음</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">{shopDetail.name}</h1>
              <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded mt-2">
                {shopDetail.category.name}
              </span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3 text-gray-700">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {shopDetail.address}
            </p>
            
            {shopDetail.phoneNumber && (
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {shopDetail.phoneNumber}
              </p>
            )}
            
            {shopDetail.storePickupTime && (
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                픽업 시간: {shopDetail.storePickupTime}
              </p>
            )}
            
            {shopDetail.siteUrl && (
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a href={shopDetail.siteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  가게 웹사이트 방문
                </a>
              </p>
            )}
          </div>
          
          {shopDetail.storeInfo && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">가게 소개</h2>
              <p className="text-gray-700 whitespace-pre-line">{shopDetail.storeInfo}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 재고 상품 목록 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#0f172a] mb-4">판매 중인 상품</h2>
        
        {shopDetail.inventories && shopDetail.inventories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopDetail.inventories.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                <div className="relative h-32 w-32 flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">이미지 없음</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-grow">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-green-600 font-bold">{item.price.toLocaleString()}원</p>
                  <p className="text-sm text-gray-500 mt-1">
                    판매 마감: {formatDate(item.endTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">현재 판매 중인 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
} 