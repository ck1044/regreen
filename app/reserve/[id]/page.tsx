"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShoppingBag,
  DollarSign,
  Store,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// 상품 정보 타입
interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  quantity: number;
  expiryDate?: string;
  storeName: string;
  storeAddress: string;
}

// 예약 폼 유효성 검사 스키마
const reservationFormSchema = z.object({
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "최소 1개 이상 선택해주세요" }),
  pickupDate: z.string().min(1, { message: "픽업 날짜를 선택해주세요" }),
  pickupTime: z.string().min(1, { message: "픽업 시간을 선택해주세요" }),
  name: z.string().min(2, { message: "이름을 입력해주세요" }),
  phone: z.string().regex(/^\d{3}-\d{3,4}-\d{4}$/, {
    message: "올바른 전화번호 형식으로 입력해주세요 (예: 010-1234-5678)",
  }),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

// 목업 상품 데이터 (실제 구현에서는 API에서 가져옴)
const mockProduct: Product = {
  id: "1",
  name: "유기농 당근",
  image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
  description: "신선한 유기농 당근입니다. 각종 요리나 샐러드에 활용하세요.",
  originalPrice: 5000,
  discountedPrice: 3500,
  quantity: 25,
  expiryDate: "2023-12-30",
  storeName: "유기농 마켓",
  storeAddress: "서울특별시 강남구 테헤란로 123",
};

// 시간 선택 옵션
const timeOptions = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00"
];

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

export default function ReservePage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  // 오늘 날짜를 가져와서 달력의 최소 날짜로 설정
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // 한 달 후 날짜를 가져와서 달력의 최대 날짜로 설정
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).toISOString().split('T')[0];

  // 폼 설정
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      quantity: 1,
      pickupDate: minDate,
      pickupTime: "14:00",
      name: "",
      phone: "",
    },
  });

  // 수량 변경 시 총 가격 업데이트
  const watchQuantity = form.watch("quantity");
  
  useEffect(() => {
    if (product) {
      const price = product.discountedPrice || product.originalPrice;
      setTotalPrice(price * watchQuantity);
    }
  }, [watchQuantity, product]);

  // 상품 정보 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch(`/api/products/${params.id}`);
        // const data = await response.json();
        
        // 목업 데이터 사용
        setProduct(mockProduct);
      } catch (error) {
        console.error("상품 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // 폼 제출 처리
  const onSubmit = async (values: ReservationFormValues) => {
    try {
      console.log("예약 데이터:", values);
      console.log("총 가격:", totalPrice);
      
      // 실제 구현에서는 API 호출
      // const response = await fetch("/api/reservations", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     ...values,
      //     productId: params.id,
      //     totalPrice,
      //   }),
      // });
      
      // if (response.ok) {
      //   setSuccessDialogOpen(true);
      // }
      
      // 테스트를 위한 임시 다이얼로그 표시
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error("예약 신청 중 오류 발생:", error);
    }
  };

  // 예약 완료 후 메인 페이지로 이동
  const handleComplete = () => {
    router.push("/my-reservations");
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="container max-w-xl mx-auto p-4 flex justify-center items-center min-h-screen">
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!product) {
    return (
      <MobileLayout>
        <div className="container max-w-xl mx-auto p-4 flex flex-col justify-center items-center min-h-screen">
          <p className="text-center mb-4">상품 정보를 찾을 수 없습니다.</p>
          <Link href="/">
            <Button>메인 페이지로 돌아가기</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="container max-w-xl mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <Link href={`/products/${product.id}`} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">예약 신청</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <div className="flex items-center mt-1">
                  <DollarSign className="h-3 w-3 text-gray-500 mr-1" />
                  {product.discountedPrice ? (
                    <div className="flex items-center">
                      <span className="text-sm line-through text-gray-500 mr-1">
                        {formatPrice(product.originalPrice)}원
                      </span>
                      <span className="text-sm font-semibold text-red-600">
                        {formatPrice(product.discountedPrice)}원
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm">{formatPrice(product.originalPrice)}원</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <Store className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm">{product.storeName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm">{product.storeAddress}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">
                제품 설명: {product.description}
              </p>
              {product.expiryDate && (
                <p className="text-sm text-gray-600">
                  유통기한: {formatDate(product.expiryDate)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* 수량 */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        수량
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max={product.quantity} 
                          {...field} 
                          onChange={(e) => {
                            // 최대값 제한
                            const value = parseInt(e.target.value);
                            if (value > product.quantity) {
                              field.onChange(product.quantity);
                            } else {
                              field.onChange(e);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        재고: {product.quantity}개
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 픽업 날짜 */}
                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        픽업 날짜
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          min={minDate} 
                          max={maxDate} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {product.expiryDate && `유통기한 내에 픽업해주세요 (${formatDate(product.expiryDate)}까지)`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 픽업 시간 */}
                <FormField
                  control={form.control}
                  name="pickupTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        픽업 시간
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="시간 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        가게 운영 시간 내에 픽업해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 이름 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 연락처 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="010-1234-5678" {...field} />
                      </FormControl>
                      <FormDescription>
                        하이픈(-)을 포함하여 입력해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="sticky bottom-16 bg-white bg-[#0f172a] p-4 shadow-lg border-t left-0 right-0">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">총 결제 금액</span>
                <span className="font-bold text-lg text-[#5DCA69]">
                  {formatPrice(totalPrice)}원
                </span>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#5DCA69] hover:bg-[#4db058]"
              >
                예약하기
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {/* 예약 완료 다이얼로그 */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 완료</DialogTitle>
            <DialogDescription>
              예약이 성공적으로 신청되었습니다. 가게 측의 승인 후 확정됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleComplete}>
              예약 내역 확인하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
} 