"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Settings,
  Bell,
  Store,
  Package,
  Calendar,
  Shield,
  LogOut,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProfileForm from '@/components/profile/profile-form';
import PasswordForm from '@/components/profile/password-form';
import NotificationSettings from '@/components/profile/notification-settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'owner' | 'admin' | 'USER';
  address?: string;
  profileImage?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserProfile>({
    id: 'user-1',
    name: '김그린',
    email: 'green@example.com',
    phone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123',
    role: 'owner', // 'customer', 'owner', 'admin' 중 하나
    profileImage: 'https://via.placeholder.com/150',
    createdAt: '2023-01-15'
  });

  // 실제 구현에서는 API에서 사용자 데이터를 가져옵니다
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // 실제 API 호출 대신 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      // setUserData(response.data);
    } catch (error) {
      console.error('사용자 데이터 불러오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    // 실제 구현에서는 인증 서비스 로그아웃 호출
    console.log('로그아웃');
    router.push('/auth/signin');
  };

  // 사용자 역할에 따른 추가 메뉴 항목 구성
  const getRoleBasedMenuItems = () => {
    switch (userData.role) {
      case 'owner':
        return [
          { icon: <Store className="h-5 w-5" />, label: '내 가게 관리', path: '/shops/manage' },
          { icon: <Package className="h-5 w-5" />, label: '재고 관리', path: '/inventory/manage' },
          { icon: <Calendar className="h-5 w-5" />, label: '예약 관리', path: '/reservations/manage' }
        ];
      case 'admin':
        return [
          { icon: <Shield className="h-5 w-5" />, label: '관리자 대시보드', path: '/admin/dashboard' },
          { icon: <Store className="h-5 w-5" />, label: '가게 관리', path: '/admin/shops' },
          { icon: <User className="h-5 w-5" />, label: '사용자 관리', path: '/admin/users' }
        ];
      default:
        return [
          { icon: <Calendar className="h-5 w-5" />, label: '예약 내역', path: '/reservations' },
          { icon: <Bell className="h-5 w-5" />, label: '구독 중인 가게', path: '/profile/subscriptions' }
        ];
    }
  };

  const menuItems = [
    ...getRoleBasedMenuItems(),
    { icon: <Settings className="h-5 w-5" />, label: '설정', path: '/profile/settings' }
  ];

  // 프로필 업데이트 핸들러
  const handleProfileUpdate = (updatedProfile: any) => {
    setUserData({ ...userData, ...updatedProfile });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      {/* 프로필 헤더 */}
      <div className="flex items-center mb-6">
        <Avatar className="h-24 w-24 mr-4">
          <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
          <AvatarFallback>{userData.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
          <div className="inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {userData.role === 'customer' ? '일반 사용자' : userData.role === 'owner' ? '사장님' : userData.role === 'admin' ? '관리자' : ''}
          </div>
        </div>
      </div>

      {/* 프로필 탭 */}
      <Tabs defaultValue="info" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="password">비밀번호</TabsTrigger>
          <TabsTrigger value="notifications">알림 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>개인정보를 확인하고 수정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm 
                userProfile={{
                  name: userData.name,
                  email: userData.email,
                  phone: userData.phone,
                  address: userData.address,
                  role: userData.role,
                  profileImage: userData.profileImage,
                }}
                onSubmit={handleProfileUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>계정 보안을 위해 주기적으로 비밀번호를 변경하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 수신 여부를 설정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings userId={userData.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 메뉴 항목 */}
      <Card>
        <CardHeader>
          <CardTitle>메뉴</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              onClick={() => router.push(item.path)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="mr-3 text-muted-foreground">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </CardContent>
        <CardFooter className="pt-0 pb-3">
          <Button 
            variant="outline" 
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 