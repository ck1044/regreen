"use client";

import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CheckCircle2,
  X,
  User,
  Phone,
  Filter,
  ShoppingBag,
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
  quantity: number;
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
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
    quantity: 2,
    pickupDate: "2023-12-30",
    pickupTime: "14:30",
    totalPrice: 7000,
    customerName: "홍길동",
    customerPhone: "010-1234-5678",
    status: "pending",
    createdAt: "2023-12-15T09:00:00Z",
  },
  {
    id: "2",
    productId: "2",
    productName: "신선한 사과",
    productImage: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
    quantity: 3,
    pickupDate: "2023-12-31",
    pickupTime: "16:00",
    totalPrice: 18000,
    customerName: "김철수",
    customerPhone: "010-5678-1234",
    status: "confirmed",
    createdAt: "2023-12-14T10:30:00Z",
  },
  {
    id: "3",
    productId: "3",
    productName: "제철 토마토",
    productImage: "https://images.unsplash.com/photo-1524593166156-312f362cada0",
    quantity: 1,
    pickupDate: "2023-12-28",
    pickupTime: "11:00",
    totalPrice: 6000,
    customerName: "이영희",
    customerPhone: "010-9876-5432",
    status: "completed",
    createdAt: "2023-12-13T14:20:00Z",
  },
  {
    id: "4",
    productId: "4",
    productName: "유기농 바나나",
    productImage: "https://images.unsplash.com/photo-1543218024-57a70143c369",
    quantity: 2,
    pickupDate: "2023-12-25",
    pickupTime: "15:30",
    totalPrice: 9000,
    customerName: "박민수",
    customerPhone: "010-2468-1357",
    status: "cancelled",
    createdAt: "2023-12-12T16:45:00Z",
  },
  {
    id: "5",
    productId: "1",
    productName: "유기농 당근",
    productImage: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
    quantity: 4,
    pickupDate: "2023-12-29",
    pickupTime: "13:00",
    totalPrice: 14000,
    customerName: "최지수",
    customerPhone: "010-1357-2468",
    status: "pending",
    createdAt: "2023-12-11T11:15:00Z",
  },
];

export default function OwnerReservationsPage() {
  // 상태 관리
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"confirm" | "complete" | "cancel">("confirm");
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  // 예약 필터링
  const filteredReservations = reservations.filter(reservation => {
    // 검색어 필터링
    const matchesSearch = 
      reservation.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerPhone.includes(searchQuery);
    
    // 탭 필터링
    const matchesTab = 
      selectedTab === "all" || 
      (selectedTab === "pending" && reservation.status === "pending") ||
      (selectedTab === "confirmed" && reservation.status === "confirmed") ||
      (selectedTab === "completed" && reservation.status === "completed") ||
      (selectedTab === "cancelled" && reservation.status === "cancelled");
    
    return matchesSearch && matchesTab;
  });

  // 예약 상태 변경 처리
  const handleReservationAction = async () => {
    if (!selectedReservation) return;

    // 실제 구현에서는 API 호출
    // const response = await fetch(`/api/reservations/${selectedReservation}/${actionType}`, {
    //   method: 'POST'
    // });
    
    // 상태 업데이트
    let newStatus: ReservationStatus = "pending";
    
    switch(actionType) {
      case "confirm":
        newStatus = "confirmed";
        break;
      case "complete":
        newStatus = "completed";
        break;
      case "cancel":
        newStatus = "cancelled";
        break;
    }
    
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === selectedReservation
          ? { ...reservation, status: newStatus }
          : reservation
      )
    );
    
    setActionDialogOpen(false);
    setSelectedReservation(null);
  };

  // 예약 승인 처리
  const openConfirmDialog = (id: string) => {
    setSelectedReservation(id);
    setActionType("confirm");
    setActionDialogOpen(true);
  };

  // 예약 픽업 완료 처리
  const openCompleteDialog = (id: string) => {
    setSelectedReservation(id);
    setActionType("complete");
    setActionDialogOpen(true);
  };

  // 예약 취소 처리
  const openCancelDialog = (id: string) => {
    setSelectedReservation(id);
    setActionType("cancel");
    setActionDialogOpen(true);
  };

  // 다이얼로그 타이틀과 메시지
  const getDialogContent = () => {
    switch(actionType) {
      case "confirm":
        return {
          title: "예약 승인",
          description: "이 예약을 승인하시겠습니까?",
          actionText: "승인하기"
        };
      case "complete":
        return {
          title: "픽업 완료",
          description: "고객이 상품을 픽업했습니까? 픽업 완료 처리하시겠습니까?",
          actionText: "완료 처리"
        };
      case "cancel":
        return {
          title: "예약 취소",
          description: "이 예약을 취소하시겠습니까? 이 작업은 취소할 수 없습니다.",
          actionText: "취소하기"
        };
      default:
        return {
          title: "",
          description: "",
          actionText: ""
        };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <MobileLayout>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">예약 관리</h1>
        </div>
        
        {/* 검색 */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                placeholder="고객명 또는 상품명 검색" 
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
              <p className="text-gray-500 text-gray-400">
                예약 내역이 없습니다.
              </p>
            </div>
          ) : (
            filteredReservations.map(reservation => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Badge className={`${statusBadgeConfig[reservation.status].color} mr-2`}>
                        {statusBadgeConfig[reservation.status].text}
                      </Badge>
                      <span className="text-sm text-gray-600 text-gray-400">
                        예약번호: {reservation.id}
                      </span>
                    </div>
                    <Link 
                      href={`/reservations/${reservation.id}`} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      상세보기
                    </Link>
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
                    <div>
                      <h3 className="font-medium">{reservation.productName}</h3>
                      <div className="flex items-center mt-1">
                        <ShoppingBag className="h-3 w-3 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600 text-gray-400">
                          {reservation.quantity}개 / {formatPrice(reservation.totalPrice)}원
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">픽업 날짜</p>
                        <p className="text-sm">{formatDate(reservation.pickupDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">픽업 시간</p>
                        <p className="text-sm">{reservation.pickupTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-start">
                      <User className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">고객</p>
                        <p className="text-sm">{reservation.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">연락처</p>
                        <p className="text-sm">{reservation.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {reservation.status === 'pending' && (
                      <>
                        <Button 
                          className="flex-1 bg-[#5DCA69] hover:bg-[#4db058]"
                          onClick={() => openConfirmDialog(reservation.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          승인
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-red-600 border-red-200"
                          onClick={() => openCancelDialog(reservation.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          거절
                        </Button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <Button 
                        className="w-full bg-[#5DCA69] hover:bg-[#4db058]"
                        onClick={() => openCompleteDialog(reservation.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        픽업 완료 처리
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* 액션 확인 다이얼로그 */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={handleReservationAction}
              variant={actionType === "cancel" ? "destructive" : "default"}
              className={actionType !== "cancel" ? "bg-[#5DCA69] hover:bg-[#4db058]" : ""}
            >
              {dialogContent.actionText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
} 