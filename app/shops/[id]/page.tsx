"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MapPin, Clock, Phone, Globe, Star, Bell, BellOff, Share2 } from "lucide-react";
import { InventoryCard } from "@/components/custom/inventory-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionButton } from '@/components/shop/subscription-button';

// 임시 데이터 - 실제 구현 시에는 API에서 가게 정보를 가져와야 함
const shopData = {
  "1": {
    id: "1",
    name: "맛있는 비건 레스토랑",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "신선한 유기농 채소로 만든 건강한 비건 요리를 제공하는 레스토랑입니다. 모든 재료는 지역 농가에서 공급받아 신선함을 보장합니다.",
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    website: "www.vegan-restaurant.com",
    rating: 4.8,
    reviewCount: 128,
    isSubscribed: false,
    businessHours: [
      { day: "월", open: "11:00", close: "21:00" },
      { day: "화", open: "11:00", close: "21:00" },
      { day: "수", open: "11:00", close: "21:00" },
      { day: "목", open: "11:00", close: "21:00" },
      { day: "금", open: "11:00", close: "22:00" },
      { day: "토", open: "11:00", close: "22:00" },
      { day: "일", open: "휴무", close: "" }
    ],
    mapUrl: "https://maps.google.com/maps?q=37.5087529,127.0637701&z=15&output=embed"
  },
  "2": {
    id: "2",
    name: "유기농 마켓",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "지역 농가에서 직접 공급받는 신선한 유기농 식품을 판매하는 마켓입니다. 친환경 포장재를 사용하여 환경 보호에 앞장서고 있습니다.",
    address: "서울시 마포구 와우산로 45",
    phone: "02-9876-5432",
    website: "www.organic-market.com",
    rating: 4.2,
    reviewCount: 94,
    isSubscribed: true,
    businessHours: [
      { day: "월", open: "09:00", close: "19:00" },
      { day: "화", open: "09:00", close: "19:00" },
      { day: "수", open: "09:00", close: "19:00" },
      { day: "목", open: "09:00", close: "19:00" },
      { day: "금", open: "09:00", close: "20:00" },
      { day: "토", open: "10:00", close: "17:00" },
      { day: "일", open: "휴무", close: "" }
    ],
    mapUrl: "https://maps.google.com/maps?q=37.553855,126.9253234&z=15&output=embed"
  }
};

// 임시 재고 데이터
const inventoryData = {
  "1": [
    {
      id: "101",
      name: "비건 샐러드",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "맛있는 비건 레스토랑",
      shopId: "1",
      originalPrice: 12000,
      discountPrice: 8400,
      discountRate: 30,
      quantity: 5,
      expiresAt: "오늘 마감"
    },
    {
      id: "102",
      name: "비건 버거",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "맛있는 비건 레스토랑",
      shopId: "1",
      originalPrice: 10000,
      discountPrice: 6000,
      discountRate: 40,
      quantity: 3,
      expiresAt: "2시간 남음"
    }
  ],
  "2": [
    {
      id: "201",
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
      id: "202",
      name: "친환경 채소 바구니",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "유기농 마켓",
      shopId: "2",
      originalPrice: 18000,
      discountPrice: 12600,
      discountRate: 30,
      quantity: 3,
      expiresAt: "내일 마감"
    },
    {
      id: "203",
      name: "통밀 식빵",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "유기농 마켓",
      shopId: "2",
      originalPrice: 5000,
      discountPrice: 3000,
      discountRate: 40,
      quantity: 2,
      expiresAt: "3시간 남음"
    }
  ]
};

