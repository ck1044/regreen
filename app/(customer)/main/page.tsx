import React from "react";
import Link from "next/link";
import { InventoryCard } from "@/components/custom/inventory-card";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// API 명세서에 맞게 재고 데이터 타입 정의
interface InventoryData {
  inventory: {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    startTime: string;
    endTime: string;
  };
  store: {
    name: string;
    category: string;
    id?: number;
  };
}

// 더미 데이터 정의


// 카테고리별 기본 이미지 설정
const getDefaultImageByCategory = (category: string): string => {
  // switch (category.toLowerCase()) {
  //   case 'bakery': return '/images/bakery-default.jpg';
  //   case 'salad': return '/images/salad-default.jpg';
  //   case 'lunchbox': return '/images/lunchbox-default.jpg';
  //   case 'fruit': return '/images/fruit-default.jpg';
  //   case 'dessert': return '/images/dessert-default.jpg';
  //   default: return '/images/food-default.jpg';
  // }
  return '/images/food-default.jpg';
};

// async 서버 컴포넌트로 변경
export default async function MainPage() {
  // 서버 세션 가져오기
  const session = await getServerSession(authOptions);
  
  // 세션에서 액세스 토큰 가져오기
  // @ts-expect-error - accessToken 속성이 타입 정의에 없어서 무시
  const accessToken = session?.user?.accessToken;
  
  // 토큰 존재 여부에 따라 다른 메시지 출력
  console.log('사용자 로그인 상태:', session ? '로그인됨' : '로그인되지 않음');
  console.log('토큰 존재 여부:', accessToken ? '있음' : '없음');
  
  // 서버 컴포넌트에서 API 호출
  const fetchInventory = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiEndpoint = `${baseUrl}inventory`;
      console.log('API 엔드포인트:', apiEndpoint);
      
      // API 요청 헤더 설정 (토큰이 있으면 추가)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // 토큰이 있는 경우 Authorization 헤더 추가
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      // API 요청
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers,
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error(`API 오류: ${response.status} - ${response.statusText}`);
        
        // 401 오류는 인증 실패이므로 더미 데이터 사용
        if (response.status === 401) {
          console.log("인증 실패로 더미 데이터를 사용합니다.");
          return [];
        }
        
        throw new Error(`재고 목록 가져오기 실패: ${response.status}`);
      }
      
      const data = await response.json();
      // 데이터 길이 및 첫 번째 항목 구조 출력

      return data as InventoryData[];
    } catch (error) {
      console.error('재고 목록 조회 API 오류:', error);
      console.error('오류 세부 정보:', JSON.stringify(error, null, 2));
      return [];
    }
  };

  // 재고 데이터 가져오기
  let inventoryItems: InventoryData[] = [];
  try {
    inventoryItems = await fetchInventory();
    console.log('가져온 데이터 수:', inventoryItems.length);
  } catch (error) {
    console.error('인벤토리 데이터 로딩 오류:', error);
  }
  
  // 인벤토리 데이터를 컴포넌트에 맞게 변환 (데이터가 없으면 더미 데이터 사용)
  const latestInventories = inventoryItems.length > 0
    ? inventoryItems.map(item => ({
        id: item.inventory.id.toString(),
        name: item.inventory.name,
        image: item.inventory.imageUrl || getDefaultImageByCategory(item.store.category),
        price: item.inventory.price,
        quantity: item.inventory.quantity,
        expiresAt: item.inventory.endTime 
          ? new Date(item.inventory.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) 
          : undefined,
        shopName: item.store.name,
        shopId: (item.store.id || '0').toString(),
        category: item.store.category
      }))
    : [];

  return (
    <div className="pb-16">
      {/* 최근 등록된 재고 섹션 */}
      <div className="p-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0f172a]">오늘의 상품</h2>
          <Link href="/inventory" className="text-sm text-[#5b87f0] hover:underline flex items-center">
            더보기
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {latestInventories.length > 0 ? (
            latestInventories.map((item) => (
              <InventoryCard
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                quantity={item.quantity}
                expiresAt={item.expiresAt}
                shopName={item.shopName}
                shopId={item.shopId}
                category={item.category}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">오늘 등록된 상품이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
} 