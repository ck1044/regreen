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
  | 'INVENTORY_LOW_STOCK'
  | 'CONNECTED';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
};

interface NotificationEvent {
  id: string;
  type: string;
  data: string;
  timestamp: number;
}

// SSE 헤더 설정 함수
function setSSEHeaders(response: Response): Response {
  response.headers.set('Content-Type', 'text/event-stream');
  response.headers.set('Cache-Control', 'no-cache');
  response.headers.set('Connection', 'keep-alive');
  return response;
}

// 알림 전송 함수 (서버 내부에서만 사용, 내보내지 않음)
async function sendNotification(userId: string, notification: Notification) {
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

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  // SSE 스트림 설정
  const stream = new ReadableStream({
    async start(controller) {
      // 클라이언트 연결 유지를 위한 주기적 메시지 전송 함수
      function sendKeepAlive() {
        const keepAliveMessage = `: keep-alive\n\n`;
        controller.enqueue(encoder.encode(keepAliveMessage));
      }
      
      // 알림 이벤트 전송 함수
      function sendEvent(event: NotificationEvent) {
        const formattedEvent = 
          `id: ${event.id}\n` +
          `event: ${event.type}\n` +
          `data: ${event.data}\n` +
          `retry: 5000\n\n`;
        
        controller.enqueue(encoder.encode(formattedEvent));
      }
      
      // 주기적 keep-alive 설정 (30초마다)
      const keepAliveInterval = setInterval(sendKeepAlive, 30000);
      
      // 알림 이벤트 예시 (실제로는 DB나 외부 이벤트 소스에서 가져와야 함)
      const exampleEvent: NotificationEvent = {
        id: '1',
        type: 'notification',
        data: JSON.stringify({ title: '새 알림', content: '알림 내용입니다.' }),
        timestamp: Date.now()
      };
      
      // 예시 알림 전송
      sendEvent(exampleEvent);
      
      // 클린업 함수
      req.signal.addEventListener('abort', () => {
        clearInterval(keepAliveInterval);
      });
    }
  });
  
  // SSE 응답 헤더 설정 및 스트림 반환
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
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