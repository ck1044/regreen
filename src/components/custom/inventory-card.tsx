import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type InventoryCardProps = {
  id: string;
  name: string;
  image: string;
  shopName: string;
  shopId: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
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
  originalPrice,
  discountPrice,
  discountRate,
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
    if (quantity <= 3) return "text-red-500 text-red-400";
    if (quantity <= 10) return "text-yellow-500 text-yellow-400";
    return "text-[#64748b] text-[#94a3b8]";
  };

  return (
    <Link href={`/inventory/${id}`}>
      <div className={cn(
        "flex bg-white bg-[#1e293b] rounded-lg shadow overflow-hidden transition-all hover:shadow-md",
        className
      )}>
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="p-3 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0f172a] text-white text-sm line-clamp-1">{name}</h3>
            <Badge variant="outline" className="bg-[#5DCA69]/10 text-[#5DCA69] border-[#5DCA69]/20 ml-1">
              {discountRate}% 할인
            </Badge>
          </div>
          
          <Link href={`/shops/${shopId}`} className="inline-block mt-1">
            <div className="flex items-center text-xs text-[#64748b] text-[#94a3b8]">
              <Store size={12} className="mr-1" />
              <span className="line-clamp-1">{shopName}</span>
            </div>
          </Link>
          
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-sm text-[#0f172a] text-white font-medium">
                <span className="line-through text-[#64748b] text-[#94a3b8] mr-1 text-xs">
                  {formatPrice(originalPrice)}
                </span>
                {formatPrice(discountPrice)}
              </p>
            </div>
            <span className={cn("text-xs", getQuantityColor())}>
              남은수량: {quantity}개
            </span>
          </div>
          
          {expiresAt && (
            <div className="flex items-center mt-1 text-xs text-[#64748b] text-[#94a3b8]">
              <Clock size={12} className="mr-1" />
              <span>{expiresAt}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export { InventoryCard }; 