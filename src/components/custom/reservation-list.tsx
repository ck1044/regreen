import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ReservationItem {
  id: string;
  inventoryId: string;
  itemName: string;
  shopName: string;
  quantity: number;
  totalAmount: number;
  pickupDate: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

interface ReservationListProps {
  reservations: ReservationItem[];
  onViewDetail: (id: string) => void;
  onCancel: (id: string) => void;
}

// 예약 상태에 따른 배지 스타일과 텍스트
const getStatusBadge = (status: ReservationItem['status']) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">대기중</Badge>;
    case "CONFIRMED":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">확정</Badge>;
    case "COMPLETED":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">완료</Badge>;
    case "CANCELLED":
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">취소됨</Badge>;
  }
};

// 가격 포맷 함수
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

// 날짜 포맷 함수
const formatDate = (dateString: string) => {
  return dayjs(dateString).locale('ko').format('MM월 DD일 (ddd) HH:mm');
};

export const ReservationList = ({ reservations, onViewDetail, onCancel }: ReservationListProps) => {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-2">예약 내역이 없습니다.</p>
        <Button variant="outline" asChild>
          <a href="/">새로운 상품 둘러보기</a>
        </Button>
      </div>
    );
  }

  // 예약 상태별로 필터링
  const pendingReservations = reservations.filter(r => r.status === "PENDING" || r.status === "CONFIRMED");
  const completedReservations = reservations.filter(r => r.status === "COMPLETED");
  const cancelledReservations = reservations.filter(r => r.status === "CANCELLED");

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="active" className="text-sm">
          진행중 ({pendingReservations.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="text-sm">
          완료 ({completedReservations.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="text-sm">
          취소 ({cancelledReservations.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-3">
        {pendingReservations.map((reservation) => (
          <ReservationCard 
            key={reservation.id} 
            reservation={reservation} 
            onViewDetail={onViewDetail} 
            onCancel={onCancel}
            showCancelButton={true} 
          />
        ))}
      </TabsContent>

      <TabsContent value="completed" className="space-y-3">
        {completedReservations.map((reservation) => (
          <ReservationCard 
            key={reservation.id} 
            reservation={reservation} 
            onViewDetail={onViewDetail} 
            onCancel={onCancel}
            showCancelButton={false} 
          />
        ))}
      </TabsContent>

      <TabsContent value="cancelled" className="space-y-3">
        {cancelledReservations.map((reservation) => (
          <ReservationCard 
            key={reservation.id} 
            reservation={reservation} 
            onViewDetail={onViewDetail} 
            onCancel={onCancel}
            showCancelButton={false} 
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};

interface ReservationCardProps {
  reservation: ReservationItem;
  onViewDetail: (id: string) => void;
  onCancel: (id: string) => void;
  showCancelButton: boolean;
}

const ReservationCard = ({ reservation, onViewDetail, onCancel, showCancelButton }: ReservationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{reservation.shopName}</h3>
          {getStatusBadge(reservation.status)}
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">{reservation.itemName} x {reservation.quantity}</p>
          <p className="text-sm font-medium">{formatPrice(reservation.totalAmount)}</p>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          <p>픽업 예정: {formatDate(reservation.pickupDate)}</p>
          <p>예약일: {formatDate(reservation.createdAt)}</p>
        </div>

        <div className="flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetail(reservation.id)}
          >
            상세보기
          </Button>
          
          {showCancelButton && reservation.status !== "CANCELLED" && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onCancel(reservation.id)}
            >
              예약 취소
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationList;