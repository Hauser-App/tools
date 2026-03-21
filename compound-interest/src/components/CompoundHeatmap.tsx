import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CompoundHeatmapProps {
  data?: Array<{ year: number; amount: number }>;
  principal: number;
  monthlyContribution: number;
}

const CompoundHeatmap = ({
  data = [],
  principal = 10000,
  monthlyContribution = 100,
}: CompoundHeatmapProps) => {
  const calculateGrowthIntensity = () => {
    if (data.length < 2) return [];

    const yearlyGrowth = data.map((point, index) => {
      if (index === 0) return 0;
      const previousAmount = data[index - 1].amount;
      const currentAmount = point.amount;
      const expectedAmount = previousAmount + monthlyContribution * 12;
      const compoundingEffect = currentAmount - expectedAmount;
      return compoundingEffect;
    });

    // Normalize growth intensity to 0-100 scale
    const maxGrowth = Math.max(...yearlyGrowth);
    return yearlyGrowth.map((growth) => {
      const intensity = (growth / maxGrowth) * 100;
      return {
        year: data[yearlyGrowth.indexOf(growth)].year,
        intensity,
        amount: growth,
      };
    });
  };

  const growthData = calculateGrowthIntensity();

  const getIntensityColor = (intensity: number) => {
    // Create a gradient from dark to bright lime
    const brightness = Math.round((intensity / 100) * 255);
    return `rgb(${Math.min(192, brightness)}, ${Math.min(255, brightness)}, ${Math.min(2, brightness)})`;
  };

  return (
    <Card
      className="w-full"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium" style={{ color: "#BBB7AF" }}>
          Compound Growth Intensity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end gap-1">
          {growthData.map((item, index) => (
            <div
              key={item.year}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max(4, item.intensity)}%`,
                  backgroundColor: getIntensityColor(item.intensity),
                  opacity: 0.2 + (item.intensity / 100) * 0.8,
                }}
              />
              <span className="text-xs" style={{ color: "#BBB7AF" }}>
                Y{item.year.toString().slice(-2)}
              </span>
              <span
                className="text-xs font-medium rotate-45 origin-left translate-x-4"
                style={{ color: "#BBB7AF" }}
              >
                +${Math.round(item.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompoundHeatmap;
