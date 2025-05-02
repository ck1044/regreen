"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockIcon, MailIcon, Loader2 } from "lucide-react";
import apiClient from "@/lib/api"; // API 클라이언트 임포트

// 로그인 유효성 검사 스키마
const signInSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 사용자 프로필 정보 가져오기
  const fetchUserProfile = async () => {
    try {
      const userProfile = await apiClient.user.getProfile();
      
      // 관리자인 경우 admin 페이지로 리다이렉트
      if (apiClient.isAdmin()) {
        router.push('/admin');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('사용자 프로필 가져오기 오류:', error);
      return false;
    }
  };

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // API 클라이언트를 사용한 로그인 시도
      try {
        const authResponse = await apiClient.auth.signin(data);
        // API 직접 로그인 성공
        
        // 로컬 스토리지에 토큰 저장
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', authResponse.accessToken);
        }
        
        // NextAuth를 통한 세션 설정도 함께 진행 (선택적)
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        
        // 사용자 프로필 정보 가져오기
        const isAdmin = await fetchUserProfile();
        
        // 로그인 성공 후 리다이렉트 (관리자가 아닌 경우에만)
        if (!isAdmin) {
          router.refresh();
          router.push("/");
        }
        
        return;
      } catch (apiError) {
        console.error("API 로그인 오류:", apiError);
        // API 로그인이 실패한 경우 NextAuth로 시도
      }

      // NextAuth를 통한 로그인 (API 실패시 백업)
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다");
        return;
      }

      // 로그인 성공 시 리디렉션
      router.refresh();
      router.push("/main");
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MailIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="이메일"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            disabled={isLoading}
            className="pl-10"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </Button>
    </form>
  );
} 