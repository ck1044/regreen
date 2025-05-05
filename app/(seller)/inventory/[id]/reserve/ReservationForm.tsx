"use client";

import React, { useState } from "react";
import { Minus, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type InventoryItem = {
  id: string;
  name: string;
  image: string;
  shopName: string;
  shopId: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  quantity: number;
  description: string;
  expiresAt: string;
  pickupTime: {
    start: string;
    end: string;
  };
};

export default function ReservationForm({ item }: { item: InventoryItem }) {
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (item?.quantity || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현 시에는 API 호출 및 결제 처리
    alert(`${item?.name} ${quantity}개 예약이 완료되었습니다.`);
  };

  // 총 금액 계산
  const totalPrice = item.discountPrice * quantity;

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-[#e1e7ef] border-[#303642]">
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#0f172a] text-white mb-1">
          수량
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={decreaseQuantity}
            className="w-10 h-10 border border-[#e1e7ef] border-[#303642] rounded-l-lg flex items-center justify-center text-[#64748b] text-[#94a3b8]"
          >
            <Minus size={16} />
          </button>
          <div className="w-12 h-10 border-t border-b border-[#e1e7ef] border-[#303642] flex items-center justify-center font-medium text-[#0f172a] text-white">
            {quantity}
          </div>
          <button
            type="button"
            onClick={increaseQuantity}
            className="w-10 h-10 border border-[#e1e7ef] border-[#303642] rounded-r-lg flex items-center justify-center text-[#64748b] text-[#94a3b8]"
            disabled={quantity >= item.quantity}
          >
            <Plus size={16} />
          </button>
          <span className="ml-3 text-sm text-[#64748b] text-[#94a3b8]">
            남은 수량: {item.quantity}개
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[#0f172a] text-white mb-1">
          픽업 예정 시간
        </label>
        <Input 
          type="time"
          min={item.pickupTime.start}
          max={item.pickupTime.end}
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-xs text-[#64748b] text-[#94a3b8] mt-1 flex items-center">
          <Info size={12} className="mr-1" />
          픽업 가능 시간 내에서 선택해주세요.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#0f172a] text-white mb-1">
          요청사항 (선택)
        </label>
        <Textarea
          placeholder="픽업 시 요청사항이 있으면 적어주세요."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="border-t border-[#e1e7ef] border-[#303642] pt-4 mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748b] text-[#94a3b8]">상품 금액</span>
          <span className="text-[#0f172a] text-white">{item.originalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748b] text-[#94a3b8]">할인 금액</span>
          <span className="text-[#5DCA69]">- {(item.originalPrice - item.discountPrice).toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748b] text-[#94a3b8]">수량</span>
          <span className="text-[#0f172a] text-white">{quantity}개</span>
        </div>
        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-dashed border-[#e1e7ef] border-[#303642]">
          <span className="text-[#0f172a] text-white">총 결제 금액</span>
          <span className="text-lg text-[#5DCA69]">{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#5DCA69] hover:bg-[#4db058]">
        예약하기
      </Button>
    </form>
  );
} 