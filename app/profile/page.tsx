"use client";

import { useState, useEffect } from 'react';
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
import apiClient from '@/lib/api'; // API 클라이언트 임포트

// API의 기본 UserProfile 인터페이스
interface UserProfile {
  role: 'CUSTOMER' | 'STORE_OWNER' | 'ADMIN';
  email: string;
  name: string;
  phoneNumber: string;
}

// 확장된 UserProfile 인터페이스 (UI에 필요한 추가 속성 포함)
interface ExtendedUserProfile extends UserProfile {
  id?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<ExtendedUserProfile>({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    role: 'CUSTOMER',
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 데이터 가져오기
    fetchUserData();
  }, []);

  // API를 사용하여 사용자 데이터 가져오기
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // API 클라이언트를 사용하여 사용자 프로필 요청
      const profileData = await apiClient.user.getProfile();
      
      // API 응답을 확장 인터페이스에 매핑
      setUserData({
        ...profileData, // 기본 속성 복사(role, email, name, phoneNumber)
        id: '', // 확장 속성은 빈 값으로 설정
        createdAt: ''
      });
    } catch (error) {
      console.error('사용자 데이터 불러오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    // API 클라이언트를 사용하여 로그아웃
    apiClient.auth.signout();
    router.push('/auth/signin');
  };

  // 사용자 역할에 따른 추가 메뉴 항목 구성
  const getRoleBasedMenuItems = () => {
    switch (userData.role) {
      case 'STORE_OWNER':
        return [
          { icon: <Store className="h-5 w-5" />, label: '내 가게 관리', path: '/stores' },
          { icon: <Package className="h-5 w-5" />, label: '재고 관리', path: '/inventory/manage' },
          { icon: <Calendar className="h-5 w-5" />, label: '예약 관리', path: '/reservations/manage' }
        ];
      default:
        return [
          { icon: <Calendar className="h-5 w-5" />, label: '예약 내역', path: '/reservations' },
          { icon: <Bell className="h-5 w-5" />, label: '가게 찾기', path: '/shops' }
        ];
    }
  };

  const menuItems = [
    ...getRoleBasedMenuItems(),
    { icon: <Settings className="h-5 w-5" />, label: '설정', path: '/profile/settings' }
  ];

  // 프로필 업데이트 핸들러
  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    setIsLoading(true);
    try {
      // API 클라이언트를 사용하여 프로필 업데이트
      // 기존 API 인터페이스와 ProfileForm 인터페이스 사이의 필드명 차이(phone vs phoneNumber) 처리
      await apiClient.user.updateProfile({
        name: updatedProfile.name,
        email: updatedProfile.email,
        phoneNumber: updatedProfile.phoneNumber
      });
      
      // UI 업데이트
      setUserData({
        ...userData,
        name: updatedProfile.name,
        email: updatedProfile.email,
        phoneNumber: updatedProfile.phoneNumber
      });

      console.log('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    } finally {
      setIsLoading(false);
    }
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
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
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
                  phone: userData.phoneNumber, // phoneNumber를 phone으로 전달
                  role: userData.role
                }}
                onSubmit={(data) => handleProfileUpdate({
                  name: data.name,
                  email: data.email,
                  phoneNumber: data.phone, // phone을 phoneNumber로 변환
                  role: userData.role
                })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>설정</CardTitle>
              <CardDescription>계정 설정을 관리하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* 메뉴 항목 */}
      <Card className="mt-6">
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