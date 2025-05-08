"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Phone, Clock, Calendar, Info, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface InventoryDetailProps {
  inventoryDetail: {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    startTime: string;
    endTime: string;
    store: {
      id: number;
      name: string;
      address: string;
      phoneNumber: string;
      lat: number;
      lng: number;
      storeInfo: string;
      storePickupTime: string;
      verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
      category: {
        id: number;
        name: string;
      };
    };
  };
}

export default function InventoryDetailClient({ inventoryDetail }: InventoryDetailProps) {
  const router = useRouter();

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReservation = async () => {
    if (!session) {
      toast.error("로그인이 필요합니다", {
        description: "예약하려면 먼저 로그인해주세요.",
      });
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryId: inventoryDetail.id,
          quantity: 1, // 기본 수량
        }),
      });

      if (!response.ok) {
        throw new Error('예약 생성 실패');
      }

      const data = await response.json();
      
      toast.success("예약 성공!", {
        description: "상품 예약이 완료되었습니다.",
      });
      
      // 예약 확인 페이지로 이동
      router.push(`/reservations/${data.id}`);
    } catch (error) {
      console.error('예약 오류:', error);
      toast.error("예약 실패", {
        description: "예약 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!inventoryDetail) {
    return <div>상품 정보를 찾을 수 없습니다.</div>;
  }

  const isOutOfStock = inventoryDetail.quantity <= 0;

  return (
    <div className="container mx-auto p-4 max-w-3xl pb-20">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {/* 상품 이미지 */}
        <div className="relative w-full h-64 sm:h-80">
          <Image
            src={inventoryDetail.imageUrl || '/placeholder-food.jpg'}
            alt={inventoryDetail.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        {/* 상품 정보 */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{inventoryDetail.name}</h1>
            <Badge className="ml-2">{inventoryDetail.store.category.name}</Badge>
          </div>

          <p className="text-2xl font-bold text-[#5DCA69] mb-4">
            {formatCurrency(inventoryDetail.price)}
          </p>

          <div className="flex items-center text-gray-600 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span>마감: {formatDate(inventoryDetail.endTime)}</span>
          </div>

          <div className="border-t border-b py-4 my-4 space-y-2">
            {inventoryDetail.description && (
              <p className="text-gray-600">{inventoryDetail.description}</p>
            )}
            <div className="flex items-center text-gray-600">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span>남은 수량: {inventoryDetail.quantity}개</span>
            </div>
          </div>

          {/* 가게 정보 */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">{inventoryDetail.store.name}</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>{inventoryDetail.store.address}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{inventoryDetail.store.phoneNumber}</span>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <span>픽업 시간: {inventoryDetail.store.storePickupTime}</span>
                </div>
                
                {inventoryDetail.store.storeInfo && (
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <span>{inventoryDetail.store.storeInfo}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 예약 버튼 */}
          <div className="flex justify-between items-center">
            <Link href="/inventory">
              <Button variant="outline">목록으로 돌아가기</Button>
            </Link>
            
            <Button 
              onClick={handleReservation} 
              disabled={isOutOfStock || isLoading}
              className={`px-6 ${isOutOfStock ? 'bg-gray-400' : 'bg-[#5DCA69] hover:bg-[#4db058]'}`}
            >
              {isLoading ? '처리 중...' : isOutOfStock ? '품절' : '예약하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 