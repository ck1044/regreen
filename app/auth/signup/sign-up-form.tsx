"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  LockIcon, 
  MailIcon, 
  UserIcon, 
  PhoneIcon,
} from "lucide-react";
import apiClient from "@/lib/api"; // API 클라이언트 임포트

// 회원가입 유효성 검사 스키마
const signUpSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  phoneNumber: z // 필드명 변경 phone -> phoneNumber (API와 일치)
    .string()
    .min(10, "전화번호는 최소 10자 이상이어야 합니다")
    .regex(/^[0-9-]+$/, "유효한 전화번호 형식이 아닙니다"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "STORE_OWNER"], { // ADMIN 제거 (API 지원 역할만 포함)
    required_error: "역할을 선택해주세요",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

// API 오류 타입 정의
interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "", // 필드명 변경
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });


  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    setError(null);
    console.log('회원가입 시도:', data);

    try {
      // API 클라이언트를 사용하여 회원가입 요청
      const { confirmPassword, ...signupData } = data;
      console.log('API 클라이언트로 회원가입 요청 데이터:', signupData);
      
      // API 클라이언트 호출 (Next.js API 라우트를 통해 요청)
      try {
        const result = await apiClient.auth.signup(signupData);
        console.log('API 클라이언트 회원가입 성공:', result);

        // 회원가입 성공 후 자동 로그인
        console.log('자동 로그인 시도...');
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        console.log('자동 로그인 결과:', signInResult);

        if (signInResult?.error) {
          console.error('자동 로그인 실패:', signInResult.error);
          throw new Error("로그인 중 오류가 발생했습니다");
        }

        // 회원가입 성공 시 리디렉션
        router.push("/main");
      } catch (apiError) {
        console.error('API 클라이언트 회원가입 오류:', apiError);
        const typedError = apiError as ApiError;
        throw new Error(typedError.message || "회원가입 중 오류가 발생했습니다");
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "회원가입 중 오류가 발생했습니다";
      console.error('최종 오류:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="name"
            type="text"
            placeholder="이름"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
        )}
      </div>

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
            <PhoneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="전화번호"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            className="pl-10"
            {...register("phoneNumber")}
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-sm font-medium text-destructive">{errors.phoneNumber.message}</p>
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
            autoComplete="new-password"
            disabled={isLoading}
            className="pl-10"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            disabled={isLoading}
            className="pl-10"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
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
            가입 중...
          </>
        ) : (
          "가입하기"
        )}
      </Button>
    </form>
  );
} 