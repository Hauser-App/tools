import React from "react";
import QuartileMetricCard from "./QuartileMetricCard";

interface QuartileMetricsProps {
  data?: Array<{ year: number; amount: number }>;
}

const QuartileMetrics = ({ data = [] }: QuartileMetricsProps) => {
  const calculateQuartileMetrics = (
    data: Array<{ year: number; amount: number }>,
  ) => {
    if (data.length < 2)
      return { percentages: [0, 0, 0, 0], amounts: [0, 0, 0, 0] };

    const timePoints = [
      Math.floor(data.length * 0.25),
      Math.floor(data.length * 0.5),
      Math.floor(data.length * 0.75),
      data.length - 1,
    ];

    const initialAmount = data[0].amount;
    const finalAmount = data[data.length - 1].amount;
    const totalGrowth = finalAmount - initialAmount;

    const quartileAmounts = timePoints.map((point) => data[point].amount);
    const quartileGrowths = [];
    const growthAmounts = [];

    // Calculate absolute growth in each quartile
    for (let i = 0; i < quartileAmounts.length; i++) {
      const startAmount = i === 0 ? data[0].amount : quartileAmounts[i - 1];
      const endAmount = quartileAmounts[i];
      const growth = endAmount - startAmount;

      // Calculate this growth as a percentage of total growth
      const growthPercentage = (growth / totalGrowth) * 100;
      quartileGrowths.push(Math.round(growthPercentage));
      growthAmounts.push(growth);
    }

    return { percentages: quartileGrowths, amounts: growthAmounts };
  };

  const { percentages: quartileGrowth, amounts: growthAmounts } =
    calculateQuartileMetrics(data);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 h-auto sm:h-[130px]">
      {quartileGrowth.map((growth, index) => (
        <QuartileMetricCard
          key={index}
          index={index}
          growth={growth}
          amount={growthAmounts[index]}
        />
      ))}
    </div>
  );
};

export default QuartileMetrics;
