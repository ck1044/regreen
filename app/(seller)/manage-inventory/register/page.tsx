"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, ImageIcon, Save, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// API 클라이언트 제거됨: 필요한 API 타입 및 경로만 임포트
import { formatInternalApiUrl, INVENTORY_ROUTES, InventoryCreateRequest } from "@/app/api/routes";
import { useSession } from "next-auth/react";

// 재고 등록 폼 유효성 검사 스키마
const inventoryFormSchema = z.object({
  name: z.string().min(2, { message: "상품명은 최소 2자 이상이어야 합니다" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다" }),
  price: z.string().min(1, { message: "가격을 선택해주세요" }),
  quantity: z.coerce.number().int().min(0, { message: "수량은 0 이상이어야 합니다" }),
  // 이미지는 프론트엔드에서만 관리하고 API 호출 시 FormData로 전송할 예정
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

// 가격 구간 설정
const priceOptions = [
  "3900", "4900", "5900", "6900", "7900", "8900", "9900", 
  "10900", "11900", "12900", "13900", "14900", "15900", 
  "16900", "17900", "18900", "19900"
];

// apiClient.inventory.create() 대체
const createInventory = async (data: InventoryCreateRequest, image?: File | null, token?: string) => {
  try {
    const formData = new FormData();
    
    // JSON 데이터를 FormData에 추가
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value || ''));
    });
    
    // 이미지가 있으면 추가
    if (image) {
      formData.append('file', image);
    }
    
    // 토큰이 없으면 에러 발생
    if (!token) {
      throw new Error('인증 토큰이 필요합니다');
    }
    
    const response = await fetch(formatInternalApiUrl(INVENTORY_ROUTES.BASE), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`재고 생성 실패: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('재고 생성 오류:', error);
    throw error;
  }
};

export default function InventoryRegisterPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: session } = useSession();
  
  // 폼 설정
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: 0,
    },
  });

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출 처리
  const onSubmit = async (values: InventoryFormValues) => {
    try {
      console.log("재고 등록 데이터:", values);
      console.log("선택된 이미지:", selectedFile);
      
      // @ts-ignore - accessToken 속성이 타입 정의에 없어서 무시
      const accessToken = session?.user?.accessToken;
      
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        router.push('/auth/signin');
        return;
      }
      
      // apiClient를 사용하여 재고 생성 요청
      try {
        await createInventory({
          name: values.name,
          description: values.description,
          price: parseFloat(values.price),
          quantity: values.quantity,
          availableTime: new Date().toISOString() // 예시: 현재 시간 사용 (실제로는 적절한 시간 포맷 사용)
        }, selectedFile, accessToken);
        
        // 성공 시 재고 관리 페이지로 이동
        router.push('/manage-inventory');
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        alert("재고 등록에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("재고 등록 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <div className="container max-w-xl mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">재고 등록</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Card>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {/* 상품 이미지 업로드 */}
                  <div className="mb-6">
                    <FormLabel className="block mb-2">상품 이미지</FormLabel>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-gray-50 mb-2">
                      {imagePreview ? (
                        <div className="relative w-full h-40 mb-4">
                          <Image 
                            src={imagePreview} 
                            alt="Product preview" 
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded-lg"
                          />
                        </div>
                      ) : (
                        <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                      )}
                      <label className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 bg-[#5DCA69] hover:bg-[#4db058] text-white py-2 px-4 rounded-md">
                          <UploadCloud className="h-4 w-4" />
                          <span>이미지 업로드</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <FormDescription className="text-center text-xs mt-2">
                        PNG, JPG, GIF 최대 5MB
                      </FormDescription>
                    </div>
                  </div>

                  {/* 상품명 */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상품명</FormLabel>
                        <FormControl>
                          <Input placeholder="상품명" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 상품 설명 */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상품 설명</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="상품 설명을 입력하세요"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 가격 선택 드롭다운 */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>가격 (원)</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="가격을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {priceOptions.map((price) => (
                                <SelectItem key={price} value={price}>
                                  {price}원
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 수량 */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>수량</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              <Button type="submit" className="w-full mt-4 bg-[#5DCA69] hover:bg-[#4db058]">
                <Save className="h-4 w-4 mr-2" />
                제품 등록하기
              </Button>
                </div>
              </CardContent>
            </Card>

          </form>
        </Form>
      </div>
    </div>
  );
} 