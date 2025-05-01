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
  BuildingIcon
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// 회원가입 유효성 검사 스키마
const signUpSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  phone: z
    .string()
    .min(10, "전화번호는 최소 10자 이상이어야 합니다")
    .regex(/^[0-9-]+$/, "유효한 전화번호 형식이 아닙니다"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "STORE_OWNER", "ADMIN"], {
    required_error: "역할을 선택해주세요",
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("CUSTOMER");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });

  // 역할 선택 변경 처리
  const handleRoleChange = (value: string) => {
    setRole(value);
    setValue("role", value as "CUSTOMER" | "STORE_OWNER" | "ADMIN");
  };

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // 사용자 등록 API 호출
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입 중 오류가 발생했습니다");
      }

      // 회원가입 성공 후 자동 로그인
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("로그인 중 오류가 발생했습니다");
      }

      // 회원가입 성공 시 리디렉션
      router.push("/");
    } catch (error: any) {
      setError(error.message || "회원가입 중 오류가 발생했습니다");
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
            id="phone"
            type="tel"
            placeholder="전화번호"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            className="pl-10"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
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

      <div className="space-y-2">
        <div className="relative flex">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BuildingIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Select
            defaultValue="CUSTOMER"
            onValueChange={handleRoleChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full pl-10">
              <SelectValue placeholder="역할 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">일반 사용자</SelectItem>
              <SelectItem value="STORE_OWNER">가게 사장님</SelectItem>
              <SelectItem value="ADMIN">관리자</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.role && (
          <p className="text-sm font-medium text-destructive">{errors.role.message}</p>
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
            처리 중...
          </>
        ) : (
          "회원가입"
        )}
      </Button>
    </form>
  );
} 