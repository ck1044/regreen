"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';


interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationSettingsProps {
  userId: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSetting[]>([]);

  // 알림 설정 불러오기
  useEffect(() => {
    // 실제 구현에서는 API 호출하여 알림 설정 불러오기
    // const fetchSettings = async () => {
    //   const response = await fetch(`/api/users/${userId}/notification-settings`);
    //   const data = await response.json();
    //   setSettings(data);
    //   setIsLoading(false);
    // };
    
    // fetchSettings();

    // 임시 데이터
    setTimeout(() => {
      setSettings([
        {
          id: 'reservation_updates',
          label: '예약 알림',
          description: '예약 상태 변경 알림 (승인, 거절, 완료 등)',
          enabled: true,
        },
        {
          id: 'inventory_updates',
          label: '재고 알림',
          description: '새로운 재고 등록 및 업데이트 알림',
          enabled: true,
        },
        {
          id: 'promotion',
          label: '프로모션 알림',
          description: '할인 및 프로모션 알림',
          enabled: false,
        },
        {
          id: 'system',
          label: '시스템 알림',
          description: '시스템 공지사항 및 업데이트 알림',
          enabled: true,
        },
        {
          id: 'marketing',
          label: '마케팅 알림',
          description: '마케팅 및 이벤트 정보 알림',
          enabled: false,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [userId]);

  // 알림 설정 토글
  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));
  };

  // 알림 설정 저장
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // 실제 구현에서는 API 호출하여 알림 설정 저장
      // await fetch(`/api/users/${userId}/notification-settings`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ settings }),
      // });
      
      // 임시로 1초 지연 (API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('알림 설정 저장 완료', {
        description: '알림 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      console.error('알림 설정 저장 오류:', error);
      toast.error('알림 설정 저장 실패', {
        description: '알림 설정 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: '알림 권한 실패',
        description: '이 브라우저는 알림 기능을 지원하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast({
          title: '알림 권한 승인',
          description: '브라우저 알림을 수신할 수 있습니다.',
        });
      } else {
        toast({
          title: '알림 권한 거부',
          description: '브라우저 알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 변경해주세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('알림 권한 요청 오류:', error);
      toast({
        title: '알림 권한 오류',
        description: '알림 권한 요청 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">브라우저 알림</h3>
          <p className="text-xs text-muted-foreground">
            브라우저 알림을 받으려면 알림 권한을 허용해주세요
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={requestNotificationPermission}
          >
            알림 권한 요청
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">알림 유형</h3>
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between pb-4 border-b">
            <div className="space-y-0.5">
              <Label htmlFor={setting.id} className="text-base">
                {setting.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <Switch
              id={setting.id}
              checked={setting.enabled}
              onCheckedChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>

      <Button 
        onClick={saveSettings} 
        className="w-full" 
        disabled={isSaving}
      >
        {isSaving ? '저장 중...' : '설정 저장'}
      </Button>
    </div>
  );
} 