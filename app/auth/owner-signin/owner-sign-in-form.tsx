"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockIcon, MailIcon, Loader2, Store } from "lucide-react";
import { formatInternalApiUrl, AUTH_ROUTES, USER_ROUTES } from "@/app/api/routes";
import { toast } from "sonner";
import { saveToken } from "@/lib/auth/token-manager";

// 로그인 유효성 검사 스키마
const signInSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// 사용자 프로필 타입
interface UserProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
}

export default function OwnerSignInForm() {
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
  const fetchUserProfile = async (token: string): Promise<UserProfileData | null> => {
    try {
      const response = await fetch(formatInternalApiUrl(USER_ROUTES.PROFILE), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('프로필 정보를 가져오는 데 실패했습니다.');
      }
      
      const userProfile = await response.json();
      
      // 로컬 스토리지에 프로필 저장
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      return userProfile as UserProfileData;
    } catch (error) {
      console.error('사용자 프로필 가져오기 오류:', error);
      throw new Error('프로필 정보를 가져오는 데 실패했습니다.');
    }
  };
  
  // 로그아웃 처리
  const handleSignOut = () => {
    // 토큰과 사용자 프로필 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userProfile');
    
    // nextauth 세션 제거 이벤트 발생
    const signOutEvent = new Event('auth:signout');
    window.dispatchEvent(signOutEvent);
  };

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);
    setError(null);
    console.log("사장님 로그인 시도:", data.email);

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
      
      if (!authResponse.accessToken) {
        throw new Error('인증 토큰을 받지 못했습니다');
      }
      
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem('accessToken', authResponse.accessToken);
            // 토큰 관리자를 통해 토큰 저장
            if (authResponse.accessToken) {
              saveToken(authResponse.accessToken);
            }
      // 토큰 수신 이벤트 발생
      const tokenEvent = new CustomEvent('auth:token-received', {
        detail: { accessToken: authResponse.accessToken }
      });
      window.dispatchEvent(tokenEvent);
      
      // 사용자 프로필 정보 가져오기
      const userProfile = await fetchUserProfile(authResponse.accessToken);
      
      // 사장님 계정 체크
      if (userProfile?.role !== 'STORE_OWNER') {
        // 사장님 계정이 아니면 로그아웃 처리
        handleSignOut();
        throw new Error('사장님 계정으로만 로그인할 수 있습니다');
      }
      
      // NextAuth를 통한 세션 설정도 함께 진행
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (signInResult?.error) {
        throw new Error('세션 설정에 실패했습니다');
      }
      
      // 로그인 성공 후 리다이렉트
      toast.success("사장님 로그인 성공!", {
        description: "사장님 관리 페이지로 이동합니다."
      });
      
      // 페이지 새로고침 후 이동
      router.refresh();
      router.push("/manage-inventory");
      
    } catch (error) {
      console.error("로그인 오류:", error);
      
      // 로그아웃 처리
      handleSignOut();
      
      const errorMessage = error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다";
      setError(errorMessage);
      toast.error("로그인 실패", {
        description: errorMessage
      });
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
            placeholder="사장님 이메일"
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
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          <>
            <Store className="mr-2 h-4 w-4" />
            사장님 로그인
          </>
        )}
      </Button>
    </form>
  );
} 