"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Clock, MapPin, Save, Trash2 } from "lucide-react";
import Link from "next/link";

// 요일 및 시간 옵션 - 기존 register 페이지와 동일
const daysOfWeek = [
  { value: "monday", label: "월요일" },
  { value: "tuesday", label: "화요일" },
  { value: "wednesday", label: "수요일" },
  { value: "thursday", label: "목요일" },
  { value: "friday", label: "금요일" },
  { value: "saturday", label: "토요일" },
  { value: "sunday", label: "일요일" },
];

// 시간 옵션 생성
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      options.push({ value: time, label: time });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// 가게 정보 폼 스키마 - 기존 register 페이지와 동일
const storeFormSchema = z.object({
  name: z.string().min(2, { message: "가게 이름은 최소 2자 이상이어야 합니다" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다" }),
  category: z.string({ required_error: "카테고리를 선택해주세요" }),
  address: z.string().min(5, { message: "주소를 입력해주세요" }),
  detailAddress: z.string().optional(),
  phone: z.string().min(10, { message: "연락처를 입력해주세요" }),
  website: z.string().url({ message: "올바른 웹사이트 URL을 입력해주세요" }).optional().or(z.literal("")),
  businessHours: z.array(
    z.object({
      day: z.string(),
      isOpen: z.boolean().default(true),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })
  ),
  pickupHours: z.array(
    z.object({
      day: z.string(),
      isOpen: z.boolean().default(true),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
    })
  ),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

// 임시 테스트 데이터
const testStoreData = {
  name: "맛있는 비건 레스토랑",
  description: "신선한 유기농 채소로 만든 건강한 비건 요리를 제공하는 레스토랑입니다. 모든 재료는 지역 농가에서 공급받아 신선함을 보장합니다.",
  category: "restaurant",
  address: "서울시 강남구 테헤란로 123",
  detailAddress: "4층 401호",
  phone: "02-1234-5678",
  website: "www.vegan-restaurant.com",
  businessHours: daysOfWeek.map(day => ({
    day: day.value,
    isOpen: day.value !== "sunday",
    openTime: "11:00",
    closeTime: "21:00",
  })),
  pickupHours: daysOfWeek.map(day => ({
    day: day.value,
    isOpen: day.value !== "sunday",
    openTime: "12:00",
    closeTime: "20:00",
  })),
};

export default function StoreEditPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState<StoreFormValues | null>(null);

  // 폼 설정
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      address: "",
      detailAddress: "",
      phone: "",
      website: "",
      businessHours: [],
      pickupHours: [],
    },
  });

  // 가게 정보 불러오기
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        // 실제 구현에서는 API 요청을 통해 가게 정보를 가져옴
        // const response = await fetch(`/api/stores/${params.id}`);
        // const data = await response.json();
        
        // 테스트용 임시 데이터 사용
        const data = testStoreData;
        setStore(data);
        
        // 가져온 데이터로 폼 초기화
        form.reset(data);
        
        setIsLoading(false);
      } catch (error) {
        console.error("가게 정보 조회 중 오류 발생:", error);
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchStoreData();
    }
  }, [form, params.id]);

  // 폼 제출 처리
  const onSubmit = async (values: StoreFormValues) => {
    try {
      console.log("가게 정보 수정 데이터:", values);
      // 실제 구현에서는 API 요청을 통해 서버에 데이터 전송
      // const response = await fetch(`/api/stores/${params.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });
      
      // if (response.ok) {
      //   router.push('/stores');
      // }
      
      // 테스트를 위한 임시 리디렉션
      router.push('/stores');
    } catch (error) {
      console.error("가게 정보 수정 중 오류 발생:", error);
    }
  };

  // 가게 삭제 처리
  const handleDeleteStore = async () => {
    if (window.confirm("정말로 이 가게를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.")) {
      try {
        // 실제 구현에서는 API 요청으로 가게 삭제
        // const response = await fetch(`/api/stores/${params.id}`, {
        //   method: 'DELETE',
        // });
        
        // if (response.ok) {
        //   router.push('/stores');
        // }
        
        // 테스트를 위한 임시 리디렉션
        router.push('/stores');
      } catch (error) {
        console.error("가게 삭제 중 오류 발생:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="container max-w-xl mx-auto p-4 flex justify-center items-center min-h-screen">
          <p className="text-center">가게 정보를 불러오는 중입니다...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!store) {
    return (
      <MobileLayout>
        <div className="container max-w-xl mx-auto p-4 flex flex-col justify-center items-center min-h-screen">
          <p className="text-center mb-4">가게 정보를 찾을 수 없습니다.</p>
          <Link href="/stores">
            <Button>가게 목록으로 돌아가기</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="container max-w-xl mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/stores" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">가게 정보 수정</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic" className="text-sm">
                  기본 정보
                </TabsTrigger>
                <TabsTrigger value="business-hours" className="text-sm">
                  영업 시간
                </TabsTrigger>
                <TabsTrigger value="pickup-hours" className="text-sm">
                  픽업 시간
                </TabsTrigger>
              </TabsList>

              {/* 기본 정보 탭 - 가게 등록 페이지와 동일 */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>가게 이름</FormLabel>
                            <FormControl>
                              <Input placeholder="가게 이름" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>카테고리</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="카테고리 선택" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="restaurant">음식점</SelectItem>
                                <SelectItem value="cafe">카페</SelectItem>
                                <SelectItem value="bakery">베이커리</SelectItem>
                                <SelectItem value="market">마켓</SelectItem>
                                <SelectItem value="convenience">편의점</SelectItem>
                                <SelectItem value="other">기타</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>가게 설명</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="가게 설명을 입력하세요"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>주소</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder="주소" {...field} className="flex-1" />
                                <Button type="button" variant="outline">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  검색
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="detailAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>상세 주소</FormLabel>
                            <FormControl>
                              <Input placeholder="상세 주소 (동, 호수 등)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>전화번호</FormLabel>
                            <FormControl>
                              <Input placeholder="전화번호 (예: 02-1234-5678)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>웹사이트 (선택)</FormLabel>
                            <FormControl>
                              <Input placeholder="웹사이트 URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 영업 시간 탭 - 가게 등록 페이지와 동일 */}
              <TabsContent value="business-hours" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium">영업 시간 설정</h3>
                      </div>
                      
                      {daysOfWeek.map((day, index) => (
                        <div key={day.value} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">{day.label}</h4>
                            <div className="flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={form.watch(`businessHours.${index}.isOpen`)}
                                  onChange={(e) => {
                                    form.setValue(`businessHours.${index}.isOpen`, e.target.checked);
                                  }}
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5DCA69]"></div>
                                <span className="ml-2 text-sm font-medium">
                                  {form.watch(`businessHours.${index}.isOpen`) ? "영업" : "휴무"}
                                </span>
                              </label>
                            </div>
                          </div>

                          {form.watch(`businessHours.${index}.isOpen`) && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  오픈 시간
                                </label>
                                <Select
                                  value={form.watch(`businessHours.${index}.openTime`)}
                                  onValueChange={(value) => form.setValue(`businessHours.${index}.openTime`, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="오픈 시간" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  마감 시간
                                </label>
                                <Select
                                  value={form.watch(`businessHours.${index}.closeTime`)}
                                  onValueChange={(value) => form.setValue(`businessHours.${index}.closeTime`, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="마감 시간" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 픽업 시간 탭 - 가게 등록 페이지와 동일 */}
              <TabsContent value="pickup-hours" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium">픽업 가능 시간 설정</h3>
                      </div>
                      <FormDescription className="text-sm mb-4">
                        설정한 영업 시간 내에서 픽업 가능 시간을 지정해주세요.
                      </FormDescription>
                      
                      {daysOfWeek.map((day, index) => (
                        <div key={day.value} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">{day.label}</h4>
                            <div className="flex items-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={form.watch(`pickupHours.${index}.isOpen`)}
                                  onChange={(e) => {
                                    form.setValue(`pickupHours.${index}.isOpen`, e.target.checked);
                                  }}
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5DCA69]"></div>
                                <span className="ml-2 text-sm font-medium">
                                  {form.watch(`pickupHours.${index}.isOpen`) ? "픽업 가능" : "불가"}
                                </span>
                              </label>
                            </div>
                          </div>

                          {form.watch(`pickupHours.${index}.isOpen`) && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  시작 시간
                                </label>
                                <Select
                                  value={form.watch(`pickupHours.${index}.openTime`)}
                                  onValueChange={(value) => form.setValue(`pickupHours.${index}.openTime`, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="시작 시간" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  종료 시간
                                </label>
                                <Select
                                  value={form.watch(`pickupHours.${index}.closeTime`)}
                                  onValueChange={(value) => form.setValue(`pickupHours.${index}.closeTime`, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="종료 시간" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="sticky bottom-16 bg-white dark:bg-[#0f172a] p-4 shadow-lg border-t left-0 right-0">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDeleteStore}
                  className="flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  가게 삭제
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#5DCA69] hover:bg-[#4db058] flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  저장하기
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </MobileLayout>
  );
} 