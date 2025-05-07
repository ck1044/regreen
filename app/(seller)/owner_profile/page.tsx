"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PasswordForm from '@/components/profile/password-form';
import { LogOut, Loader2 } from 'lucide-react';
import { signOut } from "next-auth/react";

export default function SellerProfilePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 로그아웃 처리
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>계정 보안을 위해 비밀번호를 변경하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardFooter className="pt-0 pb-3">
          <Button 
            variant="outline" 
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                로그아웃 중...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 