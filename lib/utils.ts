import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 형식화
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// 픽업시간 형식화 (ISO 날짜 문자열에서 시간과 분만 추출)
export const formatPickupTime = (pickupTime: string) => {
  try {
    const date = new Date(pickupTime);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (error) {
    console.error('픽업 시간 형식화 오류:', error);
    return pickupTime; // 변환 실패 시 원본 반환
  }
};

// 날짜와 시간 분리 (ISO 문자열에서 날짜와 시간 분리)
export const separateDateAndTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  } catch (error) {
    console.error('날짜와 시간 분리 오류:', error);
    return { date: '', time: '' };
  }
};

// 가격 형식화
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

// 시간 문자열(HH:MM)을 ISO 문자열로 변환
export const convertTimeToISO = (time: string) => {
  const [hours, minutes] = time.split(':');
  const now = new Date();
  now.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return now.toISOString();
};
