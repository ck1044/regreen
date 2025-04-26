"use client";

import React from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

type HeaderProps = {
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
};

const Header = ({ title, showBackButton = false, rightAction }: HeaderProps) => {
  const router = useRouter();
  
  // 현재 페이지에 따라 타이틀 설정
  const getTitle = () => {
    if (title) return title;
    
    if (router.pathname.includes("/shops")) return "가게 목록";
    if (router.pathname.includes("/reservations")) return "예약 내역";
    if (router.pathname.includes("/notifications")) return "알림";
    if (router.pathname.includes("/profile")) return "프로필";
    
    return "리그린";
  };
  
  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 bg-[#ffffff] dark:bg-[#0f172a] border-b border-[#e1e7ef] dark:border-[#303642]">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]"
          >
            <ArrowLeft size={20} className="text-[#0f172a] dark:text-[#ffffff]" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-[#0f172a] dark:text-[#ffffff]">
          {getTitle()}
        </h1>
      </div>
      
      {rightAction && (
        <div className="flex items-center">{rightAction}</div>
      )}
    </header>
  );
};

export default Header; 