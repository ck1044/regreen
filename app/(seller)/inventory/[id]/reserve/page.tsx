import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Info, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
import ReservationForm from './ReservationForm';

// dayjs 한국어 설정
dayjs.locale('ko');

// 임시 데이터 - 실제 구현 시에는 API에서 정보를 가져와야 함
const inventoryItems = {
  "101": {
    id: "101",
    name: "비건 샐러드",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shopName: "맛있는 비건 레스토랑",
    shopId: "1",
    originalPrice: 12000,
    discountPrice: 8400,
    discountRate: 30,
    quantity: 5,
    description: "신선한 유기농 채소로 만든 건강한 비건 샐러드입니다. 특제 드레싱이 포함되어 있습니다.",
    expiresAt: "2023-05-10T20:00:00",
    pickupTime: {
      start: "17:00",
      end: "20:00"
    }
  },
  "102": {
    id: "102",
    name: "비건 버거",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shopName: "맛있는 비건 레스토랑",
    shopId: "1",
    originalPrice: 10000,
    discountPrice: 6000,
    discountRate: 40,
    quantity: 3,
    description: "콩 단백질 패티와 신선한 채소가 들어간 비건 버거입니다. 건강하게 즐기는 햄버거!",
    expiresAt: "2023-05-10T21:00:00",
    pickupTime: {
      start: "17:00",
      end: "21:00"
    }
  },
  "201": {
    id: "201",
    name: "유기농 사과 세트",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shopName: "유기농 마켓",
    shopId: "2",
    originalPrice: 12000,
    discountPrice: 8400,
    discountRate: 30,
    quantity: 5,
    description: "무농약으로 재배된 신선한 사과 세트입니다. 4개입.",
    expiresAt: "2023-05-11T19:00:00",
    pickupTime: {
      start: "10:00",
      end: "19:00"
    }
  }
};

type PageParams = Promise<{ id: string }>;

export default async function ReservePage({ params }: { params: PageParams }) {
  const { id } = await params;
  const item = inventoryItems[id as keyof typeof inventoryItems];

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[50vh]">
        <h1 className="text-xl font-bold mb-2">상품을 찾을 수 없습니다</h1>
        <p className="text-[#64748b] mb-4">요청하신 상품 정보가 존재하지 않습니다.</p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  // 픽업 가능 시간 계산
  const today = new Date();
  const expiryDate = new Date(item.expiresAt);
  const formattedDate = dayjs(expiryDate).format('MM월 DD일 (ddd)');

  return (
    <div className="pb-16">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white bg-[#0f172aw] border-b border-[#e1e7ef] border-[#303642]">
        <div className="flex items-center h-14 px-4">
          <Link href={`/shops/${item.shopId}`} className="mr-4">
            <ChevronLeft className="h-6 w-6 text-[#0f172a] text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-[#0f172a] text-white">예약하기</h1>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <div className="flex mb-4">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3 flex flex-col justify-between">
            <div>
              <h2 className="font-medium text-[#0f172a] text-white">{item.name}</h2>
              <Link href={`/shops/${item.shopId}`} className="text-sm text-[#64748b] text-[#94a3b8] flex items-center mt-1">
                <Store size={14} className="mr-1" />
                {item.shopName}
              </Link>
            </div>
            <div className="flex items-center">
              <span className="line-through text-[#64748b] text-[#94a3b8] text-xs mr-1">
                {item.originalPrice.toLocaleString()}원
              </span>
              <span className="font-medium text-[#0f172a] text-white">
                {item.discountPrice.toLocaleString()}원
              </span>
              <span className="ml-2 text-xs font-bold text-[#5DCA69] bg-[#5DCA69]/10 px-1.5 py-0.5 rounded">
                {item.discountRate}% 할인
              </span>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#0f172a] text-white mb-4">
          {item.description}
        </div>

        <div className="bg-[#f8fafc] bg-[#1e293b] p-3 rounded-lg mb-4">
          <div className="flex items-start mb-2">
            <Calendar size={16} className="text-[#64748b] text-[#94a3b8] mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#0f172a] text-white">픽업 날짜</p>
              <p className="text-sm text-[#64748b] text-[#94a3b8]">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock size={16} className="text-[#64748b] text-[#94a3b8] mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#0f172a] text-white">픽업 가능 시간</p>
              <p className="text-sm text-[#64748b] text-[#94a3b8]">{item.pickupTime.start} - {item.pickupTime.end}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 예약 폼 (클라이언트 컴포넌트로 분리) */}
      <ReservationForm item={item} />
    </div>
  );
} 