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
import apiClient from "@/lib/api"; // API 클라이언트 임포트
import { toast } from "sonner";

// 로그인 유효성 검사 스키마
const signInSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// apiError에 대한 타입 정의
interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
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

  // 사용자 프로필 정보 확인 및 역할 체크
  const checkUserRole = async () => {
    try {
      console.log("사용자 프로필 정보 확인 중...");
      const userProfile = await apiClient.user.getProfile();
      console.log("사용자 프로필:", userProfile);
      
      // 사장님(STORE_OWNER)이 아닌 경우 에러 표시
      if (userProfile.role !== 'STORE_OWNER') {
        console.error("사장님 계정이 아님:", userProfile.role);
        setError("사장님 계정이 아닙니다. 일반 회원 로그인을 이용해주세요.");
        apiClient.auth.signout(); // 로그아웃 처리
        return false;
      }
      
      console.log("사장님 계정 확인 완료");
      return true;
    } catch (error) {
      console.error('사용자 프로필 확인 오류:', error);
      return false;
    }
  };

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);
    setError(null);
    console.log("로그인 시도:", data.email);

    try {
      // API 클라이언트를 사용한 로그인 시도
      try {
        console.log("API 클라이언트로 로그인 시도...");
        const authResponse = await apiClient.auth.signin(data);
        console.log("API 로그인 성공:", authResponse);
        
        // 로그인 성공 후 사용자 역할 확인
        const isStoreOwner = await checkUserRole();
        
        if (!isStoreOwner) {
          // 이미 에러 메시지가 설정되었고 로그아웃 처리되었음
          setIsLoading(false);
          return;
        }
        
        // 사장님인 경우 관리 페이지로 이동
        toast.success("로그인 성공! 사장님 관리 페이지로 이동합니다.");
        router.refresh();
        router.push("/inventory"); // 재고 관리 페이지로 이동
        return;
      } catch (apiError) {
        console.error("API 로그인 오류:", apiError);
        
        // NextAuth 를 통한 로그인 시도
        console.log("NextAuth로 로그인 시도...");
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        
        console.log("NextAuth 로그인 결과:", signInResult);
        
        if (signInResult?.error) {
          console.error("NextAuth 로그인 오류:", signInResult.error);
          setError("이메일 또는 비밀번호가 올바르지 않습니다");
          return;
        }
        
        if (signInResult?.ok) {
          // 로그인 성공 후 사용자 역할 확인
          const isStoreOwner = await checkUserRole();
          
          if (!isStoreOwner) {
            // 이미 에러 메시지가 설정되었고 로그아웃 처리되었음
            return;
          }
          
          // 사장님인 경우 관리 페이지로 이동
          toast.success("로그인 성공! 사장님 관리 페이지로 이동합니다.");
          router.refresh();
          router.push("/inventory"); // 재고 관리 페이지로 이동
          return;
        }
        
        // API 로그인이 실패한 경우 에러 메시지 표시
        const typedError = apiError as ApiError;
        setError(typedError.message || "이메일 또는 비밀번호가 올바르지 않습니다");
      }
    } catch (error) {
      console.error("로그인 중 예상치 못한 오류:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "로그인 중 오류가 발생했습니다";
      setError(`로그인 중 오류가 발생했습니다: ${errorMessage}`);
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
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm font-medium text-destructive">{error}</p>
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