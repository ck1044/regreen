import { NextRequest, NextResponse } from 'next/server';
import { sendNotification, NotificationType } from '@/app/api/notifications/sse/route';
import { getShopSubscribers } from '@/app/api/notifications/subscriptions/route';

interface InventoryNotificationRequest {
  shopId: string;
  shopName: string;
  productId: string;
  productName: string;
  action: 'add' | 'update' | 'low_stock' | 'expired';
  price?: number;
  discountPrice?: number;
  expiryDate?: string;
  imageUrl?: string;
}

// 재고 알림 전송
export async function POST(request: NextRequest) {
  const data: InventoryNotificationRequest = await request.json();
  const { shopId, shopName, productId, productName, action } = data;

  if (!shopId || !shopName || !productId || !productName || !action) {
    return NextResponse.json(
      { error: '필수 필드가 누락되었습니다.' }, 
      { status: 400 }
    );
  }

  // 해당 가게를 구독한 사용자 목록 조회
  const subscribers = getShopSubscribers(shopId);
  
  if (subscribers.length === 0) {
    return NextResponse.json({
      success: true,
      message: '구독자가 없습니다.',
      notificationsSent: 0
    });
  }

  // 알림 타입과 메시지 설정
  let type: NotificationType;
  let title: string;
  let message: string;

  switch (action) {
    case 'add':
      type = 'INVENTORY_UPDATED';
      title = `${shopName}에 새 상품이 등록되었습니다`;
      message = `${productName}이(가) 새로 등록되었습니다.`;
      break;
    case 'update':
      type = 'INVENTORY_UPDATED';
      title = `${shopName}의 상품이 업데이트되었습니다`;
      message = `${productName}의 정보가 업데이트되었습니다.`;
      break;
    case 'low_stock':
      type = 'INVENTORY_LOW_STOCK';
      title = `${shopName}의 상품 소진 임박`;
      message = `${productName}의 재고가 얼마 남지 않았습니다. 서둘러 구매하세요!`;
      break;
    case 'expired':
      type = 'INVENTORY_UPDATED';
      title = `${shopName}의 상품 할인`;
      message = `${productName}의 유통기한이 임박하여 할인 판매합니다.`;
      break;
    default:
      type = 'INVENTORY_UPDATED';
      title = `${shopName}의 상품 알림`;
      message = `${productName}에 변경사항이 있습니다.`;
  }

  // 추가 데이터 설정
  const additionalData = {
    shopId,
    productId,
    imageUrl: data.imageUrl,
    price: data.price,
    discountPrice: data.discountPrice,
    expiryDate: data.expiryDate
  };

  // 모든 구독자에게 알림 전송
  let successCount = 0;

  for (const userId of subscribers) {
    const notificationId = crypto.randomUUID();
    
    const success = await sendNotification(userId, {
      id: notificationId,
      userId,
      type,
      title,
      message,
      data: additionalData,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    if (success) {
      successCount++;
    }
  }

  return NextResponse.json({
    success: true,
    message: '알림이 전송되었습니다.',
    totalSubscribers: subscribers.length,
    notificationsSent: successCount
  });
} 