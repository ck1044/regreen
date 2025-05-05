"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Store,
  ShoppingBag,
  Phone,
  User,
  DollarSign,
  Ban,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
const mockReservation: Reservation = {
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
  customerName: "홍길동",
  customerPhone: "010-1234-5678",
  status: "confirmed",
  createdAt: "2023-12-15T09:00:00Z",
};

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // 가게 주인 여부 (실제로는 로그인 정보 기반으로 설정)

  // 예약 정보 불러오기
  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch(`/api/reservations/${params.id}`);
        // const data = await response.json();
        
        // 임시 목업 데이터 사용
        setReservation(mockReservation);
        
        // 가게 주인 여부 체크 (실제로는 서버에서 권한 확인)
        setIsOwner(true); // 예시를 위해 임시로 true 설정
      } catch (error) {
        console.error("예약 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchReservation();
    }
  }, [params.id]);

  // 예약 취소 처리
  const handleCancelReservation = async () => {
    try {
      // 실제 구현에서는 API 호출
      // await fetch(`/api/reservations/${params.id}/cancel`, {
      //   method: 'POST'
      // });
      
      // 상태 업데이트
      if (reservation) {
        setReservation({
          ...reservation,
          status: 'cancelled'
        });
      }
      
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error);
    }
  };

  // 픽업 완료 처리
  const handleCompleteReservation = async () => {
    try {
      // 실제 구현에서는 API 호출
      // await fetch(`/api/reservations/${params.id}/complete`, {
      //   method: 'POST'
      // });
      
      // 상태 업데이트
      if (reservation) {
        setReservation({
          ...reservation,
          status: 'completed'
        });
      }
      
      setCompleteDialogOpen(false);
    } catch (error) {
      console.error("픽업 완료 처리 중 오류 발생:", error);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="container max-w-xl mx-auto p-4 flex justify-center items-center min-h-screen">
          <p>예약 정보를 불러오는 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!reservation) {
    return (
      <MobileLayout>
        <div className="container max-w-xl mx-auto p-4 flex flex-col justify-center items-center min-h-screen">
          <p className="text-center mb-4">예약 정보를 찾을 수 없습니다.</p>
          <Link href="/reservations">
            <Button>예약 목록으로 돌아가기</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="container max-w-xl mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/reservations" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">예약 상세</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>예약 정보</CardTitle>
              <Badge className={statusBadgeConfig[reservation.status].color}>
                {statusBadgeConfig[reservation.status].text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 상품 정보 */}
            <div className="flex items-center">
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
                <p className="text-sm text-gray-500">
                  수량: {reservation.quantity}개
                </p>
                <p className="text-sm font-semibold">
                  {formatPrice(reservation.totalPrice)}원
                </p>
              </div>
            </div>

            {/* 픽업 정보 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">픽업 정보</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm">픽업 날짜</p>
                    <p className="font-medium">{formatDate(reservation.pickupDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm">픽업 시간</p>
                    <p className="font-medium">{reservation.pickupTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 가게 정보 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">가게 정보</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Store className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm">가게 이름</p>
                    <p className="font-medium">{reservation.storeName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm">주소</p>
                    <p className="font-medium">{reservation.storeAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 고객 정보 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">고객 정보</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <User className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm">이름</p>
                    <p className="font-medium">{reservation.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm">연락처</p>
                    <p className="font-medium">{reservation.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">결제 정보</h3>
              <div className="flex items-start">
                <DollarSign className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm">결제 금액</p>
                  <p className="font-medium">{formatPrice(reservation.totalPrice)}원</p>
                </div>
              </div>
            </div>

            {/* 예약 상태 시간 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">예약 시간</h3>
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm">예약 신청일</p>
                  <p className="font-medium">{formatDate(reservation.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              {reservation.status === 'pending' && (
                <>
                  {isOwner && (
                    <Button 
                      className="w-full bg-[#5DCA69] hover:bg-[#4db058]"
                      onClick={() => setCompleteDialogOpen(true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      예약 승인하기
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    예약 취소하기
                  </Button>
                </>
              )}
              {reservation.status === 'confirmed' && (
                <>
                  {isOwner && (
                    <Button 
                      className="w-full bg-[#5DCA69] hover:bg-[#4db058]"
                      onClick={() => setCompleteDialogOpen(true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      픽업 완료 처리
                    </Button>
                  )}
                  {!isOwner && reservation.status === 'confirmed' && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200"
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      예약 취소하기
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardFooter>
        </Card>
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
      
      {/* 픽업 완료 확인 다이얼로그 */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reservation.status === 'pending' ? '예약 승인' : '픽업 완료'}
            </DialogTitle>
            <DialogDescription>
              {reservation.status === 'pending' 
                ? '이 예약을 승인하시겠습니까?' 
                : '고객이 상품을 픽업했습니까? 픽업 완료 처리하시겠습니까?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCompleteReservation}>
              {reservation.status === 'pending' ? '승인하기' : '완료 처리'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
} 