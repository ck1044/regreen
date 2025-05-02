import React from "react";
import { ShopCard } from "@/components/custom/shop-card";

export default function ShopsPage() {
  // 인기 가게 목록 데이터
  const popularShops = [
    {
      id: "1",
      name: "맛있는 비건 레스토랑",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 강남구",
      category: "비건",
      isNew: true
    },
    {
      id: "2",
      name: "유기농 마켓",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 마포구",
      distance: "1.5km"
    },
    {
      id: "3",
      name: "친환경 베이커리",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 종로구",
      category: "베이커리"
    },
    {
      id: "4",
      name: "로컬 푸드 카페",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 용산구",
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
          {popularShops.map((shop) => (
            <ShopCard
              key={shop.id}
              id={shop.id}
              name={shop.name}
              image={shop.image}
              location={shop.location}
              category={shop.category}
              distance={shop.distance}
              isNew={shop.isNew}
            />
          ))}
        </div>
      </div>
    </div>
  );
}