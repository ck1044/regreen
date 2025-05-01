"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";

// 프로필 폼 스키마 정의
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  phone: z.string().regex(/^\d{3}-\d{4}-\d{4}$|^\d{11}$/, { 
    message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678 또는 01012345678)" 
  }),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// ProfileForm 인터페이스 정의
export interface ProfileFormProps {
  userProfile: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: string;
    profileImage?: string;
  };
  onSubmit: (data: ProfileFormValues) => void;
}

export default function ProfileForm({ userProfile, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(userProfile.profileImage || null);
  const { toast } = useToast();

  // 폼 초기화
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address || "",
    },
  });

  // 폼 제출 핸들러
  const handleSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(data);
      
      toast({
        title: "프로필이 업데이트되었습니다.",
        description: "사용자 정보가 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류가 발생했습니다.",
        description: "프로필 정보를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 프로필 이미지 업로드 */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imagePreview || ""} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <label htmlFor="profile-image" className="flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md cursor-pointer hover:bg-primary/20 focus:outline-none">
            <Upload className="mr-2 h-4 w-4" />
            프로필 이미지 변경
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* 이름 필드 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} placeholder="이름을 입력하세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 이메일 필드 */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input {...field} placeholder="이메일을 입력하세요" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 전화번호 필드 */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <Input {...field} placeholder="010-0000-0000" />
              </FormControl>
              <FormDescription>
                하이픈(-)을 포함한 형식으로 입력하세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 주소 필드 */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주소</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="주소를 입력하세요"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            "변경사항 저장"
          )}
        </Button>
      </form>
    </Form>
  );
} 