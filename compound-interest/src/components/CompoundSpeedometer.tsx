import React from "react";
import { Card } from "./ui/card";

interface CompoundSpeedometerProps {
  data?: Array<{ year: number; amount: number }>;
}

const CompoundSpeedometer = ({ data = [] }: CompoundSpeedometerProps) => {
  const calculateGrowthRate = () => {
    if (data.length < 2) return { rate: 0, yearlyAmount: 0 };

    // Get the last two years to calculate current growth rate
    const lastYear = data[data.length - 1];
    const previousYear = data[data.length - 2];

    const yearlyGrowth = lastYear.amount - previousYear.amount;
    const growthRate = (yearlyGrowth / previousYear.amount) * 100;

    return {
      rate: Math.round(growthRate * 10) / 10,
      yearlyAmount: Math.round(yearlyGrowth),
    };
  };

  const { rate, yearlyAmount } = calculateGrowthRate();

  // Calculate the rotation angle (gauge goes from -90 to 90 degrees)
  const maxRate = 50; // Maximum expected growth rate
  const angle = Math.min((rate / maxRate) * 180 - 90, 90);

  return (
    <Card
      className="p-5"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-medium" style={{ color: "#BBB7AF" }}>
          Growth Speed
        </h3>
        <div className="relative w-full h-[120px] flex items-center justify-center">
          {/* Gauge background */}
          <div className="absolute w-[200px] h-[100px] overflow-hidden">
            <div
              className="w-full h-full rounded-t-full"
              style={{ backgroundColor: "#333333" }}
            />
          </div>

          {/* Gauge needle */}
          <div
            className="absolute bottom-0 w-1 h-[90px] bg-[#C0FF02] origin-bottom transform"
            style={{ transform: `rotate(${angle}deg)` }}
          />

          {/* Center point */}
          <div
            className="absolute bottom-0 w-4 h-4 rounded-full"
            style={{ backgroundColor: "#C0FF02" }}
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-4xl font-bold" style={{ color: "#C0FF02" }}>
            {rate}%
          </p>
          <p className="text-sm" style={{ color: "#BBB7AF" }}>
            Current Annual Growth
          </p>
          <p className="text-sm font-medium" style={{ color: "#BBB7AF" }}>
            +${yearlyAmount.toLocaleString()}/year
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CompoundSpeedometer;
