import React from "react";
import { ShopCard } from "@/components/custom/shop-card";
import apiClient from "@/lib/api"; // API 클라이언트 임포트

// 가게 정보 인터페이스 정의
interface ShopData {
  id: string;
  name: string;
  imageUrl?: string;
  image?: string;
  address?: string;
  location?: string;
  category?: { name: string } | string;
  distance?: string;
  isNew?: boolean;
}

// API에서 반환되는 가게 타입
interface ApiStore {
  id: number | string;
  name: string;
  imageUrl?: string;
  address?: string;
  category?: {
    id: number;
    name: string;
  };
}

// 가게 목록을 가져오는 비동기 함수
async function getShops(): Promise<ShopData[]> {
  try {
    // API로 가게 목록 요청
    const shops = await apiClient.store.getAll();
    
    // API 응답을 ShopData 형식으로 변환
    return shops.map((shop: ApiStore) => ({
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
  // API를 통해 가게 목록 가져오기
  const shops = await getShops();
  
  // 가게 데이터가 없을 경우 더미 데이터 사용 (개발용)
  const shopList: ShopData[] = shops.length > 0 ? shops : [
    {
      id: "1",
      name: "맛있는 비건 레스토랑",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      address: "서울시 강남구",
      category: { name: "비건" },
      isNew: true
    },
    {
      id: "2",
      name: "유기농 마켓",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      address: "서울시 마포구",
      category: { name: "마켓" },
      distance: "1.5km"
    },
    {
      id: "3",
      name: "친환경 베이커리",
      imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      address: "서울시 종로구",
      category: { name: "베이커리" }
    },
    {
      id: "4",
      name: "로컬 푸드 카페",
      imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      address: "서울시 용산구",
      category: { name: "카페" },
      distance: "2.3km"
    }
  ];
  
  return (
    <div>
      {/* 인기 가게 섹션 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0f172a]">인기 가게</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {shopList.map((shop) => (
            <ShopCard
              key={shop.id}
              id={shop.id}
              name={shop.name}
              image={shop.imageUrl || shop.image || ''} 
              location={shop.address || shop.location || ''}
              category={typeof shop.category === 'object' ? shop.category.name : shop.category}
              distance={shop.distance}
              isNew={shop.isNew}
            />
          ))}
        </div>
      </div>
    </div>
  );
}