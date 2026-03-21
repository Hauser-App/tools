import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Percent,
  Calculator,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon = <DollarSign className="h-4 w-4" />,
  description = "No description available",
}: MetricCardProps) => {
  return (
    <Card
      className={
        `${title === "Status" ? (value === "GO" ? "bg-[#c0ff02] text-[#262626]" : "bg-[#B05670] text-white") : "bg-[#262626] text-white"}` +
        " border-none"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-[10px]">{value}</div>
        <p
          className={`text-xs ${title === "Status" ? (value === "GO" ? "text-[#262626]/70" : "text-white/70") : "text-[#BBB7AF]"}`}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

interface MetricsDisplayProps {
  cashOnCash?: number;
  multipleOfCashflow?: number;
  roi?: number;
  status?: "GO" | "NO-GO";
  className?: string;
  annualCashflow?: number;
  monthlyPrincipal?: number;
  monthlyInterest?: number;
  valuation?: number;
  financedAmount?: number;
  monthlyPayment?: number;
  loanTermYears?: number;
}

const MetricsDisplay = ({
  cashOnCash = 15.5,
  multipleOfCashflow = 2.3,
  roi = 22.4,
  status = "GO",
  className = "",
  annualCashflow = 0,
  monthlyPrincipal = 0,
  monthlyInterest = 0,
  valuation = 0,
  financedAmount = 0,
  monthlyPayment = 0,
  loanTermYears = 5,
}: MetricsDisplayProps) => {
  const downPayment = valuation - financedAmount;

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`w-full h-full bg-[#BBB7AF] p-6 ${className}`}>
      <div className="space-y-6">
        {/* Key Metrics Section */}
        <div>
          <h2 className="text-[20px] font-bold mb-4">Key Metrics</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Cash on Cash"
              value={`${cashOnCash.toFixed(2)}%`}
              icon={<DollarSign className="h-4 w-4 text-[#c0ff02]" />}
              description="Annual cash return percentage"
            />

            <MetricCard
              title="Multiple of Cashflow"
              value={multipleOfCashflow.toFixed(2)}
              icon={<ArrowUpCircle className="h-4 w-4 text-[#c0ff02]" />}
              description="Business value to cashflow ratio"
            />

            <MetricCard
              title="ROI"
              value={`${roi.toFixed(2)}%`}
              icon={<Percent className="h-4 w-4 text-[#c0ff02]" />}
              description="Return on investment percentage"
            />

            <MetricCard
              title="Status"
              value={status}
              icon={
                status === "GO" ? (
                  <ArrowUpCircle className="h-4 w-4 text-[#262626]" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4 text-white" />
                )
              }
              description={
                status === "GO"
                  ? "Investment recommended"
                  : "Investment not recommended"
              }
            />
          </div>
        </div>

        {/* Financing Details Section */}
        <div>
          <h2 className="text-[20px] font-bold mb-4">Financing Details</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              title="Valuation"
              value={`$${formatCurrency(valuation)}`}
              icon={<Calculator className="h-4 w-4 text-[#c0ff02]" />}
              description="Total business valuation"
            />

            <MetricCard
              title="Annual Cashflow"
              value={`$${formatCurrency(annualCashflow)}`}
              icon={<DollarSign className="h-4 w-4 text-[#c0ff02]" />}
              description="Annual cash flow amount"
            />

            <MetricCard
              title="Down Payment"
              value={`$${formatCurrency(downPayment)}`}
              icon={<DollarSign className="h-4 w-4 text-[#c0ff02]" />}
              description="Initial investment required"
            />

            <MetricCard
              title="Amount Financed"
              value={`$${formatCurrency(financedAmount)}`}
              icon={<DollarSign className="h-4 w-4 text-[#c0ff02]" />}
              description="Total loan amount"
            />

            <MetricCard
              title="Monthly Payment"
              value={`$${formatCurrency(monthlyPayment)}`}
              icon={<DollarSign className="h-4 w-4 text-[#c0ff02]" />}
              description="Total monthly payment"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
