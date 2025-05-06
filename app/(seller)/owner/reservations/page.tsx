"use client";

import React, { useState, useEffect } from "react";
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
  Check,
  X,
  Filter,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
// API 클라이언트 제거됨: 필요한 API 타입 및 경로만 임포트
import { formatInternalApiUrl, RESERVATION_ROUTES, ReservationStatusUpdateRequest } from "@/app/api/routes";
import { formatDate, formatPrice, formatPickupTime, separateDateAndTime } from "@/lib/utils"; // 유틸리티 함수 임포트

// 예약 상태 타입 (API 정의에 맞춤)
type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// API에서 반환되는 예약 정보 타입
interface StoreOwnerReservation {
  id: number;
  userName: string;
  amount: number;
  pickUpTime: string;
  status: ReservationStatus;
  createdAt: string;
  // API 응답에 맞게 추가 필드가 있다면 여기에 추가
}

// 컴포넌트에서 사용하는 예약 정보 타입
interface Reservation {
  id: number;
  inventoryImage: string;
  inventoryName: string;
  inventoryPrice: number;
  customerName: string;
  customerPhone: string;
  amount: number;
  pickUpTime: string;
  status: ReservationStatus;
  createdAt: string;
  // 추가 필드가 있으면 API 응답에 맞게 추가
}

// 상태에 따른 배지 색상과 텍스트
const statusBadgeConfig = {
  'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: '승인 대기' },
  'CONFIRMED': { color: 'bg-blue-100 text-blue-800', text: '예약 확정' },
  'COMPLETED': { color: 'bg-green-100 text-green-800', text: '픽업 완료' },
  'CANCELLED': { color: 'bg-red-100 text-red-800', text: '예약 취소' },
};

