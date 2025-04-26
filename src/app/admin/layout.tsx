"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { 
  BarChart3, Users, Store, Bell, 
  Menu, X, LogOut, ChevronRight, 
  Calendar, Settings, Shield, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
}

const navItems: NavItem[] = [
  {
    title: "대시보드",
    href: "/admin/dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    variant: "default",
  },
  {
    title: "사용자 관리",
    href: "/admin/users",
    icon: <Users className="w-5 h-5" />,
    variant: "ghost",
  },
  {
    title: "가게 관리",
    href: "/admin/shops",
    icon: <Store className="w-5 h-5" />,
    variant: "ghost",
  },
  {
    title: "예약 관리",
    href: "/admin/reservations",
    icon: <Calendar className="w-5 h-5" />,
    variant: "ghost",
  },
  {
    title: "공지사항 관리",
    href: "/admin/notices",
    icon: <Bell className="w-5 h-5" />,
    variant: "ghost",
  },
  {
    title: "설정",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
    variant: "ghost",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // 모바일 상태 감지
  useEffect(() => {
    setIsMounted(true);
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 현재 경로에 맞는 네비게이션 항목 활성화
  const updatedNavItems = navItems.map((item) => ({
    ...item,
    variant: pathname === item.href ? 'default' as const : 'ghost' as const,
  }));

  // 클라이언트 사이드에서만 렌더링
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* 데스크톱 사이드바 */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6" />
            <span className="text-xl">관리자</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4">
          <nav className="flex flex-col gap-2 py-4">
            {updatedNavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button 
                  variant={item.variant} 
                  size="lg"
                  className={cn("w-full justify-start gap-2 px-4")}
                >
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="flex flex-col gap-2 p-4 border-t">
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full justify-start gap-2">
              <Home className="h-5 w-5" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="ghost" size="lg" className="w-full justify-start gap-2 text-destructive">
              <LogOut className="h-5 w-5" />
              로그아웃
            </Button>
          </Link>
        </div>
      </aside>

      {/* 모바일 네비게이션 */}
      <div className="md:hidden flex items-center p-4 border-b sticky top-0 bg-background z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setIsMenuOpen(false)}>
                  <Shield className="h-6 w-6" />
                  <span className="text-xl">관리자</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 px-2">
              <nav className="flex flex-col gap-1 py-2">
                {updatedNavItems.map((item, index) => (
                  <Link key={index} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant={item.variant}
                      size="lg"
                      className={cn("w-full justify-start gap-2 px-4")}
                    >
                      {item.icon}
                      {item.title}
                    </Button>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="flex flex-col gap-1 p-2 border-t">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full justify-start gap-2">
                  <Home className="h-5 w-5" />
                  홈으로 돌아가기
                </Button>
              </Link>
              <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start gap-2 text-destructive">
                  <LogOut className="h-5 w-5" />
                  로그아웃
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">
            {updatedNavItems.find(item => item.href === pathname)?.title || '관리자'}
          </h1>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
} 