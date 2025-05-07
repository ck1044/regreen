"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { OwnerInventoryCard } from '@/components/custom/owner-inventory-card';
import { formatInternalApiUrl, INVENTORY_ROUTES } from '@/app/api/routes';
import { useSession } from "next-auth/react";

// 상품 상태 타입
type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// 상품 정보 타입
interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  expiresAt?: string;
  status?: ProductStatus;
  category: string;
}

// API 응답 타입
interface InventoryItem {
  inventory: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    startTime: string;
    endTime: string;
  };
  store: {
    category: string;
  };
}

export default function InventoryPage() {
  // 세션 가져오기
  const { data: session } = useSession();
  // @ts-ignore - accessToken 속성이 타입 정의에 없어서 무시
  const accessToken = session?.user?.accessToken;
  
  // 상태 관리
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // API에서 재고 데이터 가져오기
  useEffect(() => {
    const fetchInventory = async () => {
      if (!session) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        const response = await fetch(formatInternalApiUrl(INVENTORY_ROUTES.BASE), {
          method: 'GET',
          headers,
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`재고 목록 가져오기 실패: ${response.status}`);
        }
        
        const inventoryData = await response.json() as InventoryItem[];
        
        // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
        const transformedProducts = inventoryData.map(item => ({
          id: item.inventory.id.toString(),
          name: item.inventory.name,
          image: item.inventory.imageUrl || '/placeholder-food.jpg',
          price: item.inventory.price,
          quantity: item.inventory.quantity,
          expiresAt: item.inventory.endTime ? new Date(item.inventory.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '마감 정보 없음',
          category: item.store.category
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        console.error('재고 목록 가져오기 오류:', err);
        setError('재고 정보를 불러오는 중 오류가 발생했습니다');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventory();
  }, [session, accessToken]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p>재고 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">재고 관리</h1>
          <Link href="/manage-inventory/register">
            <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
              <Plus className="mr-2 h-4 w-4" />
              제품 등록
            </Button>
          </Link>
        </div>
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 재고 목록 */}
        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-4">
                등록된 상품이 없습니다.
              </p>
              <Link href="/manage-inventory/register">
                <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                  새 제품 등록하기
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {products.map(product => (
                <OwnerInventoryCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  quantity={product.quantity}
                  expiresAt={product.expiresAt}
                  category={product.category}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 