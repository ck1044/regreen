"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${className}`}
    >
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
} 