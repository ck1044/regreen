import { NextRequest, NextResponse } from 'next/server';

// 메모리 기반 구독 저장소 (실제 구현에서는 데이터베이스 사용)
// userId -> [shopId1, shopId2, ...]
const subscriptions = new Map<string, Set<string>>();

interface SubscriptionRequest {
  userId: string;
  shopId: string;
}

// 구독 추가
export async function POST(request: NextRequest) {
  const body: SubscriptionRequest = await request.json();
  const { userId, shopId } = body;

  if (!userId || !shopId) {
    return NextResponse.json(
      { error: '사용자 ID와 가게 ID가 필요합니다.' }, 
      { status: 400 }
    );
  }

  let userSubscriptions = subscriptions.get(userId);
  
  if (!userSubscriptions) {
    userSubscriptions = new Set<string>();
    subscriptions.set(userId, userSubscriptions);
  }

  userSubscriptions.add(shopId);

  return NextResponse.json({
    success: true,
    message: '구독이 추가되었습니다.',
    isSubscribed: true
  });
}

// 구독 삭제
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const shopId = url.searchParams.get('shopId');

  if (!userId || !shopId) {
    return NextResponse.json(
      { error: '사용자 ID와 가게 ID가 필요합니다.' }, 
      { status: 400 }
    );
  }

  const userSubscriptions = subscriptions.get(userId);
  
  if (userSubscriptions) {
    userSubscriptions.delete(shopId);
  }

  return NextResponse.json({
    success: true,
    message: '구독이 취소되었습니다.',
    isSubscribed: false
  });
}

// 특정 가게 구독 확인
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const shopId = url.searchParams.get('shopId');

  if (!userId) {
    return NextResponse.json(
      { error: '사용자 ID가 필요합니다.' }, 
      { status: 400 }
    );
  }

  const userSubscriptions = subscriptions.get(userId) || new Set<string>();
  
  // 특정 가게에 대한 구독 여부 확인
  if (shopId) {
    return NextResponse.json({
      isSubscribed: userSubscriptions.has(shopId)
    });
  }
  
  // 사용자의 모든 구독 목록 반환
  return NextResponse.json({
    subscriptions: Array.from(userSubscriptions)
  });
}

// 유틸리티 함수: 특정 가게를 구독한 사용자 ID 목록 반환
export function getShopSubscribers(shopId: string): string[] {
  const subscribers: string[] = [];
  
  subscriptions.forEach((shops, userId) => {
    if (shops.has(shopId)) {
      subscribers.push(userId);
    }
  });
  
  return subscribers;
} 