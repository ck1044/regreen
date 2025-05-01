import { Metadata } from "next";
import SignUpForm from "./sign-up-form";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "회원가입 | RE-GREEN",
  description: "RE-GREEN 서비스에 가입하세요",
};

export default function SignUpPage() {
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6" />
                  <path d="M16 11h6" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
            <CardDescription className="text-center">
              아래 정보를 입력하여 가입하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/auth/signin" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 