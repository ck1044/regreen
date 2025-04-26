"use client";

import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionButtonProps {
  userId: string;
  shopId: string;
  shopName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function SubscriptionButton({
  userId,
  shopId,
  shopName,
  variant = 'outline',
  size = 'default'
}: SubscriptionButtonProps) {
  const { isSubscribed, isLoading, error, toggleSubscription } = useSubscription({
    userId,
    shopId
  });
  
  const { toast } = useToast();

  const handleToggleSubscription = async () => {
    try {
      await toggleSubscription();
      
      toast({
        title: isSubscribed ? '구독 취소됨' : '구독 완료',
        description: isSubscribed 
          ? `${shopName}의 재고 알림 구독이 취소되었습니다.` 
          : `${shopName}의 새로운 재고 정보를 알림으로 받아보실 수 있습니다.`,
        variant: isSubscribed ? 'destructive' : 'default',
      });
    } catch (err) {
      toast({
        title: '오류 발생',
        description: '구독 상태를 변경하는 중 문제가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  if (size === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size="icon"
              onClick={handleToggleSubscription}
              disabled={isLoading}
              aria-label={isSubscribed ? '구독 취소' : '구독 신청'}
            >
              {isSubscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isSubscribed ? '구독 취소하기' : '재고 알림 받기'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSubscription}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isSubscribed ? (
        <>
          <BellOff className="h-4 w-4" />
          <span>구독 취소</span>
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          <span>재고 알림 받기</span>
        </>
      )}
    </Button>
  );
} 