import React, { useState } from "react";
import { ShopCard } from "./shop-card";
import { InventoryCard } from "./inventory-card";
import { ReservationCard } from "./reservation-card";
import { NotificationItem } from "./notification-item";
import { EcoImpactCard, type EcoMetric } from "./eco-impact-card";
import { MobileModal, ModalActions } from "./mobile-modal";
import { Button } from "@/components/ui/button";

// 가게 카드 예제
export const ShopCardExample = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ShopCard
        id="1"
        name="맛있는 비건 레스토랑"
        image="/images/restaurants/1.jpg"
        location="서울시 강남구"
        rating={4.8}
        category="비건"
        isNew={true}
      />
      <ShopCard
        id="2"
        name="유기농 마켓"
        image="/images/restaurants/2.jpg"
        location="서울시 마포구"
        rating={4.2}
        distance="1.5km"
      />
    </div>
  );
};

// 재고 카드 예제
export const InventoryCardExample = () => {
  return (
    <div className="space-y-4">
      <InventoryCard
        id="1"
        name="유기농 사과 세트"
        image="/images/products/1.jpg"
        shopName="유기농 마켓"
        shopId="2"
        originalPrice={12000}
        discountPrice={8400}
        discountRate={30}
        quantity={5}
        expiresAt="오늘 마감"
      />
      <InventoryCard
        id="2"
        name="통밀 빵"
        image="/images/products/2.jpg"
        shopName="친환경 베이커리"
        shopId="3"
        originalPrice={5000}
        discountPrice={3000}
        discountRate={40}
        quantity={2}
        expiresAt="3시간 남음"
      />
    </div>
  );
};

// 예약 카드 예제
export const ReservationCardExample = () => {
  const handleCancelReservation = (id: string) => {
    console.log(`Cancel reservation ${id}`);
  };
  
  return (
    <div className="space-y-4">
      <ReservationCard
        id="1"
        shopName="맛있는 비건 레스토랑"
        shopId="1"
        location="서울시 강남구"
        date="2023-05-01"
        time="18:00"
        status="pending"
        items={[
          { id: "1", name: "유기농 샐러드", quantity: 1, price: 12000 },
          { id: "2", name: "비건 버거", quantity: 2, price: 9000 }
        ]}
        totalAmount={30000}
        onCancel={handleCancelReservation}
      />
      <ReservationCard
        id="2"
        shopName="유기농 마켓"
        shopId="2"
        location="서울시 마포구"
        date="2023-05-05"
        time="14:00"
        status="confirmed"
        totalAmount={8400}
      />
    </div>
  );
};

// 알림 아이템 예제
export const NotificationItemExample = () => {
  const [readStatus, setReadStatus] = useState({
    "1": false,
    "2": true,
    "3": false
  });
  
  const handleMarkAsRead = (id: string) => {
    setReadStatus(prev => ({ ...prev, [id]: true }));
  };
  
  return (
    <div className="border border-[#e1e7ef] dark:border-[#303642] rounded-lg overflow-hidden">
      <NotificationItem
        id="1"
        type="reservation_confirmed"
        title="예약이 확정되었습니다"
        message="'맛있는 비건 레스토랑'의 예약이 확정되었습니다. 5월 1일 18:00에 방문해주세요."
        time="10분 전"
        isRead={readStatus["1"]}
        actionUrl="/reservations/1"
        onRead={handleMarkAsRead}
      />
      <NotificationItem
        id="2"
        type="new_discount"
        title="새로운 할인 상품"
        message="'유기농 마켓'에서 새로운 할인 상품이 등록되었습니다."
        time="2시간 전"
        isRead={readStatus["2"]}
        actionUrl="/shops/2"
      />
      <NotificationItem
        id="3"
        type="system"
        title="RE-GREEN 소식"
        message="5월 환경의 날 기념 이벤트를 진행합니다. 참여하고 리워드를 받아가세요!"
        time="1일 전"
        isRead={readStatus["3"]}
        onRead={handleMarkAsRead}
      />
    </div>
  );
};

// 환경 영향 카드 예제
export const EcoImpactCardExample = () => {
  const metrics: EcoMetric[] = [
    {
      type: "food_waste",
      value: 127,
      unit: "kg",
      change: {
        value: 5,
        isPositive: true
      },
      description: "전월 대비 증가"
    },
    {
      type: "water_saved",
      value: 1420,
      unit: "L",
      change: {
        value: 12,
        isPositive: true
      }
    },
    {
      type: "co2_reduced",
      value: 84,
      unit: "kg",
      description: "약 4그루의 나무 효과"
    },
    {
      type: "trees_saved",
      value: 4,
      unit: "그루",
      change: {
        value: 1,
        isPositive: false
      }
    }
  ];
  
  return (
    <EcoImpactCard
      title="나의 환경 기여도"
      description="음식물 쓰레기 절감을 통한 환경 보호 효과"
      timeFrame="2023년 4월"
      metrics={metrics}
    />
  );
};

// 모달 예제
export const MobileModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  return (
    <div className="space-y-4">
      <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>
      <Button variant="outline" onClick={() => setIsBottomSheetOpen(true)}>바텀 시트 열기</Button>
      
      {/* 일반 모달 */}
      <MobileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="예약 확인"
        footer={
          <ModalActions
            onConfirm={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            confirmText="확인"
          />
        }
      >
        <p className="text-[#0f172a] dark:text-white">
          정말로 이 예약을 확정하시겠습니까?
        </p>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-2">
          확정 후에는 취소가 어려울 수 있습니다.
        </p>
      </MobileModal>
      
      {/* 바텀 시트 */}
      <MobileModal
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        position="bottom"
        title="필터 옵션"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#0f172a] dark:text-white">
              정렬 방식
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input type="radio" id="sort-distance" name="sort" className="mr-2" />
                <label htmlFor="sort-distance" className="text-sm text-[#0f172a] dark:text-white">
                  거리순
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="sort-rating" name="sort" className="mr-2" />
                <label htmlFor="sort-rating" className="text-sm text-[#0f172a] dark:text-white">
                  평점순
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#e1e7ef] dark:border-[#303642]">
            <Button className="w-full" onClick={() => setIsBottomSheetOpen(false)}>
              필터 적용하기
            </Button>
          </div>
        </div>
      </MobileModal>
    </div>
  );
}; 