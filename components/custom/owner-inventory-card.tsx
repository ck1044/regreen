"use client";

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

interface OwnerInventoryCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  expiresAt?: string;
  category: string;
}

export function OwnerInventoryCard({
  id,
  name,
  image,
  price,
  quantity,
  expiresAt,
  category
}: OwnerInventoryCardProps) {
  // 재고 상태 판단
  const getStockStatus = () => {
    if (quantity <= 0) return 'out-of-stock';
    if (quantity < 5) return 'low-stock';
    return 'in-stock';
  };

  // 재고 상태에 따른 배지 색상과 텍스트
  const getStockBadge = () => {
    const status = getStockStatus();
    
    switch (status) {
      case 'out-of-stock':
        return <Badge variant="destructive">품절</Badge>;
      case 'low-stock':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">재고 부족</Badge>;
      case 'in-stock':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">재고 있음</Badge>;
      default:
        return null;
    }
  };

  // 카테고리 배지
  const getCategoryBadge = () => {
    return <Badge variant="secondary" className="ml-2">{category}</Badge>;
  };

  return (
    <Card className="mb-4 overflow-hidden border">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="relative h-24 w-24 min-w-24 m-3">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 96px, 96px"
            />
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex items-center mb-1">
              <h3 className="font-medium text-lg">{name}</h3>
              {getStockBadge()}
              {getCategoryBadge()}
            </div>
            
            <p className="text-lg font-bold text-[#5DCA69] mb-1">
              {formatCurrency(price)}
            </p>
            
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">재고: {quantity}개</span>
              {expiresAt && <span>마감: {expiresAt}</span>}
            </div>
          </div>
          
          <div className="flex flex-col p-3 gap-2">
            <Link href={`/manage-inventory/edit/${id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Pencil className="h-4 w-4 mr-1" />
                수정
              </Button>
            </Link>
            <Link href={`/manage-inventory/delete/${id}`}>
              <Button variant="destructive" size="sm" className="w-full">
                <Trash2 className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 