export default function OwnerReservationsPage() {
  // 상태 관리
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [reservationToAction, setReservationToAction] = useState<{id: number, action: 'confirm' | 'complete' | 'cancel'} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<string>(""); // 선택된 예약 ID

  // 예약 목록 가져오기
  useEffect(() => {
    fetchReservations();
  }, []);

  // API 응답을 UI에 맞는 형식으로 변환하는 함수
  const transformApiResponseToReservation = (data: StoreOwnerReservation[]): Reservation[] => {
    return data.map(item => ({
      id: item.id,
      inventoryImage: "/placeholder-food.jpg", // 기본 이미지 사용 또는 API에서 제공하는 경우 해당 값 사용
      inventoryName: "상품명", // API에서 제공하지 않는 경우 기본값 사용
      inventoryPrice: 0, // API에서 제공하지 않는 경우 기본값 사용
      customerName: item.userName,
      customerPhone: "010-0000-0000", // API에서 제공하지 않는 경우 기본값 사용
      amount: item.amount,
      pickUpTime: item.pickUpTime,
      status: item.status,
      createdAt: item.createdAt
    }));
  };

  // API를 사용하여 예약 목록 가져오기
  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // API 클라이언트를 사용하여 점주 예약 목록 요청
      const reservationData = await fetchStoreOwnerReservations();
      // API 응답 데이터를 UI에 맞는 형식으로 변환
      const transformedData = transformApiResponseToReservation(reservationData);
      setReservations(transformedData);
    } catch (err) {
      console.error('예약 목록 가져오기 오류:', err);
      setError('예약 정보를 불러오는 중 오류가 발생했습니다');
      // API 오류 시 빈 배열 사용
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 예약 필터링
  const filteredReservations = reservations.filter(reservation => {
    // 검색어 필터링
    const matchesSearch = 
      reservation.inventoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 탭 필터링
    const matchesTab = 
      selectedTab === "all" || 
      (selectedTab === "pending" && reservation.status === "PENDING") ||
      (selectedTab === "confirmed" && reservation.status === "CONFIRMED") ||
      (selectedTab === "completed" && reservation.status === "COMPLETED") ||
      (selectedTab === "cancelled" && reservation.status === "CANCELLED");
    
    return matchesSearch && matchesTab;
  });

  // 예약 상태 변경 처리
  const handleUpdateReservationStatus = async () => {
    if (!reservationToAction) return;
    
    const { id, action } = reservationToAction;
    let newStatus: ReservationStatus;
    
    switch (action) {
      case 'confirm':
        newStatus = 'CONFIRMED';
        break;
      case 'complete':
        newStatus = 'COMPLETED';
        break;
      case 'cancel':
        newStatus = 'CANCELLED';
        break;
      default:
        setActionDialogOpen(false);
        setReservationToAction(null);
        return;
    }
    
    try {
      // API 클라이언트를 사용하여 예약 상태 업데이트
      await updateReservationStatus(id, { status: newStatus });
      
      // 상태 업데이트
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
    } catch (err) {
      console.error('예약 상태 변경 오류:', err);
      setError('예약 상태 변경 중 오류가 발생했습니다');
    } finally {
      setActionDialogOpen(false);
      setReservationToAction(null);
    }
  };

  // 예약 상태 변경 다이얼로그 열기
  const openActionDialog = (id: number, action: 'confirm' | 'complete' | 'cancel') => {
    setReservationToAction({ id, action });
    setActionDialogOpen(true);
  };

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p>예약 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 다이얼로그 메시지 및 제목 설정
  const getDialogContent = () => {
    if (!reservationToAction) return { title: '', description: '' };
    
    const { action } = reservationToAction;
    
    switch (action) {
      case 'confirm':
        return {
          title: '예약 확정',
          description: '이 예약을 확정하시겠습니까? 고객에게 확정 알림이 발송됩니다.'
        };
      case 'complete':
        return {
          title: '픽업 완료',
          description: '고객의 픽업이 완료되었습니까? 예약이 완료 처리됩니다.'
        };
      case 'cancel':
        return {
          title: '예약 취소',
          description: '정말로 이 예약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
        };
      default:
        return { title: '', description: '' };
    }
  };
  
  const dialogContent = getDialogContent();

  return (
    <div>
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
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
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
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-4">
                예약 내역이 없습니다.
              </p>
            </div>
          ) : (
            filteredReservations.map(reservation => {
              const { date, time } = separateDateAndTime(reservation.pickUpTime);
              return (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={statusBadgeConfig[reservation.status].color}>
                          {statusBadgeConfig[reservation.status].text}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {formatDate(reservation.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                          <Image 
                            src={reservation.inventoryImage} 
                            alt={reservation.inventoryName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{reservation.inventoryName}</h3>
                          <p className="text-sm text-gray-500 mb-1">
                            {formatPrice(reservation.inventoryPrice * reservation.amount)}원 ({reservation.amount}개)
                          </p>
                          <p className="text-sm font-semibold">
                            고객: {reservation.customerName} ({reservation.customerPhone})
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 text-sm grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 예약 관리 버튼 */}
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <div className="flex gap-2">
                        {reservation.status === 'PENDING' && (
                          <>
                            <Button 
                              className="flex-1 bg-[#5DCA69] hover:bg-[#4db058]"
                              onClick={() => openActionDialog(reservation.id, 'confirm')}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              승인
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => openActionDialog(reservation.id, 'cancel')}
                            >
                              <X className="h-4 w-4 mr-2" />
                              거절
                            </Button>
                          </>
                        )}
                        
                        {reservation.status === 'CONFIRMED' && (
                          <>
                            <Button 
                              className="flex-1 bg-[#5DCA69] hover:bg-[#4db058]"
                              onClick={() => openActionDialog(reservation.id, 'complete')}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              픽업 완료
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => openActionDialog(reservation.id, 'cancel')}
                            >
                              <X className="h-4 w-4 mr-2" />
                              취소
                            </Button>
                          </>
                        )}
                        
                        {(reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            disabled
                          >
                            처리 완료됨
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      
      {/* 예약 상태 변경 확인 다이얼로그 */}
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
              variant={reservationToAction?.action === 'cancel' ? 'destructive' : 'default'}
              onClick={handleUpdateReservationStatus}
              className={reservationToAction?.action !== 'cancel' ? 'bg-[#5DCA69] hover:bg-[#4db058]' : ''}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// apiClient.reservation.getStoreOwnerReservations() 대체
const fetchStoreOwnerReservations = async () => {
  try {
    const response = await fetch(formatInternalApiUrl(RESERVATION_ROUTES.STORE_OWNER), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`예약 목록 가져오기 실패: ${response.status}`);
    }
    
    return await response.json() as StoreOwnerReservation[];
  } catch (error) {
    console.error('예약 목록 가져오기 오류:', error);
    return [];
  }
};

// apiClient.reservation.updateStatus() 대체
const updateReservationStatus = async (reservationId: number, data: ReservationStatusUpdateRequest) => {
  try {
    const response = await fetch(formatInternalApiUrl(RESERVATION_ROUTES.UPDATE_STATUS(reservationId)), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`예약 상태 업데이트 실패: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('예약 상태 업데이트 오류:', error);
    return false;
  }
}; 