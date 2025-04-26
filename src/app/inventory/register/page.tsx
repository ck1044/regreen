"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Calendar, ImageIcon, Save, UploadCloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 재고 등록 폼 유효성 검사 스키마
const inventoryFormSchema = z.object({
  name: z.string().min(2, { message: "상품명은 최소 2자 이상이어야 합니다" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다" }),
  originalPrice: z.coerce.number().min(0, { message: "원가는 0 이상이어야 합니다" }),
  discountedPrice: z.coerce.number().min(0, { message: "할인가는 0 이상이어야 합니다" }).optional(),
  quantity: z.coerce.number().int().min(0, { message: "수량은 0 이상이어야 합니다" }),
  expiryDate: z.string().optional(),
  // 이미지는 프론트엔드에서만 관리하고 API 호출 시 FormData로 전송할 예정
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

export default function InventoryRegisterPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 폼 설정
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      originalPrice: 0,
      discountedPrice: 0,
      quantity: 0,
      expiryDate: "",
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
      
      // 실제 구현에서는 FormData를 사용하여 이미지와 함께 API 요청
      // const formData = new FormData();
      // Object.entries(values).forEach(([key, value]) => {
      //   formData.append(key, String(value));
      // });
      // if (selectedFile) {
      //   formData.append('image', selectedFile);
      // }
      
      // const response = await fetch('/api/inventory', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (response.ok) {
      //   router.push('/inventory');
      // }
      
      // 테스트를 위한 임시 리디렉션
      router.push('/inventory');
    } catch (error) {
      console.error("재고 등록 중 오류 발생:", error);
    }
  };

  return (
    <MobileLayout>
      <div className="container max-w-xl mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <Link href="/inventory" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">재고 등록</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* 상품 이미지 업로드 */}
                  <div className="mb-6">
                    <FormLabel className="block mb-2">상품 이미지</FormLabel>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-gray-50 bg-gray-800 mb-2">
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
                      <FormDescription className="text-center mt-2">
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

                  {/* 원가 */}
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>원가 (원)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 할인가 */}
                  <FormField
                    control={form.control}
                    name="discountedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>할인가 (원)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          할인을 적용하지 않을 경우 비워두세요
                        </FormDescription>
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

                  {/* 유통기한 */}
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>유통기한</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <Calendar className="h-4 w-4 text-gray-500" />
                        </div>
                        <FormDescription>
                          유통기한이 없는 상품은 비워두세요
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="sticky bottom-16 bg-white bg-[#0f172a] p-4 shadow-lg border-t left-0 right-0">
              <Button type="submit" className="w-full bg-[#5DCA69] hover:bg-[#4db058]">
                <Save className="h-4 w-4 mr-2" />
                제품 등록하기
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MobileLayout>
  );
} 