export default function ShopDetailPage({ params }: { params: { id: string } }) {
  const [isSubscribed, setIsSubscribed] = useState(
    shopData[params.id as keyof typeof shopData]?.isSubscribed || false
  );

  const shop = shopData[params.id as keyof typeof shopData];
  const inventory = inventoryData[params.id as keyof typeof inventoryData] || [];

  const toggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
    // 실제 구현 시 API 호출하여 구독 상태 변경 필요
  };

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[50vh]">
        <h1 className="text-xl font-bold mb-2">가게를 찾을 수 없습니다</h1>
        <p className="text-[#64748b] text-[#94a3b8] mb-4">요청하신 가게 정보가 존재하지 않습니다.</p>
        <Link href="/shops">
          <Button>가게 목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* 가게 헤더 이미지 */}
      <div className="relative h-[200px] w-full">
        <Image
          src={shop.image}
          alt={shop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/80 p-2 rounded-full shadow">
            <Share2 size={20} className="text-[#0f172a]" />
          </button>
        </div>
      </div>

      {/* 가게 기본 정보 */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-[#0f172a] text-white">{shop.name}</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <SubscriptionButton 
              userId="user-1" // 실제 구현에서는 인증된 사용자 ID
              shopId={shop.id}
              shopName={shop.name}
              size="icon"
            />
          </div>
        </div>

        <div className="flex items-center mt-1 text-sm">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="font-medium">{shop.rating}</span>
          <span className="text-[#64748b] text-[#94a3b8] ml-1">({shop.reviewCount})</span>
        </div>

        <p className="mt-3 text-[#0f172a] text-white text-sm">
          {shop.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-start text-sm">
            <MapPin className="h-5 w-5 text-[#64748b] text-[#94a3b8] mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-[#0f172a] text-white">{shop.address}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-5 w-5 text-[#64748b] text-[#94a3b8] mr-2" />
            <span className="text-[#0f172a] text-white">{shop.phone}</span>
          </div>
          {shop.website && (
            <div className="flex items-center text-sm">
              <Globe className="h-5 w-5 text-[#64748b] text-[#94a3b8] mr-2" />
              <a 
                href={`https://${shop.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#5b87f0] underline"
              >
                {shop.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 탭 섹션 */}
      <Tabs defaultValue="inventory" className="w-full">
        <div className="border-b border-[#e1e7ef] border-[#303642]">
          <TabsList className="bg-transparent">
            <TabsTrigger value="inventory" className="flex-1 data-[state=active]:text-[#5DCA69] data-[state=active]:border-b-2 data-[state=active]:border-[#5DCA69]">
              할인 상품
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1 data-[state=active]:text-[#5DCA69] data-[state=active]:border-b-2 data-[state=active]:border-[#5DCA69]">
              영업 정보
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 할인 상품 탭 */}
        <TabsContent value="inventory" className="p-4">
          {inventory.length > 0 ? (
            <div className="space-y-4">
              {inventory.map((item) => (
                <Link key={item.id} href={`/inventory/${item.id}/reserve`}>
                  <InventoryCard
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#64748b] text-[#94a3b8]">
                현재 등록된 할인 상품이 없습니다.
              </p>
            </div>
          )}
        </TabsContent>

        {/* 영업 정보 탭 */}
        <TabsContent value="info" className="p-4">
          <div className="mb-6">
            <h3 className="font-medium text-[#0f172a] text-white text-sm mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 영업 시간
            </h3>
            <div className="bg-[#f8fafc] bg-[#1e293b] p-3 rounded-lg">
              <ul className="space-y-1 text-sm">
                {shop.businessHours.map((hours, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="font-medium text-[#0f172a] text-white">{hours.day}</span>
                    <span className="text-[#64748b] text-[#94a3b8]">
                      {hours.open === "휴무" ? "휴무" : `${hours.open} - ${hours.close}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-[#0f172a] text-white text-sm mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> 위치 정보
            </h3>
            <div className="bg-[#f8fafc] bg-[#1e293b] p-0 rounded-lg overflow-hidden">
              <iframe
                src={shop.mapUrl}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title={`${shop.name} 위치`}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 큰 구독 버튼 (하단에 고정) */}
      <div className="fixed bottom-20 left-0 right-0 p-4 max-w-md mx-auto">
        <SubscriptionButton 
          userId="user-1" // 실제 구현에서는 인증된 사용자 ID
          shopId={shop.id}
          shopName={shop.name}
          variant="default"
          size="lg"
        />
      </div>
    </div>
  );
} 