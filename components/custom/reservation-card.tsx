import React from "react";
import Link from "next/link";
import { CalendarClock, Store, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

type ReservationCardProps = {
  id: string;
  shopName: string;
  shopId: string;
  location: string;
  date: string;
  time: string;
  status: ReservationStatus;
  items?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  className?: string;
  onCancel?: (id: string) => void;
};

const ReservationCard = ({
  id,
  shopName,
  shopId,
  location,
  date,
  time,
  status,
  items = [],
  totalAmount,
  className,
  onCancel,
}: ReservationCardProps) => {
  // 예약 상태에 따른 배지 스타일
  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">대기중</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">확정</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">완료</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">취소됨</Badge>;
      default:
        return null;
    }
  };

  // 총액 포맷 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <div className={cn(
      "bg-white bg-[#1e293b] rounded-lg shadow overflow-hidden",
      className
    )}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/shops/${shopId}`} className="hover:underline">
            <h3 className="font-medium text-[#0f172a] text-white">{shopName}</h3>
          </Link>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-[#64748b] text-[#94a3b8]">
            <MapPin size={14} className="mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-[#64748b] text-[#94a3b8]">
            <CalendarClock size={14} className="mr-2" />
            <span>{date} {time}</span>
          </div>
        </div>
        
        {items.length > 0 && (
          <div className="border-t border-[#e1e7ef] border-[#303642] pt-3 mb-3">
            <h4 className="text-sm font-medium text-[#0f172a] text-white mb-2">주문 항목</h4>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.id} className="text-sm flex justify-between">
                  <span className="text-[#0f172a] text-white">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-[#64748b] text-[#94a3b8]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-medium mt-2 pt-2 border-t border-dashed border-[#e1e7ef] border-[#303642]">
              <span className="text-[#0f172a] text-white">총액</span>
              <span className="text-[#5DCA69]">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link href={`/reservations/${id}`} className="text-sm text-[#5b87f0] hover:underline flex items-center">
            상세보기
            <ArrowRight size={14} className="ml-1" />
          </Link>
          
          {status === "pending" && onCancel && (
            <Button 
              variant="outline"
              className="text-sm h-8 border-red-300 text-red-500 hover:bg-red-50"
              onClick={() => onCancel(id)}
            >
              예약 취소
            </Button>
          )}
          
          {status === "confirmed" && (
            <Link href={`/reservations/${id}/receipt`}>
              <Button variant="outline" className="text-sm h-8">
                영수증 보기
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export { ReservationCard }; 