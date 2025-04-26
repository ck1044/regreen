"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Calendar, Bell, User, BarChart3, Settings } from "lucide-react";

type NavigationBarProps = {
  userRole: "customer" | "shop" | "admin";
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: ("customer" | "shop" | "admin")[];
};

const NavigationBar = ({ userRole }: NavigationBarProps) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "홈",
      icon: <Home size={20} />,
      roles: ["customer", "shop", "admin"],
    },
    {
      href: "/shops",
      label: "가게 목록",
      icon: <Store size={20} />,
      roles: ["customer", "admin"],
    },
    {
      href: "/shop-dashboard",
      label: "가게 관리",
      icon: <BarChart3 size={20} />,
      roles: ["shop"],
    },
    {
      href: "/reservations",
      label: "예약 내역",
      icon: <Calendar size={20} />,
      roles: ["customer", "shop"],
    },
    {
      href: "/notifications",
      label: "알림",
      icon: <Bell size={20} />,
      roles: ["customer", "shop", "admin"],
    },
    {
      href: "/profile",
      label: "프로필",
      icon: <User size={20} />,
      roles: ["customer", "shop"],
    },
    {
      href: "/admin",
      label: "관리",
      icon: <Settings size={20} />,
      roles: ["admin"],
    },
  ];

  // 현재 사용자 역할에 맞는 메뉴 필터링
  const filteredNavItems = navItems.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-[#ffffff] bg-[#0f172a] border-t border-[#e1e7ef] border-[#303642]">
      <ul className="flex h-full justify-around items-center">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <li key={item.href} className="flex-1">
              <Link 
                href={item.href}
                className={`flex flex-col items-center justify-center h-full ${
                  isActive 
                    ? "text-[#5DCA69]" 
                    : "text-[#64748b] hover:text-[#0f172a] hover:text-[#ffffff]"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavigationBar;