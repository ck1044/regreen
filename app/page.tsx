import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
              로그인
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signup">
              회원가입
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
