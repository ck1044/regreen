"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Store, Minus, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
import { useParams, useRouter } from "next/navigation";
import { formatInternalApiUrl, INVENTORY_ROUTES, RESERVATION_ROUTES } from "@/app/api/routes";
import { useSession } from "next-auth/react";
import { toast } from 'sonner';

// dayjs 한국어 설정
dayjs.locale('ko');

type InventoryDetail = {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
  store: {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    storeInfo?: string;
    storePickupTime?: string;
    category?: {
      id: number;
      name: string;
    };
  };
};

export default function InventoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session } = useSession();
  
  const [inventoryDetail, setInventoryDetail] = useState<InventoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // 데이터 가져오기
  React.useEffect(() => {
    const fetchInventoryDetail = async () => {
      try {
        setLoading(true);
        
        // @ts-ignore - accessToken 속성이 타입 정의에 없어서 무시
        const accessToken = session?.user?.accessToken;
        
        // 요청 헤더 구성
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        // 토큰이 있으면 헤더에 추가
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        // API 엔드포인트 구성
        const apiEndpoint = formatInternalApiUrl(INVENTORY_ROUTES.DETAIL(Number(id)));
        
        // API 호출
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers,
          cache: 'no-store'
        });
        
        // 응답이 성공적이지 않은 경우
        if (!response.ok) {
          throw new Error(`재고 상세 조회 실패: ${response.status}`);
        }
        
        const data = await response.json();
        setInventoryDetail(data);
      } catch (error) {
        console.error('재고 상세 조회 오류:', error);
        toast.error("상품 정보를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchInventoryDetail();
    }
  }, [id, session]);
  
  // 로딩 중 또는 정보가 없는 경우
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-t-2 border-[#5DCA69] border-r-2 rounded-full mb-4"></div>
        <p>상품 정보를 불러오는 중...</p>
      </div>
    );
  }
  
  // 재고 정보가 없는 경우
  if (!inventoryDetail) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[50vh]">
        <h1 className="text-xl font-bold mb-2">상품을 찾을 수 없습니다</h1>
        <p className="text-[#64748b] mb-4">요청하신 상품 정보가 존재하지 않습니다.</p>
        <Link href="/inventory">
          <Button>목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }
  
  // startTime과 endTime 파싱
  const startTime = inventoryDetail.startTime ? new Date(inventoryDetail.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : "09:00";
  const endTime = inventoryDetail.endTime ? new Date(inventoryDetail.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) : "21:00";
  
  // 픽업 가능 시간 및 날짜 계산
  const formattedStartTime = inventoryDetail.startTime 
    ? dayjs(inventoryDetail.startTime).format('HH:mm') 
    : '정보 없음';
  const formattedEndTime = inventoryDetail.endTime 
    ? dayjs(inventoryDetail.endTime).format('HH:mm') 
    : '정보 없음';
  const formattedDate = inventoryDetail.endTime 
    ? dayjs(inventoryDetail.endTime).format('MM월 DD일 (ddd)') 
    : '정보 없음';
  
  // 수량 증가/감소 핸들러
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (inventoryDetail?.quantity || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  // 예약 제출 핸들러
  const handleReservation = async () => {
    if (!session) {
      toast.error("로그인이 필요합니다", {
        description: "예약을 위해 로그인이 필요합니다.",
      });
      router.push("/auth/signin");
      return;
    }
    
    if (!pickupTime) {
      toast.error("픽업 시간을 선택해주세요", {
        description: "픽업 예정 시간을 선택해주세요.",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // @ts-ignore - accessToken 속성이 타입 정의에 없어서 무시
      const accessToken = session?.user?.accessToken;
      
      if (!accessToken) {
        toast.error("인증 오류", {
          description: "로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.",
        });
        router.push("/auth/signin");
        return;
      }
      
      // 픽업 시간을 정확한 ISO 8601 형식으로 변환
      // 픽업할 날짜 가져오기 (inventoryDetail.endTime에서 날짜 부분만)
      const pickupDate = inventoryDetail.endTime
        ? dayjs(inventoryDetail.endTime).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');
      
      // 날짜와 선택한 시간 조합 후 ISO 문자열 생성 (시간 부분만 사용자 입력값)
      const fullPickupTime = `${pickupDate}T${pickupTime}:00`;
      
      const reservationData = {
        inventoryId: inventoryDetail.id,
        pickUpTime: fullPickupTime,
        amount: quantity
      };
      
      console.log('예약 데이터:', reservationData);
      
      // 예약 API 호출
      const response = await fetch(formatInternalApiUrl(RESERVATION_ROUTES.BASE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '예약 처리 중 오류가 발생했습니다.');
      }
      
      // 예약 성공
      toast.success("예약 완료", {
        description: `${inventoryDetail.name} ${quantity}개 예약이 성공적으로 완료되었습니다.`,
      });
      
      // 다이얼로그 닫기
      setDialogOpen(false);
      
      // 캐시 무효화 및 페이지 새로고침
      router.refresh();
      
    } catch (error) {
      console.error('예약 처리 중 오류:', error);
      toast.error("예약 실패", {
        description: error instanceof Error ? error.message : "예약 처리 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 총 금액 계산
  const totalPrice = inventoryDetail.price * quantity;

  return (
    <div className="pb-16">
      {/* 상품 이미지 */}
      <div className="relative w-full h-64">
        <Image
          src={inventoryDetail.imageUrl || "/images/food-default.jpg"}
          alt={inventoryDetail.name}
          fill
          className="object-cover"
        />
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-[#0f172a] mb-1">{inventoryDetail.name}</h1>
        <Link href={`/shops/${inventoryDetail.store.id}`} className="inline-flex items-center text-[#64748b] mb-3">
          <Store size={14} className="mr-1" />
          {inventoryDetail.store.name}
        </Link>
        
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-[#0f172a] mr-2">
            {inventoryDetail.price.toLocaleString()}원
          </span>
        </div>

        <div className="text-[#0f172a] mb-4">
          {inventoryDetail.description || "상품 설명이 없습니다."}
        </div>

        <div className="bg-[#f8fafc] p-3 rounded-lg mb-4">
          <div className="flex items-start mb-2">
            <Calendar size={16} className="text-[#64748b] mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#0f172a]">픽업 날짜</p>
              <p className="text-sm text-[#64748b]">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock size={16} className="text-[#64748b] mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#0f172a]">픽업 가능 시간</p>
              <p className="text-sm text-[#64748b]">{formattedStartTime} - {formattedEndTime}</p>
            </div>
          </div>
        </div>

        {/* 재고 정보 및 예약 버튼 */}
        <div className="bg-[#f8fafc] p-3 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#0f172a]">남은 수량</p>
              <p className="text-sm text-[#64748b]">{inventoryDetail.quantity}개</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                  예약하기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>예약하기</DialogTitle>
                  <DialogDescription>
                    {inventoryDetail.name} 상품을 예약합니다. 픽업 시간과 수량을 선택해주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#0f172a]">
                      수량
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className="w-10 h-10 border border-[#e1e7ef] rounded-l-lg flex items-center justify-center text-[#64748b]"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="w-12 h-10 border-t border-b border-[#e1e7ef] flex items-center justify-center font-medium text-[#0f172a]">
                        {quantity}
                      </div>
                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="w-10 h-10 border border-[#e1e7ef] rounded-r-lg flex items-center justify-center text-[#64748b]"
                        disabled={quantity >= inventoryDetail.quantity}
                      >
                        <Plus size={16} />
                      </button>
                      <span className="ml-3 text-sm text-[#64748b]">
                        남은 수량: {inventoryDetail.quantity}개
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#0f172a]">
                      픽업 예정 시간
                    </label>
                    <Input 
                      type="time"
                      min={startTime}
                      max={endTime}
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                      className="w-full"
                    />
                    <p className="text-xs text-[#64748b] flex items-center">
                      <Info size={12} className="mr-1" />
                      픽업 가능 시간 ({startTime} - {endTime}) 내에서 선택해주세요.
                    </p>
                  </div>

                  <div className="border-t border-[#e1e7ef] pt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#64748b]">상품 금액</span>
                      <span className="text-[#0f172a]">{inventoryDetail.price.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#64748b]">수량</span>
                      <span className="text-[#0f172a]">{quantity}개</span>
                    </div>
                    <div className="flex justify-between font-medium mt-2 pt-2 border-t border-dashed border-[#e1e7ef]">
                      <span className="text-[#0f172a]">총 결제 금액</span>
                      <span className="text-lg text-[#5DCA69]">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-[#5DCA69] hover:bg-[#4db058]"
                    disabled={isSubmitting}
                    onClick={handleReservation}
                  >
                    {isSubmitting ? "처리 중..." : "예약하기"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 매장 정보 */}
        <div className="border-t border-[#e1e7ef] pt-4">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-3">매장 정보</h2>
          <div className="flex items-start mb-2">
            <Store size={16} className="text-[#64748b] mr-2 mt-0.5" />
            <div className="w-full">
              <div className="grid grid-cols-[80px_1fr] gap-1">
                <p className="text-sm font-medium text-[#0f172a]">매장이름:</p>
                <p className="text-sm text-[#64748b]">{inventoryDetail.store.name}</p>
                
                <p className="text-sm font-medium text-[#0f172a]">주소:</p>
                <p className="text-sm text-[#64748b]">{inventoryDetail.store.address}</p>
                
                <p className="text-sm font-medium text-[#0f172a]">전화번호:</p>
                <p className="text-sm text-[#64748b]">{inventoryDetail.store.phoneNumber}</p>
              </div>
              
              {inventoryDetail.store.storeInfo && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-[#0f172a]">매장 영업시간:</p>
                  <p className="text-sm text-[#64748b]">{inventoryDetail.store.storeInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 