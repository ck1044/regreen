"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// 프로필 폼 스키마 정의
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  phone: z.string().regex(/^\d{3}-\d{4}-\d{4}$|^\d{11}$/, { 
    message: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678 또는 01012345678)" 
  }),
  university: z.string().min(1, { message: "학교를 입력해주세요." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// ProfileForm 인터페이스 정의
export interface ProfileFormProps {
  userProfile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    university: string;
  };
  onSubmit: (data: ProfileFormValues) => void;
}

export default function ProfileForm({ userProfile, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // 폼 초기화
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      university: userProfile.university
    },
  });

  // 폼 제출 핸들러
  const handleSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(data);
      
      toast.success("프로필이 업데이트되었습니다.");
    } catch (error) {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        {/* 학교 필드 */}
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>학교</FormLabel>
              <FormControl>
                <Input {...field} placeholder="학교를 입력하세요" />
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