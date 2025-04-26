import MobileLayout from "@/components/layout/MobileLayout"
import ReservationList, { ReservationItem } from "@/components/custom/reservation-list";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export default async function ReservationsPage() {
  // 세션 확인
  const session = await getServerSession(authOptions);
  
  // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  if (!session) {
    redirect('/auth/signin');
  }
  
  // 실제 구현에서는 여기서 API를 호출하여 사용자의 예약 목록을 가져옵니다
  // const reservations = await fetch(`/api/reservations?userId=${session.user.id}`).then(res => res.json());
  
  // 지금은 샘플 데이터를 사용합니다
  const reservations = sampleReservations;
  
  const handleViewDetail = (id: string) => {
    // 예약 상세 페이지로 이동하는 로직 (클라이언트 컴포넌트에서 처리해야 함)
    console.log(`View detail for reservation ${id}`);
  };
  
  const handleCancel = (id: string) => {
    // 예약 취소 로직 (클라이언트 컴포넌트에서 처리해야 함)
    console.log(`Cancel reservation ${id}`);
  };

  return (
    <MobileLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">내 예약 목록</h1>
        <ReservationList
          reservations={reservations}
          onViewDetail={handleViewDetail}
          onCancel={handleCancel}
        />
      </div>
    </MobileLayout>
  );
} 