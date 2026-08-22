import React from "react";
import { Card } from "@/components/ui/card";

interface MetricRowProps {
  label: string;
  value: string | number;
  description?: string;
}

export const MetricRow = ({ label, value, description }: MetricRowProps) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div>
      <p className="text-sm text-[#BBB7AF]">{label}</p>
      {description && (
        <p className="text-xs text-[#8B8680] mt-0.5">{description}</p>
      )}
    </div>
    <div className="font-display font-bold text-[26px] text-[#f3f3f3] whitespace-nowrap">
      {value}
    </div>
  </div>
);

interface HeroStatProps {
  label: string;
  value: string | number;
  description?: string;
}

export const HeroStat = ({ label, value, description }: HeroStatProps) => (
  <div className="mb-4">
    <p className="text-sm text-[#BBB7AF] mb-1">{label}</p>
    <p className="font-display font-bold text-[40px] leading-none text-[#fff]">
      {value}
    </p>
    {description && (
      <p className="text-xs text-[#8B8680] mt-1.5">{description}</p>
    )}
  </div>
);

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
  const isGo = status === "GO";

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className={`w-full h-full bg-[#BBB7AF] ${className}`}>
      <div className="grid gap-[10px] lg:gap-[20px] lg:grid-cols-2">
        {/* Financing Details Section */}
        <Card className="p-5 bg-[#262626] flex flex-col">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF] mb-4">
            Financing Details
          </h2>
          <HeroStat
            label="Valuation"
            value={`$${formatCurrency(valuation)}`}
            description="Total business valuation"
          />
          <div className="divide-y divide-[#333] border-t border-[#333] [&>*:last-child]:pb-0">
            <MetricRow
              label="Annual Cashflow"
              value={`$${formatCurrency(annualCashflow)}`}
              description="Annual cash flow amount"
            />
            <MetricRow
              label="Down Payment"
              value={`$${formatCurrency(downPayment)}`}
              description="Initial investment required"
            />
            <MetricRow
              label="Amount Financed"
              value={`$${formatCurrency(financedAmount)}`}
              description="Total loan amount"
            />
            <MetricRow
              label="Monthly Payment"
              value={`$${formatCurrency(monthlyPayment)}`}
              description="Total monthly payment"
            />
          </div>
        </Card>

        {/* Key Metrics Section */}
        <Card className="p-5 bg-[#262626] flex flex-col">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF] mb-4">
            Key Metrics
          </h2>
          <div className="flex-1 flex items-center mb-4 min-h-[44px]">
            <div
              className={`w-full h-[calc(100%-30px)] flex items-center justify-end px-6 rounded-[15px] ${
                isGo ? "bg-[#c0ff02]" : "bg-[#E47192]"
              }`}
            >
              <span className="font-sans font-bold uppercase text-[96px] tracking-tight text-[#262626]">
                {status}
              </span>
            </div>
          </div>
          <div className="divide-y divide-[#333] [&>*:last-child]:pb-0">
            <MetricRow
              label="Cash on Cash"
              value={`${cashOnCash.toFixed(2)}%`}
              description="Annual cash return percentage"
            />
            <MetricRow
              label="Multiple of Cashflow"
              value={multipleOfCashflow.toFixed(2)}
              description="Business value to cashflow ratio"
            />
            <MetricRow
              label="ROI"
              value={`${roi.toFixed(2)}%`}
              description="Return on investment percentage"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MetricsDisplay;
