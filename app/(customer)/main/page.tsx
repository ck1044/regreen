import React from "react";
import Link from "next/link";
import { InventoryCard } from "@/components/custom/inventory-card";
import { ArrowRight } from "lucide-react";
import { formatInternalApiUrl, INVENTORY_ROUTES } from "@/app/api/routes";
import { cookies } from 'next/headers';
import { getAuthToken } from "@/lib/auth/token";
import { NextRequest } from 'next/server';

// API 명세서에 맞게 재고 데이터 타입 정의
interface InventoryItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  startTime: string;
  endTime: string;
}

// async 서버 컴포넌트로 변경
export default async function MainPage() {
  // 서버 컴포넌트에서 API 호출
  const fetchInventory = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiEndpoint = `${baseUrl}inventory`;
      console.log(apiEndpoint);
      // 직접 API 요청 생성
      const request = new Request(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // NextRequest로 변환하여 getAuthToken에 전달
      const nextRequest = new NextRequest(request);
      const token = await getAuthToken(nextRequest);
      
      // 최종 fetch 요청에 인증 토큰 추가
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`재고 목록 가져오기 실패: ${response.status}`);
      }
      
      return await response.json() as InventoryItem[];
    } catch (error) {
      console.error('재고 목록 조회 API 오류:', error);
      return [];
    }
  };

  // 재고 데이터 가져오기
  const inventoryItems = await fetchInventory();
  
  // 인벤토리 데이터를 컴포넌트에 맞게 변환
  const latestInventories = inventoryItems.map(item => ({
    id: item.id.toString(),
    name: item.name,
    image: item.imageUrl || '/placeholder-food.jpg',
    price: item.price,
    quantity: item.quantity,
    expiresAt: item.endTime ? new Date(item.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : undefined
  }));

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