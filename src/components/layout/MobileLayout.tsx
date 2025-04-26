"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";

type MobileLayoutProps = {
  children: ReactNode;
  userRole?: "customer" | "shop" | "admin";
};

const MobileLayout = ({ children, userRole = "customer" }: MobileLayoutProps) => {
  const router = useRouter();
  
  // 로그인 화면이나 회원가입 화면에서는 헤더와 내비게이션 바를 표시하지 않음
  const isAuthPage = router.pathname.includes("/auth");

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#ffffff] dark:bg-[#0f172a]">
      {!isAuthPage && <Header />}
      <main className="flex-1 overflow-auto pb-16">{children}</main>
      {!isAuthPage && <NavigationBar userRole={userRole} />}
    </div>
  );
};

export default MobileLayout; 