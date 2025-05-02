"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MobileLayout from "./MobileLayout";

type AppWrapperProps = {
  children: React.ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin");
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // 관리자 권한 체크
    if (isAdminPage) {
      try {
        const userProfileStr = localStorage.getItem('userProfile');
        
        if (!userProfileStr) {
          // 사용자 정보가 없는 경우 로그인 페이지로
          router.push('/auth/signin');
          return;
        }
        
        const userProfile = JSON.parse(userProfileStr);
        
        if (userProfile.role !== 'ADMIN') {
          // 관리자가 아닌 경우 메인 페이지로
          console.log('관리자 권한이 없습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('사용자 권한 확인 오류:', error);
        router.push('/auth/signin');
      }
    }
  }, [isAdminPage, pathname, router]);

  // 클라이언트 사이드 렌더링이 아직 안 된 경우
  if (!isClient) {
    return null;
  }

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <MobileLayout userId={undefined}>
      {children}
    </MobileLayout>
  );
} 