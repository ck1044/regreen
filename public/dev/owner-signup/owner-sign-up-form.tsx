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
  BuildingIcon,
  MapPinIcon,
  TagIcon
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
// API 클라이언트 제거됨: 필요한 API 타입 및 경로만 임포트
import { formatInternalApiUrl } from "@/app/api/routes"; // API 클라이언트 임포트
import { toast } from "sonner";

// 사장님 회원가입 유효성 검사 스키마
const ownerSignUpSchema = z.object({
  // 사용자 기본 정보
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력하세요"),
  phoneNumber: z
    .string()
    .min(10, "전화번호는 최소 10자 이상이어야 합니다")
    .regex(/^[0-9-]+$/, "유효한 전화번호 형식이 아닙니다"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  confirmPassword: z.string(),
  
  // 역할은 항상 STORE_OWNER로 고정
  role: z.literal("STORE_OWNER"),

  // 가게 정보
  storeName: z.string().min(2, "가게 이름은 최소 2자 이상이어야 합니다"),
  storeAddress: z.string().min(5, "가게 주소를 정확히 입력해주세요"),
  storePhoneNumber: z
    .string()
    .min(10, "가게 전화번호는 최소 10자 이상이어야 합니다")
    .regex(/^[0-9-]+$/, "유효한 전화번호 형식이 아닙니다"),
  storeCategory: z.string({
    required_error: "가게 카테고리를 선택해주세요"
  })
})
.refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type OwnerSignUpFormValues = z.infer<typeof ownerSignUpSchema>;

// 가게 카테고리 목록
const storeCategories = [
  { value: "Bakery", label: "베이커리" },
  { value: "Salad", label: "샐러드" },
  { value: "Lunchbox", label: "도시락" },
  { value: "Fruit", label: "과일/청과" },
  { value: "Other", label: "기타" }
];

// apiError에 대한 타입 정의
interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
}

export default function OwnerSignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OwnerSignUpFormValues>({
    resolver: zodResolver(ownerSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "STORE_OWNER",
      storeName: "",
      storeAddress: "",
      storePhoneNumber: "",
      storeCategory: ""
    },
  });

  // 카테고리 선택 변경 처리
  const handleCategoryChange = (value: string) => {
    setValue("storeCategory", value);
  };

  async function onSubmit(data: OwnerSignUpFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // 1단계: 기본 회원가입 처리
      // API 클라이언트를 사용하여 회원가입 요청
      const { confirmPassword, ...signupData } = data;
      await apiClient.auth.signup(signupData);

      // 2단계: 로그인 처리
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("로그인 중 오류가 발생했습니다");
      }

      // 3단계: 사장님 프로필 업데이트 (가게 정보 포함)
      try {
        // API 클라이언트를 사용하여 점주 프로필 생성
        await apiClient.user.createStoreOwnerProfile({
          name: data.name,
          phoneNumber: data.phoneNumber,
          storeName: data.storeName,
          storeAddress: data.storeAddress,
          storeCategory: data.storeCategory,
          storePhoneNumber: data.storePhoneNumber
        }, null); // 이미지 업로드는 필요 시 구현
      } catch (profileError) {
        console.error("점주 프로필 생성 오류:", profileError);
        toast.error("회원가입은 완료되었으나 가게 정보 등록에 실패했습니다. 로그인 후 프로필에서 정보를 업데이트해주세요.");
      }

      // 회원가입 성공 알림 및 리디렉션
      toast.success("회원가입이 완료되었습니다!");
      router.push("/inventory"); // 사장님 페이지로 리디렉션
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "회원가입 중 오류가 발생했습니다";
      setError(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 기본 정보 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">기본 정보</h3>
        
        <div className="space-y-3">
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
        </div>
      </div>

      {/* 가게 정보 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">가게 정보</h3>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BuildingIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="storeName"
                type="text"
                placeholder="가게 이름"
                disabled={isLoading}
                className="pl-10"
                {...register("storeName")}
              />
            </div>
            {errors.storeName && (
              <p className="text-sm font-medium text-destructive">{errors.storeName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="storeAddress"
                type="text"
                placeholder="가게 주소"
                disabled={isLoading}
                className="pl-10"
                {...register("storeAddress")}
              />
            </div>
            {errors.storeAddress && (
              <p className="text-sm font-medium text-destructive">{errors.storeAddress.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="storePhoneNumber"
                type="tel"
                placeholder="가게 전화번호"
                disabled={isLoading}
                className="pl-10"
                {...register("storePhoneNumber")}
              />
            </div>
            {errors.storePhoneNumber && (
              <p className="text-sm font-medium text-destructive">{errors.storePhoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Select
                onValueChange={handleCategoryChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full pl-10">
                  <SelectValue placeholder="가게 카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {storeCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.storeCategory && (
              <p className="text-sm font-medium text-destructive">{errors.storeCategory.message}</p>
            )}
          </div>
        </div>
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
            가입 중...
          </>
        ) : (
          "사장님으로 가입하기"
        )}
      </Button>
    </form>
  );
} 