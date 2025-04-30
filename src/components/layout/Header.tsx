"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

  const handleLogoClick = () => {
    router.push("/main");
  };

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4 bg-white border-b border-[#e1e7ef]">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        )}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <Image src="/logo.png" alt="RE-GREEN" width={32} height={32} className="mr-2" />
          <h1 className="text-lg font-semibold text-gray-900">
            {getTitle()}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationBell isOwner={isOwner} />
        {rightAction && rightAction}
      </div>
    </header>
  );
};

export default Header; 