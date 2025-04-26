"use client";

import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Store,
  Ban,
  Filter,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 예약 상태 타입
type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// 예약 정보 타입
interface Reservation {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  storeName: string;
  storeAddress: string;
  quantity: number;
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
}

// 상태에 따른 배지 색상과 텍스트
const statusBadgeConfig = {
  'pending': { color: 'bg-yellow-100 text-yellow-800', text: '승인 대기' },
  'confirmed': { color: 'bg-blue-100 text-blue-800', text: '예약 확정' },
  'completed': { color: 'bg-green-100 text-green-800', text: '픽업 완료' },
  'cancelled': { color: 'bg-red-100 text-red-800', text: '예약 취소' },
};

// 날짜 형식화
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// 가격 형식화
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

// 목업 데이터
const mockReservations: Reservation[] = [
  {
    id: "1",
    productId: "1",
    productName: "유기농 당근",
    productImage: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    storeName: "유기농 마켓",
    storeAddress: "서울특별시 강남구 테헤란로 123",
    quantity: 2,
    pickupDate: "2023-12-30",
    pickupTime: "14:30",
    totalPrice: 7000,
    status: "pending",
    createdAt: "2023-12-15T09:00:00Z",
  },
  {
    id: "2",
    productId: "2",
    productName: "신선한 사과",
    productImage: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
    storeName: "과일천국",
    storeAddress: "서울특별시 서초구 서초대로 456",
    quantity: 3,
    pickupDate: "2023-12-31",
    pickupTime: "16:00",
    totalPrice: 18000,
    status: "confirmed",
    createdAt: "2023-12-14T10:30:00Z",
  },
  {
    id: "3",
    productId: "3",
    productName: "제철 토마토",
    productImage: "https://images.unsplash.com/photo-1524593166156-312f362cada0",
    storeName: "농부의 시장",
    storeAddress: "서울특별시 송파구 올림픽로 789",
    quantity: 1,
    pickupDate: "2023-12-28",
    pickupTime: "11:00",
    totalPrice: 6000,
    status: "completed",
    createdAt: "2023-12-13T14:20:00Z",
  },
  {
    id: "4",
    productId: "4",
    productName: "유기농 바나나",
    productImage: "https://images.unsplash.com/photo-1543218024-57a70143c369",
    storeName: "열대과일 마트",
    storeAddress: "서울특별시 마포구 와우산로 159",
    quantity: 2,
    pickupDate: "2023-12-25",
    pickupTime: "15:30",
    totalPrice: 9000,
    status: "cancelled",
    createdAt: "2023-12-12T16:45:00Z",
  },
];

export default function MyReservationsPage() {
  // 상태 관리
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);

  // 예약 필터링
  const filteredReservations = reservations.filter(reservation => {
    // 검색어 필터링
    const matchesSearch = 
      reservation.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 탭 필터링
    const matchesTab = 
      selectedTab === "all" || 
      (selectedTab === "pending" && reservation.status === "pending") ||
      (selectedTab === "confirmed" && reservation.status === "confirmed") ||
      (selectedTab === "completed" && reservation.status === "completed") ||
      (selectedTab === "cancelled" && reservation.status === "cancelled");
    
    return matchesSearch && matchesTab;
  });

  // 예약 취소 처리
  const handleCancelReservation = async () => {
    if (!reservationToCancel) return;
    
    // 실제 구현에서는 API 호출
    // await fetch(`/api/reservations/${reservationToCancel}/cancel`, {
    //   method: 'POST'
    // });
    
    // 상태 업데이트
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reservationToCancel
          ? { ...reservation, status: 'cancelled' }
          : reservation
      )
    );
    
    setCancelDialogOpen(false);
    setReservationToCancel(null);
  };

  // 예약 취소 다이얼로그 열기
  const openCancelDialog = (id: string) => {
    setReservationToCancel(id);
    setCancelDialogOpen(true);
  };

  return (
    <MobileLayout>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">내 예약</h1>
        </div>
        
        {/* 검색 */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder="가게명 또는 상품명 검색" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* 탭 필터 */}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="confirmed">확정</TabsTrigger>
            <TabsTrigger value="completed">완료</TabsTrigger>
            <TabsTrigger value="cancelled">취소</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* 예약 목록 */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 bg-gray-800 rounded-lg text-center">
              <p className="text-gray-500 text-gray-400 mb-4">
                예약 내역이 없습니다.
              </p>
              <Link href="/">
                <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                  상품 보러가기
                </Button>
              </Link>
            </div>
          ) : (
            filteredReservations.map(reservation => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/reservations/${reservation.id}`}>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={statusBadgeConfig[reservation.status].color}>
                          {statusBadgeConfig[reservation.status].text}
                        </Badge>
                        <span className="text-sm text-gray-600 text-gray-400">
                          {formatDate(reservation.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                          <Image 
                            src={reservation.productImage} 
                            alt={reservation.productName} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{reservation.productName}</h3>
                          <p className="text-sm text-gray-600 text-gray-400 mt-1">
                            {reservation.quantity}개 / {formatPrice(reservation.totalPrice)}원
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Store className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{reservation.storeName}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm truncate">{reservation.storeAddress}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {formatDate(reservation.pickupDate)} · {reservation.pickupTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                    <div className="border-t p-3">
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 border-red-200"
                        onClick={() => openCancelDialog(reservation.id)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        예약 취소하기
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* 취소 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 취소</DialogTitle>
            <DialogDescription>
              이 예약을 정말 취소하시겠습니까? 이 작업은 취소할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              돌아가기
            </Button>
            <Button variant="destructive" onClick={handleCancelReservation}>
              취소하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
} 