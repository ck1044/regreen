"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BellOff, Store, ExternalLink, ArrowRight } from 'lucide-react';
import { useSubscriptionList } from '@/hooks/useSubscriptionList';
import { useToast } from '@/components/ui/use-toast';

export default function SubscriptionsPage() {
  const userId = "user-1"; // 실제 구현에서는 인증된 사용자 ID
  const { shopInfos, isLoading, error, unsubscribe, refreshSubscriptions } = useSubscriptionList({ userId });
  const { toast } = useToast();
  const [isUnsubscribing, setIsUnsubscribing] = useState<string | null>(null);

  // 구독 취소 처리
  const handleUnsubscribe = async (shopId: string, shopName: string) => {
    try {
      setIsUnsubscribing(shopId);
      await unsubscribe(shopId);
      
      toast({
        title: "구독 취소됨",
        description: `${shopName}의 재고 알림 구독이 취소되었습니다.`,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "오류 발생",
        description: "구독 취소 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsUnsubscribing(null);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">구독 중인 가게</h1>
        <p className="text-muted-foreground mt-1">
          새로운 재고가 등록되면 알림을 받을 수 있습니다.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="p-4 border rounded-md bg-red-50 text-red-500">
          <p>{error}</p>
          <Button onClick={refreshSubscriptions} variant="outline" className="mt-2">
            다시 시도
          </Button>
        </div>
      ) : shopInfos.length === 0 ? (
        <div className="text-center py-10">
          <Store className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">구독 중인 가게가 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            가게를 구독하면 새로운 재고 알림을 받을 수 있습니다.
          </p>
          <Link href="/shops">
            <Button>
              가게 둘러보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {shopInfos.map((shop) => (
            <Card key={shop.id}>
              <div className="flex items-start p-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md mr-4">
                  <Image
                    src={shop.image || 'https://via.placeholder.com/150'}
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{shop.name}</CardTitle>
                  <CardDescription>{shop.address}</CardDescription>
                  <div className="flex mt-2">
                    <Badge variant="outline" className="text-xs mr-2">
                      재고 알림
                    </Badge>
                  </div>
                </div>
              </div>
              <CardFooter className="flex justify-between border-t p-4 pt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleUnsubscribe(shop.id, shop.name)}
                  disabled={isUnsubscribing === shop.id}
                >
                  <BellOff className="mr-1 h-4 w-4" />
                  구독 취소
                </Button>
                <Link href={`/shops/${shop.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    가게 보기
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 