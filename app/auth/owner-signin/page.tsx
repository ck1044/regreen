import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OwnerSignInForm from "./owner-sign-in-form";
import { Store } from "lucide-react";

export const metadata: Metadata = {
  title: "사장님 로그인 | RE-GREEN",
  description: "RE-GREEN 서비스에 사장님으로 로그인하세요",
};

export default function OwnerSignInPage() {
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Store className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">사장님 로그인</CardTitle>
            <CardDescription className="text-center">
              사장님 계정으로 로그인하여 가게를 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OwnerSignInForm />
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                일반 회원이신가요?{" "}
                <Link href="/auth/signin" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  일반 로그인
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                사장님 계정이 없으신가요?{" "}
                <Link href="/auth/owner-signup" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 