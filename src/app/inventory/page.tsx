"use client";

import React, { useState } from 'react';
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
} from 'lucide-react';
import { InventoryCard } from '@/components/custom/inventory-card';

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

// 목업 데이터
const mockProducts: Product[] = [
  {
    id: "1",
    name: "유기농 사과 세트",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shopName: "유기농 마켓",
    shopId: "2",
    price: 3900,
    quantity: 5,
    expiresAt: "오늘 마감"
  },
  {
    id: "2",
    name: "통밀 빵",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shopName: "친환경 베이커리",
    shopId: "3",
    price: 4900,
    quantity: 2,
    expiresAt: "3시간 남음"
  },
  {
    id: "3",
    name: "유기농 채소 바구니",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shopName: "로컬 푸드 마켓",
    shopId: "5",
    price: 5900,
    quantity: 3,
    expiresAt: "내일 마감"
  }
];

export default function InventoryPage() {
  // 상태 관리
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
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