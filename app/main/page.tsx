import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopCard } from "@/components/custom/shop-card";
import { InventoryCard } from "@/components/custom/inventory-card";
import { EcoImpactCard, type EcoMetric, type EcoMetricType } from "@/components/custom/eco-impact-card";
import { ArrowRight, Leaf } from "lucide-react";

export default function MainPage() {
  // 인기 가게 목록 데이터
  const popularShops = [
    {
      id: "1",
      name: "맛있는 비건 레스토랑",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 강남구",
      rating: 4.8,
      category: "비건",
      isNew: true
    },
    {
      id: "2",
      name: "유기농 마켓",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 마포구",
      rating: 4.2,
      distance: "1.5km"
    },
    {
      id: "3",
      name: "친환경 베이커리",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 종로구",
      rating: 4.5,
      category: "베이커리"
    },
    {
      id: "4",
      name: "로컬 푸드 카페",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "서울시 용산구",
      rating: 4.3,
      distance: "2.3km"
    }
  ];

  // 최근 등록된 재고 목록 데이터
  const latestInventories = [
    {
      id: "1",
      name: "유기농 사과 세트",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "유기농 마켓",
      shopId: "2",
      originalPrice: 12000,
      discountPrice: 8400,
      discountRate: 30,
      quantity: 5,
      expiresAt: "오늘 마감"
    },
    {
      id: "2",
      name: "통밀 빵",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "친환경 베이커리",
      shopId: "3",
      originalPrice: 5000,
      discountPrice: 3000,
      discountRate: 40,
      quantity: 2,
      expiresAt: "3시간 남음"
    },
    {
      id: "3",
      name: "유기농 채소 바구니",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "로컬 푸드 마켓",
      shopId: "5",
      originalPrice: 18000,
      discountPrice: 12600,
      discountRate: 30,
      quantity: 3,
      expiresAt: "내일 마감"
    }
  ];

  // 환경 지표 데이터
  const ecoMetrics: EcoMetric[] = [
    {
      type: "food_waste" as EcoMetricType,
      value: 127,
      unit: "kg",
      change: {
        value: 5,
        isPositive: true
      }
    },
    {
      type: "water_saved" as EcoMetricType,
      value: 1420,
      unit: "L",
      change: {
        value: 12,
        isPositive: true
      }
    },
    {
      type: "co2_reduced" as EcoMetricType,
      value: 84,
      unit: "kg"
    },
    {
      type: "trees_saved" as EcoMetricType,
      value: 4,
      unit: "그루"
    }
  ];

  return (
    <div className="pb-16">
      {/* 서비스 소개 배너 */}
      <div className="relative h-[300px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1470290378333-705f34dc0958?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt="RE-GREEN 서비스 배너"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <div className="flex items-center mb-3">
            <Leaf className="mr-2 h-7 w-7 text-[#5DCA69]" />
            <h1 className="text-3xl font-bold">RE-GREEN</h1>
          </div>
          <p className="text-center text-lg mb-6 max-w-md">
            음식물 쓰레기를 줄이고 지구를 지키는 현명한 소비
          </p>
          <Link href="/shops">
            <button className="bg-[#5DCA69] hover:bg-[#4db058] text-white py-2 px-6 rounded-full font-medium transition-colors">
              지금 시작하기
            </button>
          </Link>
        </div>
      </div>

      {/* 환경 영향 요약 */}
      <div className="px-4 py-6 bg-[#f8fafc]">
        <EcoImpactCard
          title="이번 달의 환경 기여"
          description="함께 만들어가는 지속가능한 미래"
          timeFrame="2023년 5월"
          metrics={ecoMetrics}
        />
      </div>

      {/* 인기 가게 섹션 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0f172a] ">인기 가게</h2>
          <Link href="/shops" className="text-sm text-[#5b87f0] hover:underline flex items-center">
            더보기
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {popularShops.map((shop) => (
            <ShopCard
              key={shop.id}
              id={shop.id}
              name={shop.name}
              image={shop.image}
              location={shop.location}
              rating={shop.rating}
              category={shop.category}
              distance={shop.distance}
              isNew={shop.isNew}
            />
          ))}
        </div>
      </div>

      {/* 최근 등록된 재고 섹션 */}
      <div className="p-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0f172a]">오늘의 할인 상품</h2>
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
              originalPrice={item.originalPrice}
              discountPrice={item.discountPrice}
              discountRate={item.discountRate}
              quantity={item.quantity}
              expiresAt={item.expiresAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 