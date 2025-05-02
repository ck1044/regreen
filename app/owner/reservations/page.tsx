"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/api"; // API 클라이언트 임포트
import { formatDate, formatPrice, formatPickupTime, separateDateAndTime } from "@/lib/utils"; // 유틸리티 함수 임포트

// 예약 상태 타입 (대문자로 변경)
type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// 예약 정보 타입 (API 응답 구조에 맞게 변경)
interface Reservation {
  id: number;
  userName: string;
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
  const [actionType, setActionType] = useState<"confirm" | "complete" | "cancel">("confirm");
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트 마운트 시 예약 목록 가져오기
  useEffect(() => {
    fetchReservations();
  }, []);

  // API를 사용하여 예약 목록 가져오기
  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // API 클라이언트를 사용하여 점주 예약 목록 요청
      const reservationData = await apiClient.reservation.getStoreOwnerReservations();
      setReservations(reservationData);
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
      reservation.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
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
  const handleReservationAction = async () => {
    if (!selectedReservation) return;
    
    // 상태 업데이트
    let newStatus: ReservationStatus;
    
    switch(actionType) {
      case "confirm":
        newStatus = "CONFIRMED";
        break;
      case "complete":
        newStatus = "COMPLETED";
        break;
      case "cancel":
        newStatus = "CANCELLED";
        break;
      default:
        newStatus = "PENDING";
    }
    
    try {
      // API 클라이언트를 사용하여 예약 상태 업데이트
      await apiClient.reservation.updateStatus(
        parseInt(selectedReservation), 
        { status: newStatus }
      );
      
      // 로컬 상태 업데이트
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === parseInt(selectedReservation)
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
    } catch (err) {
      console.error('예약 상태 변경 오류:', err);
      setError('예약 상태 변경 중 오류가 발생했습니다');
    } finally {
      setActionDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  // 예약 승인 처리
  const openConfirmDialog = (id: number) => {
    setSelectedReservation(id.toString());
    setActionType("confirm");
    setActionDialogOpen(true);
  };

  // 예약 픽업 완료 처리
  const openCompleteDialog = (id: number) => {
    setSelectedReservation(id.toString());
    setActionType("complete");
    setActionDialogOpen(true);
  };

  // 예약 취소 처리
  const openCancelDialog = (id: number) => {
    setSelectedReservation(id.toString());
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
          description: "고객의 픽업이 완료되었습니까?",
          actionText: "완료 처리"
        };
      case "cancel":
        return {
          title: "예약 취소",
          description: "이 예약을 취소하시겠습니까?",
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

  // 로딩 중 UI
  if (isLoading) {
    return (
      <MobileLayout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
            <p>예약 정보를 불러오는 중...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const dialogContent = getDialogContent();

  return (
    <MobileLayout>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">예약 관리</h1>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="고객명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="confirmed">확정</TabsTrigger>
            <TabsTrigger value="completed">완료</TabsTrigger>
            <TabsTrigger value="cancelled">취소</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {filteredReservations.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-600">예약 내역이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onConfirm={openConfirmDialog}
                    onComplete={openCompleteDialog}
                    onCancel={openCancelDialog}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {["pending", "confirmed", "completed", "cancelled"].map((status) => (
            <TabsContent key={status} value={status} className="mt-4">
              {filteredReservations.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-600">{statusBadgeConfig[status.toUpperCase() as ReservationStatus].text} 상태의 예약이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onConfirm={openConfirmDialog}
                      onComplete={openCompleteDialog}
                      onCancel={openCancelDialog}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* 예약 상태 변경 다이얼로그 */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleReservationAction}>
              {dialogContent.actionText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}

// 예약 카드 컴포넌트
interface ReservationCardProps {
  reservation: Reservation;
  onConfirm: (id: number) => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
}

function ReservationCard({
  reservation,
  onConfirm,
  onComplete,
  onCancel,
}: ReservationCardProps) {
  // 예약 상태에 따른 배지 정보
  const badgeInfo = statusBadgeConfig[reservation.status];
  
  // 픽업 시간 형식화
  const { date, time } = separateDateAndTime(reservation.pickUpTime);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">
              <User className="h-4 w-4 inline mr-1 text-gray-500" />
              {reservation.userName}
            </h3>
            <p className="text-sm text-muted-foreground">
              <Phone className="h-3 w-3 inline mr-1" />
              {"연락처 정보..."}
            </p>
          </div>
          <Badge className={badgeInfo.color}>
            {badgeInfo.text}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">수량: {reservation.amount}개</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {reservation.status === "PENDING" && (
            <>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => onConfirm(reservation.id)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                승인
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive"
                onClick={() => onCancel(reservation.id)}
              >
                <X className="h-4 w-4 mr-1" />
                거절
              </Button>
            </>
          )}

          {reservation.status === "CONFIRMED" && (
            <>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => onComplete(reservation.id)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                픽업 완료
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive"
                onClick={() => onCancel(reservation.id)}
              >
                <X className="h-4 w-4 mr-1" />
                취소
              </Button>
            </>
          )}

          {(reservation.status === "COMPLETED" || reservation.status === "CANCELLED") && (
            <span className="text-sm text-gray-500">
              {formatDate(reservation.createdAt)}에 
              {reservation.status === "COMPLETED" ? " 픽업 완료됨" : " 취소됨"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 