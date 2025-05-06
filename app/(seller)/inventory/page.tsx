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
import { InventoryCard } from '@/components/custom/inventory-card';
import { formatInternalApiUrl, INVENTORY_ROUTES } from '@/app/api/routes';

// 상품 상태 타입
type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// 상품 정보 타입
interface Product {
  id: string;
  name: string;
  image: string;
  shopName: string;
  shopId: string;
  price: number;
  quantity: number;
  expiresAt?: string;
  status?: ProductStatus;
}

// API 응답 타입
interface InventoryItem {
  id: number;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  endTime?: string;
}

export default function InventoryPage() {
  // 상태 관리
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // API에서 재고 데이터 가져오기
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 직접 API 호출로 재고 목록 요청
        const response = await fetch(formatInternalApiUrl(INVENTORY_ROUTES.BASE), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`재고 목록 가져오기 실패: ${response.status}`);
        }
        
        const inventoryData = await response.json() as InventoryItem[];
        
        // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
        const transformedProducts = inventoryData.map(item => ({
          id: item.id.toString(),
          name: item.name,
          image: item.imageUrl || '/placeholder-food.jpg',
          shopName: '내 가게', // API에서 이 정보를 제공하지 않는 경우 기본값 사용
          shopId: '1', // API에서 이 정보를 제공하지 않는 경우 기본값 사용
          price: item.price,
          quantity: item.quantity,
          expiresAt: item.endTime ? new Date(item.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '마감 정보 없음'
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
  }, []);
  
  // 상품 검색 처리
  const filteredProducts = products.filter(product => {
    // 검색어 필터링
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 상태 필터링
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // 상품 삭제 처리
  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };
  
  // 상품 삭제 확인
  const confirmDelete = () => {
    if (productToDelete) {
      // 실제 삭제 구현 필요
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

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
          <Link href="/inventory/register">
            <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
              <Plus className="mr-2 h-4 w-4" />
              제품 등록
            </Button>
          </Link>
        </div>
        
        {/* 검색 및 필터링 */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="상품명 검색" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="in-stock">판매 중</SelectItem>
                <SelectItem value="low-stock">품절 임박</SelectItem>
                <SelectItem value="out-of-stock">품절</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* 재고 목록 */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-4">
                검색 결과가 없습니다.
              </p>
              <Link href="/inventory/register">
                <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                  새 제품 등록하기
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {filteredProducts.map(product => (
                <InventoryCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  shopName={product.shopName}
                  shopId={product.shopId}
                  price={product.price}
                  quantity={product.quantity}
                  expiresAt={product.expiresAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제품 삭제</DialogTitle>
            <DialogDescription>
              이 제품을 정말 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 