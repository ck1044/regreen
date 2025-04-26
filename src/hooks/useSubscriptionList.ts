import { useState, useEffect, useCallback } from 'react';

interface UseSubscriptionListProps {
  userId: string;
}

export interface ShopInfo {
  id: string;
  name: string;
  image?: string;
  address?: string;
}

interface UseSubscriptionListReturn {
  subscribedShops: string[];
  shopInfos: ShopInfo[];
  isLoading: boolean;
  error: string | null;
  refreshSubscriptions: () => Promise<void>;
  unsubscribe: (shopId: string) => Promise<void>;
}

export function useSubscriptionList({ userId }: UseSubscriptionListProps): UseSubscriptionListReturn {
  const [subscribedShops, setSubscribedShops] = useState<string[]>([]);
  const [shopInfos, setShopInfos] = useState<ShopInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 구독 목록 가져오기
  const refreshSubscriptions = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/notifications/subscriptions?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('구독 목록을 가져오는 중 오류가 발생했습니다.');
      }
      
      const data = await response.json();
      setSubscribedShops(data.subscriptions || []);
      
      // 구독된 가게 ID 목록이 있으면 각 가게 정보를 불러옴
      if (data.subscriptions && data.subscriptions.length > 0) {
        await fetchShopInfos(data.subscriptions);
      } else {
        setShopInfos([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('구독 목록 조회 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 가게 정보 가져오기
  const fetchShopInfos = async (shopIds: string[]) => {
    try {
      // 실제 구현에서는 API 호출로 샵 정보를 가져옴
      // const response = await fetch(`/api/shops?ids=${shopIds.join(',')}`);
      // const data = await response.json();
      // setShopInfos(data.shops);
      
      // 임시 데이터 (목업)
      const mockShopInfos: ShopInfo[] = shopIds.map(shopId => ({
        id: shopId,
        name: `가게 ${shopId.substring(0, 5)}`,
        image: 'https://via.placeholder.com/150',
        address: '서울시 강남구'
      }));
      
      setShopInfos(mockShopInfos);
    } catch (err) {
      console.error('가게 정보 조회 오류:', err);
      setError('가게 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 구독 취소
  const unsubscribe = async (shopId: string) => {
    if (!userId || !shopId) return;
    
    try {
      const response = await fetch(`/api/notifications/subscriptions?userId=${userId}&shopId=${shopId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('구독 취소 중 오류가 발생했습니다.');
      }
      
      // 성공 시 목록에서 제거
      setSubscribedShops(prev => prev.filter(id => id !== shopId));
      setShopInfos(prev => prev.filter(shop => shop.id !== shopId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('구독 취소 오류:', err);
    }
  };

  // 컴포넌트 마운트 시 구독 목록 확인
  useEffect(() => {
    refreshSubscriptions();
  }, [refreshSubscriptions]);

  return {
    subscribedShops,
    shopInfos,
    isLoading,
    error,
    refreshSubscriptions,
    unsubscribe
  };
} 