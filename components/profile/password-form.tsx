"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { formatInternalApiUrl, USER_ROUTES, UpdatePasswordRequest } from "@/app/api/routes";
import { useSession } from "next-auth/react";

// 비밀번호 변경 검증 스키마 - API 명세에 맞게 수정
const passwordSchema = z.object({
  password: z.string().min(1, { message: '현재 비밀번호를 입력하세요' }),
  newPassword: z.string().min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// 비밀번호 업데이트 함수
const updatePassword = async (data: UpdatePasswordRequest, accessToken?: string): Promise<boolean> => {
  try {
    if (!accessToken) return false;
    
    const response = await fetch(formatInternalApiUrl(USER_ROUTES.UPDATE_PASSWORD), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // 응답 내용 확인
      const errorText = await response.text();
      console.error(`비밀번호 변경 실패 (${response.status}):`, errorText);
      
      if (response.status === 401) {
        throw new Error("현재 비밀번호가 올바르지 않습니다");
      } else {
        throw new Error(`비밀번호 변경 실패: ${response.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    throw error;
  }
};

export default function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // API 호출을 위한 데이터 구성
      const passwordData: UpdatePasswordRequest = {
        password: values.password,
        newPassword: values.newPassword
      };
      
      // API 호출
      await updatePassword(passwordData, accessToken);
      
      form.reset({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('비밀번호가 성공적으로 변경되었습니다');
    } catch (error) {
      let errorMessage = '비밀번호 변경 중 오류가 발생했습니다';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>현재 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="현재 비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="새 비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호 확인" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              변경 중...
            </>
          ) : (
            "비밀번호 변경"
          )}
        </Button>
      </form>
    </Form>
  );
} 