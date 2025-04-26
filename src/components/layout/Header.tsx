"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NotificationBell } from "@/components/notification";

type HeaderProps = {
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  isOwner?: boolean;
};

const Header = ({ title, showBackButton = false, rightAction, isOwner = false }: HeaderProps) => {
  const router = useRouter();
  
  // 현재 페이지에 따라 타이틀 설정
  const getTitle = () => {
    if (title) return title;
    
    // 페이지 경로에 따라 자동으로 타이틀 설정
    return "RE-GREEN";
  };
  
  const handleBack = () => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 bg-[#ffffff] bg-[#0f172a] border-b border-[#e1e7ef] border-[#303642]">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-[#f1f5f9] "
          >
            <ArrowLeft size={20} className="text-[#0f172a] text-[#ffffff]" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-[#0f172a] text-[#ffffff]">
          {getTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationBell isOwner={isOwner} />
        {rightAction && rightAction}
      </div>
    </header>
  );
};

export default Header; 