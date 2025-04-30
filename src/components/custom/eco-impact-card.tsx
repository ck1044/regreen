import React from "react";
import { Leaf, BarChart2, Droplets, PieChart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EcoMetricType = "food_waste" | "water_saved" | "co2_reduced" | "trees_saved";

type EcoMetric = {
  type: EcoMetricType;
  value: number;
  unit: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
};

type EcoImpactCardProps = {
  title: string;
  description?: string;
  metrics: EcoMetric[];
  timeFrame?: string;
  className?: string;
};

const EcoImpactCard = ({
  title,
  description,
  metrics,
  timeFrame,
  className,
}: EcoImpactCardProps) => {
  // 환경 지표 유형에 따른 아이콘 설정
  const getMetricIcon = (type: EcoMetricType) => {
    switch (type) {
      case "food_waste":
        return <PieChart className="h-4 w-4 text-orange-500" />;
      case "water_saved":
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case "co2_reduced":
        return <BarChart2 className="h-4 w-4 text-gray-500" />;
      case "trees_saved":
        return <Leaf className="h-4 w-4 text-green-500" />;
      default:
        return <Leaf className="h-4 w-4 text-[#5DCA69]" />;
    }
  };

  return (
    <Card className={cn("border border-[#e1e7ef] border-[#303642]", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Leaf className="mr-2 h-5 w-5 text-[#5DCA69]" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-[#64748b] text-[#94a3b8]">
            {description}
          </CardDescription>
        )}
        {timeFrame && (
          <div className="text-xs text-[#64748b] text-[#94a3b8] mt-1">
            {timeFrame}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-[#f8fafc] bg-[#1e293b] p-3 rounded-lg">
              <div className="flex items-center text-sm text-[#64748b] text-[#94a3b8] mb-1">
                {getMetricIcon(metric.type)}
                <span className="ml-2">{getMetricLabel(metric.type)}</span>
              </div>
              
              <div className="flex items-end">
                <div className="text-xl font-bold text-[#0f172a] text-white">
                  {metric.value}
                  <span className="text-sm font-medium ml-1">{metric.unit}</span>
                </div>
                
                {metric.change && (
                  <div className={cn(
                    "flex items-center text-xs ml-2 mb-1",
                    metric.change.isPositive 
                      ? "text-[#5DCA69]" 
                      : "text-red-500"
                  )}>
                    <TrendingUp className={cn(
                      "h-3 w-3 mr-1",
                      !metric.change.isPositive && "rotate-180"
                    )} />
                    {metric.change.value}%
                  </div>
                )}
              </div>
              
              {metric.description && (
                <p className="text-xs text-[#64748b] text-[#94a3b8] mt-1">
                  {metric.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 환경 지표 유형에 따른 레이블 설정
const getMetricLabel = (type: EcoMetricType): string => {
  switch (type) {
    case "food_waste":
      return "절감된 음식물";
    case "water_saved":
      return "절약된 물";
    case "co2_reduced":
      return "감소된 이산화탄소";
    case "trees_saved":
      return "보존된 나무";
    default:
      return "환경 지표";
  }
};

export { EcoImpactCard, type EcoMetric, type EcoMetricType }; 