"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout"
import ReservationList, { ReservationItem } from "@/components/custom/reservation-list";
import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 샘플 예약 데이터 - 실제로는 API에서 가져올 것입니다
const sampleReservations: ReservationItem[] = [
  {
    id: "1",
    inventoryId: "inv_1",
    itemName: "오늘의 도시락 세트",
    shopName: "행복한 도시락",
    quantity: 2,
    totalAmount: 12000,
    pickupDate: "2023-08-15T16:30:00Z",
    status: "PENDING",
    createdAt: "2023-08-14T09:15:00Z"
  },
  {
    id: "2",
    inventoryId: "inv_2",
    itemName: "신선한 샐러드 3종 세트",
    shopName: "그린 샐러드",
    quantity: 1,
    totalAmount: 8500,
    pickupDate: "2023-08-16T12:00:00Z",
    status: "CONFIRMED",
    createdAt: "2023-08-14T11:25:00Z"
  },
  {
    id: "3",
    inventoryId: "inv_3",
    itemName: "수제 샌드위치",
    shopName: "홈메이드 베이커리",
    quantity: 3,
    totalAmount: 15000,
    pickupDate: "2023-08-14T18:30:00Z",
    status: "COMPLETED",
    createdAt: "2023-08-13T16:45:00Z"
  },
  {
    id: "4",
    inventoryId: "inv_4",
    itemName: "과일 디저트 박스",
    shopName: "프레시 마켓",
    quantity: 1,
    totalAmount: 9000,
    pickupDate: "2023-08-13T17:00:00Z",
    status: "CANCELLED",
    createdAt: "2023-08-12T14:30:00Z"
  }
];

export default function ReservationsPage() {
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태에 따라 적절한 페이지로 리디렉션
    // 로그인한 사용자의 역할(role)에 따라 분기 처리
    // 예: 사장님이면 /owner/reservations로, 일반 사용자면 /my-reservations로 리디렉션
    
    // 임시로 모든 사용자를 /my-reservations로 리디렉션
    router.push("/my-reservations");
    
    // 실제 구현 예시:
    // const checkUserRole = async () => {
    //   try {
    //     const response = await fetch("/api/auth/me");
    //     const data = await response.json();
    //     
    //     if (data.role === "owner") {
    //       router.push("/owner/reservations");
    //     } else {
    //       router.push("/my-reservations");
    //     }
    //   } catch (error) {
    //     // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    //     router.push("/auth/signin");
    //   }
    // };
    // 
    // checkUserRole();
  }, [router]);

  return null; // 리디렉션 중에는 아무것도 렌더링하지 않음
} 