"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MobileLayout from "./MobileLayout";

type AppWrapperProps = {
  children: React.ReactNode;
};

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin");
  const [isClient, setIsClient] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // 사용자 정보 가져오기
  useEffect(() => {
    setIsClient(true);
    
    try {
      // 로컬 스토리지에서 사용자 프로필 가져오기
      const userProfileStr = localStorage.getItem('userProfile');
      
      if (userProfileStr) {
        const profileData = JSON.parse(userProfileStr);
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('사용자 프로필 로딩 오류:', error);
    }
  }, []);
  
  // 권한 확인 및 리디렉션
  useEffect(() => {
    if (!isClient) return;
    
    // 관리자 페이지 접근 권한 체크
    if (isAdminPage) {
      if (!userProfile) {
        // 사용자 정보가 없는 경우 로그인 페이지로
        router.push('/auth/signin');
        return;
      }
      
      if (userProfile.role !== 'ADMIN') {
        // 관리자가 아닌 경우 메인 페이지로
        console.log('관리자 권한이 없습니다.');
        router.push('/');
        return;
      }
    }
    
    // 사장님 전용 페이지 권한 체크
    const isOwnerPage = pathname?.startsWith("/manage-inventory") || 
                        pathname?.startsWith("/owner");
    
    if (isOwnerPage) {
      if (!userProfile) {
        // 사용자 정보가 없는 경우 사장님 로그인 페이지로
        router.push('/auth/owner-signin');
        return;
      }
      
      if (userProfile.role !== 'STORE_OWNER') {
        // 사장님이 아닌 경우 메인 페이지로
        console.log('사장님 권한이 없습니다.');
        router.push('/main');
        return;
      }
    }
  }, [isClient, isAdminPage, pathname, router, userProfile]);

  // 클라이언트 사이드 렌더링이 아직 안 된 경우
  if (!isClient) {
    return null;
  }

  // 관리자 페이지인 경우
  if (isAdminPage) {
    return <>{children}</>;
  }

  // 사용자 역할에 따라 적절한 레이아웃 선택
  const isOwner = userProfile?.role === 'STORE_OWNER';
  const userId = userProfile?.id?.toString() || undefined;

  return (
    <MobileLayout userId={userId} isOwner={isOwner}>
      {children}
    </MobileLayout>
  );
} 