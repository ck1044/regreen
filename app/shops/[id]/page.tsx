"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MapPin, Clock, Phone, Globe } from "lucide-react";
import { InventoryCard } from "@/components/custom/inventory-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      price: 8400,
      quantity: 5,
      expiresAt: "오늘 마감"
    },
    {
      id: "102",
      name: "비건 버거",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "맛있는 비건 레스토랑",
      shopId: "1",
      price: 6000,
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
      price: 8400,
      quantity: 5,
      expiresAt: "오늘 마감"
    },
    {
      id: "202",
      name: "친환경 채소 바구니",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "유기농 마켓",
      shopId: "2",
      price: 12600,
      quantity: 3,
      expiresAt: "내일 마감"
    },
    {
      id: "203",
      name: "통밀 식빵",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      shopName: "유기농 마켓",
      shopId: "2",
      price: 5000,
      quantity: 2,
      expiresAt: "3시간 남음"
    }
  ]
};

export default function ShopDetailPage({ params }: { params: { id: string } }) {
  const shop = shopData[params.id as keyof typeof shopData];
  const inventory = inventoryData[params.id as keyof typeof inventoryData] || [];

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[50vh]">
        <h1 className="text-xl font-bold mb-2">가게를 찾을 수 없습니다</h1>
        <p className="text-black mb-4">요청하신 가게 정보가 존재하지 않습니다.</p>
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
      </div>

      {/* 가게 기본 정보 */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-black">{shop.name}</h1>
        </div>

        <p className="mt-3 text-black text-sm">
          {shop.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-start text-sm">
            <MapPin className="h-5 w-5 text-black mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-black">{shop.address}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-5 w-5 text-black mr-2" />
            <span className="text-black">{shop.phone}</span>
          </div>
          {shop.website && (
            <div className="flex items-center text-sm">
              <Globe className="h-5 w-5 text-black mr-2" />
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
        <div className="border-b border-[#303642] ">
          <TabsList className="bg-transparent">
            <TabsTrigger value="inventory" className="flex-1 data-[state=active]:text-[#5DCA69] data-[state=active]:border-b-2 data-[state=active]:border-[#5DCA69]">
              할인 상품
            </TabsTrigger>
            <TabsTrigger value="info" className="flex-1 data-[state=active]:text-[#5DCA69] data-[state=active]:border-b-2 data-[state=active]:border-[#5DCA69]">
              위치 정보
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
                    quantity={item.quantity}
                    expiresAt={item.expiresAt}
                    price={item.price}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-black">
                현재 등록된 할인 상품이 없습니다.
              </p>
            </div>
          )}
        </TabsContent>

        {/* 위치 정보 탭 */}
        <TabsContent value="info" className="p-4">
          <div>
            <h3 className="font-medium text-black text-sm mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> 위치 정보
            </h3>
            <div className="bg-[#1e293b] p-0 rounded-lg overflow-hidden">
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
    </div>
  );
} 