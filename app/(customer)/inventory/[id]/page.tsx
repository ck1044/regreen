import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import InventoryDetailClient from "./inventory-detail-client";

interface InventoryDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  startTime: string;
  endTime: string;
  store: {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    lat: number;
    lng: number;
    storeInfo: string;
    storePickupTime: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    category: {
      id: number;
      name: string;
    };
  };
}

async function getInventoryDetail(id: string, accessToken?: string): Promise<InventoryDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiEndpoint = `${baseUrl}inventory/${id}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log("인증 실패");
        return null;
      }
      throw new Error(`재고 상세 정보 가져오기 실패: ${response.status}`);
    }
    
    const inventoryDetail = await response.json();
    return inventoryDetail;
  } catch (error) {
    console.error("재고 상세 정보 가져오기 오류:", error);
    return null;
  }
}

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // params를 await
  const resolvedParams = await params;
  const id = resolvedParams.id;
  console.log(id);
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;
  const inventoryDetail = await getInventoryDetail(id, accessToken);
  console.log(inventoryDetail);

  if (!inventoryDetail) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-500">재고 정보를 찾을 수 없습니다.</h1>
      </div>
    );
  }

  return <InventoryDetailClient inventoryDetail={inventoryDetail} />;
} 