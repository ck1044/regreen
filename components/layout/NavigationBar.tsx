"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Calendar, Bell, User, Package, Settings, BarChart, ShoppingBag } from "lucide-react";

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
    // 고객용 메뉴
    {
      href: "/main",
      label: "홈",
      icon: <Home size={20} />,
      roles: ["customer"],
    },
    {
      href: "/shops",
      label: "가게 목록",
      icon: <Store size={20} />,
      roles: ["customer"],
    },
    {
      href: "/my-reservations",
      label: "예약 내역",
      icon: <Calendar size={20} />,
      roles: ["customer"],
    },
    {
      href: "/notifications",
      label: "알림",
      icon: <Bell size={20} />,
      roles: ["customer"],
    },
    {
      href: "/customer_profile",
      label: "프로필",
      icon: <User size={20} />,
      roles: ["customer"],
    },
    
    // 사장님용 메뉴
    {
      href: "/manage-inventory",
      label: "상품 관리",
      icon: <Package size={20} />,
      roles: ["shop"],
    },
    {
      href: "/owner/reservations",
      label: "예약 관리",
      icon: <Calendar size={20} />,
      roles: ["shop"],
    },

    {
      href: "/owner_profile",
      label: "프로필",
      icon: <User size={20} />,
      roles: ["shop"],
    },
    
    // 관리자용 메뉴
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

  // 표시할 아이템 수에 따라 그리드 열 수 결정
  const getGridCols = () => {
    const count = filteredNavItems.length;
    if (count <= 3) return "grid-cols-3";
    if (count <= 4) return "grid-cols-4";
    return "grid-cols-5";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t border-[#e1e7ef] z-50">
      <ul className={`grid ${getGridCols()} h-full`}>
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`flex flex-col items-center justify-center h-full ${
                  isActive 
                    ? "text-[#5DCA69]" 
                    : "text-[#64748b] hover:text-[#0f172a]"
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