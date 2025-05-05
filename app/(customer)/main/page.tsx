import React from "react";
import Link from "next/link";
import { InventoryCard } from "@/components/custom/inventory-card";
//import { EcoImpactCard, type EcoMetric, type EcoMetricType } from "@/components/custom/eco-impact-card";
import { ArrowRight, Leaf } from "lucide-react";

export default function MainPage() {


  // 최근 등록된 재고 목록 데이터
  const latestInventories = [
    {
      id: "1",
      name: "유기농 사과 세트",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "유기농 마켓",
      shopId: "2",
      price: 3900,
      quantity: 5,
      expiresAt: "오늘 마감"
    },
    {
      id: "2",
      name: "통밀 빵",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "친환경 베이커리",
      shopId: "3",
      price: 4900,
      quantity: 2,
      expiresAt: "3시간 남음"
    },
    {
      id: "3",
      name: "유기농 채소 바구니",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "로컬 푸드 마켓",
      shopId: "5",
      price: 5900,
      quantity: 3,
      expiresAt: "내일 마감"
    }
  ];
  return (
    <div className="pb-16">
      {/* 서비스 소개 배너
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
          <div className="flex items-center mb-3">
            <Leaf className="mr-2 h-7 w-7 text-[#5DCA69]" />
            <h1 className="text-3xl font-bold">RE-GREEN</h1>
          </div>
          <p className="text-center text-lg mb-6 max-w-md">
            음식물 쓰레기를 줄이고<br /> 지구를 지키는 현명한 소비
          </p>
          <Link href="/shops">
            <button className="bg-[#5DCA69] hover:bg-[#4db058]  py-2 px-6 rounded-full font-medium transition-colors">
              지금 시작하기
            </button>
          </Link>
        </div>
      </div> */}
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
          {latestInventories.map((item) => (
            <InventoryCard
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              shopName={item.shopName}
              shopId={item.shopId}
              price={item.price}
              quantity={item.quantity}
              expiresAt={item.expiresAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 