import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type ShopCardProps = {
  id: string;
  name: string;
  image: string;
  location: string;
  category?: string;
  distance?: string;
  className?: string;
};

const ShopCard = ({
  id,
  name,
  image,
  location,
  category,
  distance,
  className,
}: ShopCardProps) => {
  return (
    <Link href={`/shops/${id}`}>
      <div className={cn(
        "bg-white rounded-lg shadow overflow-hidden h-full transition-transform hover:translate-y-[-4px]",
        className
      )}>
        <div className="relative h-32 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {category && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {category}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-[#0f172a] text-sm line-clamp-1">{name}</h3>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center text-xs text-[#64748b]">
              <MapPin size={12} className="mr-1" />
              <span className="line-clamp-1 mr-1">{location}</span>
              {distance && (
                <span className="text-[#5DCA69]">{distance}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { ShopCard }; 