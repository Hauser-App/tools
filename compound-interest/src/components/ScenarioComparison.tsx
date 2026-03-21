import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ScenarioComparisonProps {
  scenarios?: Array<{
    name: string;
    conservative: number;
    moderate: number;
    aggressive: number;
  }>;
}

const defaultScenarios = [
  {
    name: "5 Years",
    conservative: 15000,
    moderate: 18000,
    aggressive: 22000,
  },
  {
    name: "10 Years",
    conservative: 35000,
    moderate: 45000,
    aggressive: 60000,
  },
  {
    name: "15 Years",
    conservative: 70000,
    moderate: 95000,
    aggressive: 135000,
  },
];

const ScenarioComparison = ({
  scenarios = defaultScenarios,
}: ScenarioComparisonProps) => {
  return (
    <Card
      className="w-full h-[400px]"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium" style={{ color: "#BBB7AF" }}>
          Investment Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={scenarios}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="name" stroke="#BBB7AF" />
            <YAxis
              stroke="#BBB7AF"
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Bar dataKey="conservative" fill="#94A3B8" />
            <Bar dataKey="moderate" fill="#C0FF02" />
            <Bar dataKey="aggressive" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ScenarioComparison;
