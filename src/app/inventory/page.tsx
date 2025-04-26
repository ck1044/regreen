"use client";

import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  MoreVertical,
  Edit,
  Trash2,
  ArrowDownAZ,
  Calendar,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';

// 상품 상태 타입
type ProductStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// 상품 정보 타입
interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice?: number;
  quantity: number;
  status: ProductStatus;
  expiryDate?: string;
  createdAt: string;
}

// 목업 데이터
const mockProducts: Product[] = [
  {
    id: '1',
    name: '유기농 당근',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    originalPrice: 5000,
    discountedPrice: 3500,
    quantity: 25,
    status: 'in-stock',
    expiryDate: '2023-12-30',
    createdAt: '2023-12-15T09:00:00Z',
  },
  {
    id: '2',
    name: '신선한 사과',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
    originalPrice: 8000,
    discountedPrice: 6000,
    quantity: 15,
    status: 'in-stock',
    expiryDate: '2023-12-25',
    createdAt: '2023-12-14T10:30:00Z',
  },
  {
    id: '3',
    name: '제철 토마토',
    image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0',
    originalPrice: 6000,
    quantity: 5,
    status: 'low-stock',
    expiryDate: '2023-12-20',
    createdAt: '2023-12-13T14:20:00Z',
  },
  {
    id: '4',
    name: '유기농 바나나',
    image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
    originalPrice: 4500,
    discountedPrice: 2500,
    quantity: 0,
    status: 'out-of-stock',
    expiryDate: '2023-12-18',
    createdAt: '2023-12-12T16:45:00Z',
  },
  {
    id: '5',
    name: '국내산 방울토마토',
    image: 'https://images.unsplash.com/photo-1592924357229-e699d9001039',
    originalPrice: 5500,
    quantity: 18,
    status: 'in-stock',
    expiryDate: '2023-12-28',
    createdAt: '2023-12-11T11:15:00Z',
  },
];

// 상태에 따른 배지 색상과 텍스트
const statusBadgeConfig = {
  'in-stock': { color: 'bg-green-100 text-green-800', text: '판매 중' },
  'low-stock': { color: 'bg-yellow-100 text-yellow-800', text: '품절 임박' },
  'out-of-stock': { color: 'bg-red-100 text-red-800', text: '품절' },
};

// 형식화된 가격
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

// 날짜 형식화
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function InventoryPage() {
  // 상태 관리
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('latest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // 상품 검색 처리
  const filteredProducts = products.filter(product => {
    // 검색어 필터링
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 상태 필터링
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // 정렬 처리
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.originalPrice - b.originalPrice;
      case 'price-desc':
        return b.originalPrice - a.originalPrice;
      case 'expiry-asc':
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      case 'expiry-desc':
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
      default:
        return 0;
    }
  });
  
  // 상품 상태 변경 처리
  const handleStatusChange = (productId: string, newStatus: ProductStatus) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus } 
          : product
      )
    );
  };
  
  // 상품 삭제 처리
  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };
  
  // 상품 삭제 확인
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productToDelete)
      );
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <MobileLayout>
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
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="in-stock">판매 중</SelectItem>
                <SelectItem value="low-stock">품절 임박</SelectItem>
                <SelectItem value="out-of-stock">품절</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">
                  <div className="flex items-center">
                    최신순
                  </div>
                </SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="name-asc">이름 (가나다순)</SelectItem>
                <SelectItem value="name-desc">이름 (역순)</SelectItem>
                <SelectItem value="price-asc">가격 (낮은순)</SelectItem>
                <SelectItem value="price-desc">가격 (높은순)</SelectItem>
                <SelectItem value="expiry-asc">유통기한 (빠른순)</SelectItem>
                <SelectItem value="expiry-desc">유통기한 (늦은순)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 재고 목록 */}
        <div className="space-y-4">
          {sortedProducts.length === 0 ? (
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
            sortedProducts.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{product.name}</h3>
                          <div className="mt-1 flex items-center">
                            <Badge className={`${statusBadgeConfig[product.status].color} mr-2`}>
                              {statusBadgeConfig[product.status].text}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              재고: {product.quantity}개
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/inventory/edit/${product.id}`}>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                수정
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'in-stock')}>
                              판매 중으로 변경
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'low-stock')}>
                              품절 임박으로 변경
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'out-of-stock')}>
                              품절로 변경
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 text-gray-500 mr-1" />
                          {product.discountedPrice ? (
                            <div className="flex items-center">
                              <span className="text-sm line-through text-gray-500 mr-1">
                                {formatPrice(product.originalPrice)}
                              </span>
                              <span className="text-sm font-semibold text-red-600">
                                {formatPrice(product.discountedPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        {product.expiryDate && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            유통기한: {formatDate(product.expiryDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
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
    </MobileLayout>
  );
} 