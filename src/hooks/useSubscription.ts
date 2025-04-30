import { useState, useEffect, useCallback } from 'react';

interface UseSubscriptionProps {
  userId: string;
  shopId: string;
}

export function useSubscription({ userId, shopId }: UseSubscriptionProps) {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 구독 상태 확인
  const checkSubscription = useCallback(async () => {
    if (!userId || !shopId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/notifications/subscriptions?userId=${userId}&shopId=${shopId}`);
      
      if (!response.ok) {
        throw new Error('구독 상태를 확인하는 중 오류가 발생했습니다.');
      }
      
      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('구독 상태 확인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, shopId]);

  // 구독 토글
  const toggleSubscription = async () => {
    if (!userId || !shopId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSubscribed) {
        // 구독 취소
        const response = await fetch(`/api/notifications/subscriptions?userId=${userId}&shopId=${shopId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('구독 취소 중 오류가 발생했습니다.');
        }
        
        setIsSubscribed(false);
      } else {
        // 구독 추가
        const response = await fetch('/api/notifications/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, shopId }),
        });
        
        if (!response.ok) {
          throw new Error('구독 추가 중 오류가 발생했습니다.');
        }
        
        setIsSubscribed(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('구독 토글 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 구독 상태 확인
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    isSubscribed,
    isLoading,
    error,
    toggleSubscription,
    checkSubscription
  };
} 