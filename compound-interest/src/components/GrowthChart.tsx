import React from "react";
import { Card } from "./ui/card";
import {
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

interface DataPoint {
  year: number;
  minAmount: number;
  maxAmount: number;
}

interface GrowthChartProps {
  data?: DataPoint[];
  withdrawalRate?: number;
  withdrawalStartYear?: number;
  showWithdrawals?: boolean;
}

const currentYear = new Date().getFullYear();

const defaultData: DataPoint[] = [
  { year: currentYear, minAmount: 10000, maxAmount: 10000 },
  { year: currentYear + 1, minAmount: 11000, maxAmount: 12000 },
  { year: currentYear + 2, minAmount: 12100, maxAmount: 14400 },
  { year: currentYear + 3, minAmount: 13310, maxAmount: 17280 },
  { year: currentYear + 4, minAmount: 14641, maxAmount: 20736 },
];

const GrowthChart = ({
  data = defaultData,
  withdrawalRate = 0,
  withdrawalStartYear = 0,
  showWithdrawals = true,
}: GrowthChartProps) => {
  const formatYAxisValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  // Calculate data with withdrawals
  const calculateWithdrawals = () => {
    const result = [];
    let currentMinWithdrawalAmount = data[0].minAmount;
    let currentMaxWithdrawalAmount = data[0].maxAmount;

    for (let i = 0; i < data.length; i++) {
      const point = data[i];

      if (i < withdrawalStartYear) {
        result.push({
          ...point,
          minWithWithdrawals: point.minAmount,
          maxWithWithdrawals: point.maxAmount,
        });
        currentMinWithdrawalAmount = point.minAmount;
        currentMaxWithdrawalAmount = point.maxAmount;
        continue;
      }

      // For all years including and after withdrawal start
      const minYearlyGrowthRate =
        i > 0 ? point.minAmount / data[i - 1].minAmount - 1 : 0;
      const maxYearlyGrowthRate =
        i > 0 ? point.maxAmount / data[i - 1].maxAmount - 1 : 0;
      const minMonthlyGrowthRate =
        Math.pow(1 + minYearlyGrowthRate, 1 / 12) - 1;
      const maxMonthlyGrowthRate =
        Math.pow(1 + maxYearlyGrowthRate, 1 / 12) - 1;

      // Calculate initial withdrawal based on starting balance for the year
      const minInitialYearlyWithdrawal =
        currentMinWithdrawalAmount * (withdrawalRate / 100);
      const maxInitialYearlyWithdrawal =
        currentMaxWithdrawalAmount * (withdrawalRate / 100);
      const minInitialMonthlyWithdrawal = minInitialYearlyWithdrawal / 12;
      const maxInitialMonthlyWithdrawal = maxInitialYearlyWithdrawal / 12;
      let minMonthlyWithdrawal = minInitialMonthlyWithdrawal;
      let maxMonthlyWithdrawal = maxInitialMonthlyWithdrawal;

      // Track total withdrawals for this year
      let minTotalWithdrawn = 0;
      let maxTotalWithdrawn = 0;

      // Calculate 12 months of growth and withdrawals
      for (let month = 0; month < 12; month++) {
        // First grow the amount
        currentMinWithdrawalAmount *= 1 + minMonthlyGrowthRate;
        currentMaxWithdrawalAmount *= 1 + maxMonthlyGrowthRate;

        // Adjust monthly withdrawal if we've withdrawn too much
        if (
          minTotalWithdrawn + minMonthlyWithdrawal >
          minInitialYearlyWithdrawal
        ) {
          minMonthlyWithdrawal = Math.max(
            0,
            minInitialYearlyWithdrawal - minTotalWithdrawn,
          );
        }
        if (
          maxTotalWithdrawn + maxMonthlyWithdrawal >
          maxInitialYearlyWithdrawal
        ) {
          maxMonthlyWithdrawal = Math.max(
            0,
            maxInitialYearlyWithdrawal - maxTotalWithdrawn,
          );
        }

        // Then withdraw (if there's enough balance)
        if (currentMinWithdrawalAmount > minMonthlyWithdrawal) {
          currentMinWithdrawalAmount -= minMonthlyWithdrawal;
          minTotalWithdrawn += minMonthlyWithdrawal;
        } else {
          minTotalWithdrawn += currentMinWithdrawalAmount;
          currentMinWithdrawalAmount = 0;
        }

        if (currentMaxWithdrawalAmount > maxMonthlyWithdrawal) {
          currentMaxWithdrawalAmount -= maxMonthlyWithdrawal;
          maxTotalWithdrawn += maxMonthlyWithdrawal;
        } else {
          maxTotalWithdrawn += currentMaxWithdrawalAmount;
          currentMaxWithdrawalAmount = 0;
        }
      }

      result.push({
        ...point,
        minWithWithdrawals: Math.max(0, currentMinWithdrawalAmount),
        maxWithWithdrawals: Math.max(0, currentMaxWithdrawalAmount),
      });
    }

    return result;
  };

  const dataWithWithdrawals = calculateWithdrawals();

  // Calculate x-axis ticks
  const calculateXAxisTicks = () => {
    if (data.length <= 1) return [];
    const startYear = data[0].year;
    const endYear = data[data.length - 1].year;
    const yearSpan = endYear - startYear;

    // Show 6 evenly spaced years including start and end
    const interval = Math.ceil(yearSpan / 5);
    const ticks = [];
    for (let year = startYear; year <= endYear; year += interval) {
      ticks.push(year);
    }
    if (ticks[ticks.length - 1] !== endYear) {
      ticks.push(endYear);
    }
    return ticks;
  };

  return (
    <Card
      className="p-3 sm:p-4 md:p-5 w-full h-[400px] sm:h-[450px] md:h-[520px]"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <h3
        className="text-lg sm:text-xl font-medium mb-2 sm:mb-4"
        style={{ color: "#BBB7AF" }}
      >
        Investment Growth Over Time
      </h3>
      <div className="h-[320px] sm:h-[380px] md:h-[440px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={dataWithWithdrawals}
            margin={{ top: 10, right: 25, left: 15, bottom: 30 }}
          >
            <XAxis
              dataKey="year"
              tickFormatter={(value) => value.toString()}
              stroke="#BBB7AF"
              style={{ fontSize: 14, fontWeight: 300 }}
              dy={8}
              ticks={calculateXAxisTicks()}
              axisLine={{ stroke: "#333333" }}
              tickLine={{ stroke: "#333333" }}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              tickFormatter={formatYAxisValue}
              stroke="#BBB7AF"
              style={{ fontSize: 14, fontWeight: 300 }}
              dx={-4}
              axisLine={{ stroke: "#333333" }}
              tickLine={{ stroke: "#333333" }}
              width={80}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value),
                name === "minAmount"
                  ? "Min Return"
                  : name === "maxAmount"
                    ? "Max Return"
                    : name === "minWithWithdrawals"
                      ? "Min With Withdrawals"
                      : "Max With Withdrawals",
              ]}
              contentStyle={{
                backgroundColor: "#333333",
                border: "none",
                borderRadius: "8px",
                color: "#BBB7AF",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="minAmount"
              name="minAmount"
              stroke="#C0FF02"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="maxAmount"
              name="maxAmount"
              stroke="#C0FF02"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            {withdrawalRate > 0 && showWithdrawals && (
              <>
                <Line
                  type="monotone"
                  dataKey="minWithWithdrawals"
                  name="minWithWithdrawals"
                  stroke="#BBB7AF"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="maxWithWithdrawals"
                  name="maxWithWithdrawals"
                  stroke="#BBB7AF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GrowthChart;
