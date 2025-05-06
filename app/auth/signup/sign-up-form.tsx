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
import { formatInternalApiUrl, AUTH_ROUTES } from "@/app/api/routes";

// 회원가입 유효성 검사 스키마
const signUpSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  phoneNumber: z // 필드명 변경 phone -> phoneNumber (API와 일치)
    .string()
    .min(10, "전화번호는 최소 10자 이상이어야 합니다")
    .regex(/^[0-9-]+$/, "유효한 전화번호 형식이 아닙니다"),
  university: z.string().min(2, "학교 이름은 최소 2자 이상이어야 합니다"),
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
      university: "", // 대학교 필드 추가
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
      // API 요청 데이터 준비
      const { confirmPassword, ...signupData } = data;
      console.log('회원가입 요청 데이터:', signupData);
      
      // API 엔드포인트 구성
      const url = formatInternalApiUrl(AUTH_ROUTES.SIGNUP_CUSTOMER);
      
      // API 호출
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입 중 오류가 발생했습니다");
      }
      
      const result = await response.json();
      console.log('회원가입 성공:', result);
      
      // 액세스 토큰 저장
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
      }

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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5"/>
            </svg>
          </div>
          <Input
            id="university"
            type="text"
            placeholder="대학교"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            className="pl-10"
            {...register("university")}
          />
        </div>
        {errors.university && (
          <p className="text-sm font-medium text-destructive">{errors.university.message}</p>
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