import { Metadata } from "next";
import SignInForm from "./sign-in-form";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "로그인 | RE-GREEN",
  description: "RE-GREEN 서비스에 로그인하세요",
};

export default function SignInPage() {
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M12 2L4 7l8 5 8-5-8-5z" />
                  <path d="M4 12l8 5 8-5" />
                  <path d="M4 17l8 5 8-5" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
            <CardDescription className="text-center">
              아래 정보를 입력하여 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                계정이 없으신가요?{" "}
                <Link href="/auth/signup" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  회원가입
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                사장님이신가요?{" "}
                <Link href="/auth/signin/owner" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  사장님 로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 