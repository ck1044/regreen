"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";
import NotificationProvider from "@/components/notification/notification-provider";
import { Toaster } from "sonner";

type MobileLayoutProps = {
  children: ReactNode;
  userId?: string | null;
  isOwner?: boolean;
};

const MobileLayout = ({ 
  children, 
  userId, 
  isOwner = false 
}: MobileLayoutProps) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // 로그인 화면이나 회원가입 화면, 인덱스 페이지에서는 헤더와 내비게이션 바를 표시하지 않음
  const isAuthPage = pathname?.includes("/auth") || pathname === "/" || false;
  
  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 인증된 사용자 ID가 없거나 인증 페이지인 경우 알림 시스템 사용하지 않음 
  const shouldUseNotifications = isClient && userId && !isAuthPage;

  // 내부 컨텐츠 렌더링
  const renderContent = () => (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {!isAuthPage && <Header showBackButton={true} isOwner={isOwner} />}
      <main className="flex-1 overflow-auto pb-16">{children}</main>
      {!isAuthPage && <NavigationBar userRole={isOwner ? "shop" : "customer"} />}
      <Toaster position="top-center" richColors />
    </div>
  );

  // 알림 제공자 사용 여부에 따라 조건부 렌더링
  return shouldUseNotifications ? (
    <NotificationProvider userId={userId as string}>
      {renderContent()}
    </NotificationProvider>
  ) : (
    renderContent()
  );
};

export default MobileLayout; 