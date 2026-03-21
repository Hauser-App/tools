import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface AdvancedMetricsProps {
  percentageGrowth?: number;
  timeToTarget?: { years: number; months: number };
  inflationAdjustedReturn?: number;
  taxAdjustedGrowth?: number;
}

const AdvancedMetrics = ({
  percentageGrowth = 155.5,
  timeToTarget = { years: 8, months: 3 },
  inflationAdjustedReturn = 85000,
  taxAdjustedGrowth = 75000,
}: AdvancedMetricsProps) => {
  return (
    <Card
      className="w-full"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium" style={{ color: "#BBB7AF" }}>
          Advanced Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="space-y-1">
              <span style={{ color: "#BBB7AF" }} className="text-sm">
                Growth Rate
              </span>
              <p className="text-2xl font-bold" style={{ color: "#C0FF02" }}>
                {percentageGrowth}%
              </p>
            </div>
            <Separator className="bg-gray-700" />
            <div className="space-y-1">
              <span style={{ color: "#BBB7AF" }} className="text-sm">
                Time to $100k
              </span>
              <p className="text-2xl font-bold" style={{ color: "#C0FF02" }}>
                {timeToTarget.years}y {timeToTarget.months}m
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <span style={{ color: "#BBB7AF" }} className="text-sm">
                Inflation-Adjusted
              </span>
              <p className="text-2xl font-bold" style={{ color: "#C0FF02" }}>
                ${inflationAdjustedReturn.toLocaleString()}
              </p>
            </div>
            <Separator className="bg-gray-700" />
            <div className="space-y-1">
              <span style={{ color: "#BBB7AF" }} className="text-sm">
                After-Tax Value
              </span>
              <p className="text-2xl font-bold" style={{ color: "#C0FF02" }}>
                ${taxAdjustedGrowth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedMetrics;
