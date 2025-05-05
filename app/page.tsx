import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-8 max-w-md">
        <h1 className="text-4xl font-bold text-primary">
          리그린
        </h1>
        <p className="text-muted-foreground">
          지속가능한 소비를 위한 친환경 플랫폼
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              일반 회원 로그인
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signup">
              회원가입
            </Link>
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">사업자</span>
            </div>
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/auth/owner-signin">
              <Store className="mr-2 h-4 w-4" />
              사장님 로그인
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
