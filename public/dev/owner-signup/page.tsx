import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OwnerSignUpForm from "./owner-sign-up-form";
import { Store } from "lucide-react";

export const metadata: Metadata = {
  title: "사장님 회원가입 | RE-GREEN",
  description: "RE-GREEN 서비스에 사장님으로 가입하세요",
};

export default function OwnerSignUpPage() {
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-lg">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Store className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">사장님 회원가입</CardTitle>
            <CardDescription className="text-center">
              사장님 계정을 만들고 가게를 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OwnerSignUpForm />
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/auth/owner-signin" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  사장님 로그인
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                일반 회원으로 가입하시겠습니까?{" "}
                <Link href="/auth/signup" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  일반 회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 