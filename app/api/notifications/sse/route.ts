import { NextRequest, NextResponse } from 'next/server';

// 클라이언트 연결을 저장하는 Map
// userId를 키로, Response.body의 writer를 값으로 저장
const clients = new Map<string, WritableStreamDefaultWriter<Uint8Array>>();

// 알림 타입 정의
export type NotificationType = 
  | 'RESERVATION_REQUEST'
  | 'RESERVATION_APPROVED' 
  | 'RESERVATION_REJECTED'
  | 'RESERVATION_COMPLETED'
  | 'INVENTORY_UPDATED'
  | 'INVENTORY_LOW_STOCK';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
};

// SSE 헤더 설정 함수
function setSSEHeaders(response: Response): Response {
  response.headers.set('Content-Type', 'text/event-stream');
  response.headers.set('Cache-Control', 'no-cache');
  response.headers.set('Connection', 'keep-alive');
  return response;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 });
  }

  // 이미 연결된 클라이언트가 있으면 이전 연결 정리
  const existingClient = clients.get(userId);
  if (existingClient) {
    try {
      // 이전 연결 종료
      await existingClient.close();
    } catch (err) {
      console.error('이전 클라이언트 연결 종료 중 오류:', err);
    } finally {
      clients.delete(userId);
    }
  }

  // 스트림 생성
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // 클라이언트 등록
  clients.set(userId, writer);

  // 연결 확인 메시지 전송
  const connectEvent = encoder.encode(
    `data: ${JSON.stringify({ type: 'CONNECTED', message: '알림 서버에 연결되었습니다.' })}\n\n`
  );
  await writer.write(connectEvent);

  // 연결 해제 시 클라이언트 제거
  request.signal.addEventListener('abort', () => {
    clients.delete(userId);
    writer.close().catch(err => {
      console.error('Writer 종료 중 오류:', err);
    });
  });

  const response = new Response(stream.readable);
  return setSSEHeaders(response);
}

// 알림 전송 함수 (서버 내부에서 사용)
export async function sendNotification(userId: string, notification: Notification) {
  const writer = clients.get(userId);
  if (!writer) {
    return false; // 클라이언트가 연결되어 있지 않음
  }

  const encoder = new TextEncoder();
  const event = encoder.encode(`data: ${JSON.stringify(notification)}\n\n`);
  
  try {
    await writer.write(event);
    return true;
  } catch (error) {
    console.error('알림 전송 실패:', error);
    clients.delete(userId);
    return false;
  }
}

// 테스트 알림 전송용 API 경로
export async function POST(request: NextRequest) {
  const data = await request.json();
  const { userId, type, title, message, additionalData } = data;

  if (!userId || !type || !title || !message) {
    return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
  }

  const notification: Notification = {
    id: crypto.randomUUID(),
    userId,
    type: type as NotificationType,
    title,
    message,
    data: additionalData,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const success = await sendNotification(userId, notification);

  if (success) {
    return NextResponse.json({ success: true, message: '알림이 전송되었습니다.' });
  } else {
    return NextResponse.json(
      { success: false, message: '사용자가 연결되어 있지 않거나 전송에 실패했습니다.' },
      { status: 404 }
    );
  }
} 