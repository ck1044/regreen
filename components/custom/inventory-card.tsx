import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Store, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

type InventoryCardProps = {
  id: string;
  name: string;
  image: string;
  shopName: string;
  shopId: string;
  category: string;
  price: number;
  quantity: number;
  expiresAt?: string;
  className?: string;
};

const InventoryCard = ({
  id,
  name,
  image,
  shopName,
  shopId,
  category,
  price,
  quantity,
  expiresAt,
  className,
}: InventoryCardProps) => {
  // 가격 포맷 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 재고 수량 상태에 따른 색상 설정
  const getQuantityColor = () => {
    if (quantity <= 3) return "text-red-500";
    if (quantity <= 10) return "text-yellow-500";
    return "text-[#64748b]";
  };

  // 카테고리에 따른 배경색 설정
  const getCategoryColor = () => {
    switch (category) {
      case 'Bakery': return "bg-amber-100 text-amber-800";
      case 'Salad': return "bg-green-100 text-green-800";
      case 'Lunchbox': return "bg-blue-100 text-blue-800";
      case 'Fruit': return "bg-rose-100 text-rose-800";
      case 'Dessert': return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/inventory/${id}`}>
      <div className={cn(
        "flex m-4 bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md hover:translate-y-[-4px]",
        className
      )}>
        <div className="relative w-24 h-30 flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="p-3 flex-1">
          <h3 className="font-medium text-[#0f172a] text-sm line-clamp-1 mb-1">{name}</h3>
          <div className="flex items-center text-xs text-[#64748b] mb-1">
            <Store size={12} className="mr-1" />
            <Link href={`/shops/${shopId}`} className="hover:underline">
              <span className="line-clamp-1">{shopName}</span>
            </Link>
            <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium", getCategoryColor())}>
              {category}
            </span>
          </div>
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-sm text-[#0f172a] font-medium">
                {formatPrice(price)}
              </p>
            </div>
            <span className={cn("text-xs", getQuantityColor())}>
              남은수량: {quantity}개
            </span>
          </div>
          
          {expiresAt && (
            <div className="flex items-center mt-1 text-xs text-[#64748b]">
              <Clock size={12} className="mr-1" />
              <span>{expiresAt}까지</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export { InventoryCard }; 