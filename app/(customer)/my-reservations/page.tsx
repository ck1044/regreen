"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatInternalApiUrl, RESERVATION_ROUTES } from "@/app/api/routes";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import dayjs from "dayjs";
import 'dayjs/locale/ko';

// 한국어 설정
dayjs.locale('ko');

// 날짜 및 시간 포맷 함수
const formatDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY년 MM월 DD일');
};

const formatTime = (dateString: string) => {
  return dayjs(dateString).format('HH:mm');
};

// 날짜와 시간 분리
const separateDateAndTime = (dateString: string) => {
  const date = dayjs(dateString).format('YYYY년 MM월 DD일');
  const time = dayjs(dateString).format('HH:mm');
  return { date, time };
};

// 가격 포맷 함수
const formatPrice = (price: number) => {
  return price.toLocaleString();
};

// 예약 상태 타입
type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// 예약 정보 타입
interface Reservation {
  id: number;
  inventoryImage: string;
  inventoryName: string;
  inventoryPrice: number;
  storeName: string;
  storeAddress: string;
  storeCategory: string;
  amount: number;
  pickUpTime: string;
  status: ReservationStatus;
  createdAt: string;
}

// 상태에 따른 배지 색상과 텍스트
const statusBadgeConfig = {
  'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: '승인 대기' },
  'CONFIRMED': { color: 'bg-blue-100 text-blue-800', text: '예약 확정' },
  'COMPLETED': { color: 'bg-green-100 text-green-800', text: '픽업 완료' },
  'CANCELLED': { color: 'bg-red-100 text-red-800', text: '예약 거절' },
};

export default function MyReservationsPage() {
  // 세션 가져오기
  const { data: session } = useSession();
  // @ts-ignore - accessToken 속성이 타입 정의에 없어서 무시
  const accessToken = session?.user?.accessToken;
  
  // 상태 관리
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API를 사용하여 예약 목록 가져오기
  const fetchReservations = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // 요청 헤더 구성
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // 토큰이 있으면 헤더에 추가
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      } else {
        throw new Error('인증 토큰이 없습니다.');
      }
      
      // API 엔드포인트 구성
      const apiEndpoint = formatInternalApiUrl(RESERVATION_ROUTES.CUSTOMER);
      
      // API 호출
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers,
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`예약 목록 가져오기 실패: ${response.status}`);
      }
      
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      console.error('예약 목록 가져오기 오류:', err);
      setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
      setReservations([]); // 에러 시 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  }, [session, accessToken]);
  
  // 예약 목록 가져오기
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 예약 필터링
  // const filteredReservations = reservations.filter(reservation => {
  //   // 검색어 필터링
  //   const matchesSearch = 
  //     reservation.inventoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     reservation.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    
  //   // 탭 필터링
  //   const matchesTab = 
  //     selectedTab === "all" || 
  //     (selectedTab === "pending" && reservation.status === "PENDING") ||
  //     (selectedTab === "confirmed" && reservation.status === "CONFIRMED") ||
  //     (selectedTab === "completed" && reservation.status === "COMPLETED") ||
  //     (selectedTab === "cancelled" && reservation.status === "CANCELLED");
    
  //   return matchesSearch && matchesTab;
  // });

  // 예약 취소 처리
  const handleCancelReservation = async () => {
    if (!reservationToCancel || !accessToken) return;
    
    try {
      // API 엔드포인트 구성
      const apiEndpoint = formatInternalApiUrl(RESERVATION_ROUTES.UPDATE_STATUS(reservationToCancel));
      
      // API 호출
      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      
      if (!response.ok) {
        throw new Error('예약 취소 실패');
      }
      
      // 상태 업데이트
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationToCancel
            ? { ...reservation, status: 'CANCELLED' }
            : reservation
        )
      );
      
      toast.success('예약이 취소되었습니다.');
    } catch (err) {
      console.error('예약 취소 오류:', err);
      toast.error('예약 취소 중 오류가 발생했습니다.');
    } finally {
      setCancelDialogOpen(false);
      setReservationToCancel(null);
    }
  };

  // 예약 취소 다이얼로그 열기
  const openCancelDialog = (id: number) => {
    setReservationToCancel(id);
    setCancelDialogOpen(true);
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

  return (
    <div>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">내 예약</h1>
        </div>
        
        {/* 검색 */}
        {/* <div className="mb-6 space-y-4">
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
        </div> */}
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 탭 필터 */}
        {/* <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="confirmed">확정</TabsTrigger>
            <TabsTrigger value="completed">완료</TabsTrigger>
            <TabsTrigger value="cancelled">취소</TabsTrigger>
          </TabsList>
        </Tabs> */}
        
        {/* 예약 목록 */}
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-4">
                예약 내역이 없습니다.
              </p>
              <Link href="/main">
                <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                  상품 보러가기
                </Button>
              </Link>
            </div>
          ) : (
            reservations.map(reservation => {
              const { date, time } = separateDateAndTime(reservation.pickUpTime);
              return (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Link href={`/my-reservations/${reservation.id}`}>
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
                              src={reservation.inventoryImage || '/placeholder-food.jpg'} 
                              alt={reservation.inventoryName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{reservation.inventoryName}</h3>
                            <p className="text-sm text-gray-500 mb-1">
                              <Store className="h-3 w-3 inline mr-1" />
                              {reservation.storeName}
                            </p>
                            <p className="text-sm font-semibold">
                              {formatPrice(reservation.inventoryPrice * reservation.amount)}원 ({reservation.amount}개)
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
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
                          <div className="flex items-center col-span-2">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="truncate">{reservation.storeAddress}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* 예약 상태 표시 */}
                    <div className="px-4 py-3 bg-gray-50 border-t ">
                      <div className="text-center font-medium">
                        {statusBadgeConfig[reservation.status].text}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 