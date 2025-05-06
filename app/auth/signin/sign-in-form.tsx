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
import { formatInternalApiUrl, AUTH_ROUTES, SigninRequest, UserProfile } from "@/app/api/routes";

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
  const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(formatInternalApiUrl('/user/profile'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        return null;
      }
      
      const userProfile = await response.json();
      
      // 로컬 스토리지에 프로필 저장
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      return userProfile as UserProfile;
    } catch (error) {
      console.error('사용자 프로필 가져오기 오류:', error);
      return null;
    }
  };

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // API 직접 호출
      const loginUrl = formatInternalApiUrl(AUTH_ROUTES.SIGNIN);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인 중 오류가 발생했습니다');
      }
      
      const authResponse = await response.json();
      
      // 로컬 스토리지에 토큰 저장
      if (typeof window !== 'undefined' && authResponse.accessToken) {
        localStorage.setItem('accessToken', authResponse.accessToken);
      }
      
      // NextAuth를 통한 세션 설정도 함께 진행 (선택적)
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      // 사용자 프로필 정보 가져오기
      const userProfile = await fetchUserProfile(authResponse.accessToken);
      
      // 로그인 성공 후 리다이렉트 (관리자인 경우 관리자 페이지로)
      if (userProfile?.role === 'ADMIN') {
        router.push("/admin");
      } else {
        router.refresh();
        router.push("/");
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다");
      console.error(error);

      // NextAuth를 통한 로그인 재시도 (API 실패시 백업)
      try {
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
      } catch (nextAuthError) {
        setError("로그인 중 오류가 발생했습니다");
        console.error(nextAuthError);
      }
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