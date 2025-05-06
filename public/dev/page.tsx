"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/layout/MobileLayout'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, Plus, Loader2 } from 'lucide-react'
import { useSession } from "next-auth/react";
// API 클라이언트 제거됨: 필요한 API 타입 및 경로만 임포트
import { formatInternalApiUrl } from "@/app/api/routes"; // API 클라이언트 임포트

export default function StoresPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // StorePreview 인터페이스 정의 - API 클라이언트와 일치시킴
  interface StorePreview {
    id: number;
    name: string;
    address: string;
    imageUrl: string;
    category?: {
      id: number;
      name: string;
    };
  }
  
  const [stores, setStores] = useState<StorePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 세션 확인
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // 가게 목록 가져오기
  useEffect(() => {
    const fetchStores = async () => {
      if (status !== "authenticated") return;
      
      setIsLoading(true);
      try {
        // API 클라이언트를 사용하여 가게 목록 요청
        const data = await apiClient.store.getAll();
        setStores(data || []);
      } catch (err) {
        console.error('가게 목록 가져오기 오류:', err);
        setError('가게 정보를 불러오는 중 오류가 발생했습니다');
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [status]);

  // 로딩 중인 경우
  if (status === "loading" || isLoading) {
    return (
      <MobileLayout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
            <p>가게 정보를 불러오는 중...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 오류가 발생한 경우
  if (error) {
    return (
      <MobileLayout>
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={() => window.location.reload()}>새로고침</Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">내 가게 관리</h1>
          <Link href="/stores/register">
            <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
              <Plus className="mr-2 h-4 w-4" />
              가게 등록
            </Button>
          </Link>
        </div>

        {stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 min-h-[300px] bg-gray-50 bg-gray-800 rounded-lg">
            <Store className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-gray-400 mb-4 text-center">
              등록된 가게가 없습니다.<br />
              새로운 가게를 등록해보세요.
            </p>
            <Link href="/stores/register">
              <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                가게 등록하기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {stores.map((store) => (
              <div key={store.id} className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold">{store.name}</h2>
                <p className="text-gray-500">{store.address}</p>
                <div className="mt-4 flex justify-end">
                  <Link href={`/stores/edit/${store.id}`}>
                    <Button className="mr-2" variant="outline">
                      편집
                    </Button>
                  </Link>
                  <Link href={`/stores/manage/${store.id}`}>
                    <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                      관리
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  )
} 