"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Settings,
  Bell,
  Calendar,
  LogOut,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile/profile-form';
import PasswordForm from '@/components/profile/password-form';
import { formatInternalApiUrl, USER_ROUTES, UserProfile, UpdateProfileRequest } from "@/app/api/routes";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

// 확장된 UserProfile 인터페이스 (UI에 필요한 추가 속성 포함)
interface ExtendedUserProfile extends UserProfile {
  createdAt?: string;
}

// API 호출 함수
const fetchUserProfile = async (accessToken?: string): Promise<UserProfile | null> => {
  try {
    if (!accessToken) return null;
    
    const response = await fetch(formatInternalApiUrl(USER_ROUTES.PROFILE), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`프로필 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data as UserProfile;
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }
};

// 프로필 업데이트 함수
const updateUserProfile = async (data: UpdateProfileRequest, accessToken?: string): Promise<UserProfile | null> => {
  try {
    if (!accessToken) return null;
    
    const response = await fetch(formatInternalApiUrl(USER_ROUTES.UPDATE_PROFILE), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`프로필 업데이트 실패: ${response.status}`);
    }

    const updatedProfile = await response.json();
    return updatedProfile as UserProfile;
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return null;
  }
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<ExtendedUserProfile>({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'CUSTOMER',
    university: '',
    isAdmin: false
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 데이터 가져오기
    if (session) {
      fetchUserData();
    }
  }, [session, accessToken]);

  // API를 사용하여 사용자 데이터 가져오기
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // 사용자 프로필 요청
      const profileData = await fetchUserProfile(accessToken);
      
      if (profileData) {
        // API 응답을 확장 인터페이스에 매핑
        setUserData({
          ...profileData, // 기본 속성 복사(role, email, name, phoneNumber)
          createdAt: ''
        });
      }
    } catch (error) {
      console.error('사용자 데이터 불러오기 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  // 고객용 메뉴 아이템
  const menuItems = [
    { icon: <ShoppingBag className="h-5 w-5" />, label: '오늘의 상품', path: '/main' },
    { icon: <Calendar className="h-5 w-5" />, label: '내 예약', path: '/my-reservations' },
    { icon: <Bell className="h-5 w-5" />, label: '가게 찾기', path: '/shops' },
    { icon: <Settings className="h-5 w-5" />, label: '설정', path: '/profile/settings' }
  ];

  // 프로필 업데이트 핸들러
  const handleProfileUpdate = async (formData: { name: string; phone: string; university: string }) => {
    setIsLoading(true);
    try {
      // 프로필 업데이트 API 호출
      // ProfileForm 인터페이스와 API 인터페이스 사이의 필드명 차이(phone vs phoneNumber) 처리
      const updatedProfile = await updateUserProfile({
        name: formData.name,
        university: formData.university,
        phoneNumber: formData.phone
      }, accessToken);
      
      if (updatedProfile) {
        // UI 업데이트
        setUserData({
          ...userData,
          name: formData.name,
          phoneNumber: formData.phone,
          university: formData.university
        });
        console.log('프로필이 성공적으로 업데이트되었습니다.');
      }
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
              <CardTitle>고객 프로필</CardTitle>
              <CardDescription>개인정보를 확인하고 수정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm 
                userProfile={{
                  name: userData.name,
                  phone: userData.phoneNumber || '',
                  university: userData.university || ''
                }}
                onSubmit={handleProfileUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>계정 보안을 위해 비밀번호를 변경하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button 
        variant="outline" 
        className="w-full mt-4 text-destructive border-destructive hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        로그아웃
      </Button>
    </div>
  );
} 