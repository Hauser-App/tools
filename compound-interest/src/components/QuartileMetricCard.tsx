import React from "react";
import { Card } from "./ui/card";

interface QuartileMetricCardProps {
  index: number;
  growth: number;
  amount: number;
}

const QuartileMetricCard = ({
  index,
  growth,
  amount,
}: QuartileMetricCardProps) => {
  return (
    <Card
      className="p-5"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <div className="space-y-2">
        <p style={{ color: "#BBB7AF", fontSize: "12px" }}>
          {index === 0
            ? "1st"
            : index === 1
              ? "2nd"
              : index === 2
                ? "3rd"
                : "4th"}{" "}
          Quartile of Growth
        </p>
        <div className="space-y-1">
          <p className="text-4xl font-bold" style={{ color: "#FFFFFF" }}>
            {growth}%
          </p>
          <p style={{ color: "#BBB7AF", fontSize: "12px", fontWeight: 500 }}>
            ${Math.abs(amount).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default QuartileMetricCard;
