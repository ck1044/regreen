import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "인증 오류 | RE-GREEN",
  description: "인증 중 오류가 발생했습니다",
};

export default function AuthErrorPage() {
  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">인증 오류</CardTitle>
            <CardDescription className="text-center">
              인증 과정에서 문제가 발생했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              다시 시도하거나 아래 버튼을 통해 로그인 페이지로 이동해주세요.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/signin">로그인 페이지로 이동</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 