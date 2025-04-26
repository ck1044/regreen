"use client";

// import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 실제 세션 로그아웃 대신 메인 페이지로 리디렉션
      // await signOut({ redirect: false });
      
      // 테스트를 위해 홈페이지로 리디렉션만 수행
      setTimeout(() => {
        router.push('/');
        setIsLoggingOut(false);
      }, 500);
      
    } catch (error) {
      console.error("로그아웃 오류:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      disabled={isLoggingOut}
      onClick={handleLogout}
      className={className}
    >
      {isLoggingOut ? "로그아웃 중..." : children || "로그아웃"}
    </button>
  );
} 