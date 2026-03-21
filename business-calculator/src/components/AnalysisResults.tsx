import React, { useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import MetricsDisplay from "./MetricsDisplay";
import AnalysisCharts from "./AnalysisCharts";

interface ProjectionData {
  label: string;
  data: number;
}

interface AnalysisResultsProps {
  businessName?: string;
  analysisDate?: string;
  status?: "GO" | "NO-GO";
  metrics?: {
    cashOnCash: number;
    multipleOfCashflow: number;
    roi: number;
    annualCashflow: number;
    monthlyPrincipal: number;
    monthlyInterest: number;
    valuation: number;
    financedAmount: number;
    monthlyPayment: number;
  };
  amortizationSchedule?: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
  cashFlowProjections?: ProjectionData[];
  roiProjections?: ProjectionData[];
  recommendations?: string[];
}

const AnalysisResults = ({
  businessName = "Sample Business",
  analysisDate = new Date().toLocaleDateString(),
  status = "GO",
  metrics = {
    cashOnCash: 15.5,
    multipleOfCashflow: 3.2,
    roi: 22.4,
    annualCashflow: 0,
    monthlyPrincipal: 0,
    monthlyInterest: 0,
    valuation: 0,
    financedAmount: 0,
    monthlyPayment: 0,
  },
  amortizationSchedule = [],
  cashFlowProjections = [],
  roiProjections = [],
  recommendations = [
    "Strong cash flow position indicates good investment potential",
    "Multiple of cashflow is within acceptable range",
    "ROI projections show promising returns",
  ],
}: AnalysisResultsProps) => {
  const { monthlyNetProfit, monthlyGrossMargin } = useMemo(() => {
    const mnp = metrics.annualCashflow / 12 - metrics.monthlyPayment;
    const mgm =
      metrics.annualCashflow > 0
        ? ((mnp * 12) / metrics.annualCashflow) * 100
        : 0;
    return { monthlyNetProfit: mnp, monthlyGrossMargin: mgm };
  }, [metrics.annualCashflow, metrics.monthlyPayment]);

  return (
    <div className="w-full min-h-[800px] bg-[#BBB7AF] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{businessName}</h1>
          <p className="text-[#606060]">Analysis Date: {analysisDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-[#262626]">
            Export Report
          </Button>
          <Button className="text-[#ddd8cf] bg-[#262626]">Save Analysis</Button>
        </div>
      </div>
      <div className="space-y-6">
        <div className="-mx-6">
          <MetricsDisplay
            cashOnCash={metrics.cashOnCash}
            multipleOfCashflow={metrics.multipleOfCashflow}
            roi={metrics.roi}
            status={status}
            annualCashflow={metrics.annualCashflow}
            monthlyPrincipal={metrics.monthlyPrincipal}
            monthlyInterest={metrics.monthlyInterest}
            valuation={metrics.valuation}
            financedAmount={metrics.financedAmount}
            monthlyPayment={metrics.monthlyPayment}
          />
        </div>

        <Card className="p-6 bg-[#262626] text-white border-none">
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1">
                  {status === "GO" ? (
                    <CheckCircle className="h-4 w-4 text-[#c0ff02]" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-[#B05670]" />
                  )}
                </div>
                <span>{recommendation}</span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <div className="mt-1">
                {monthlyNetProfit > 0 ? (
                  <CheckCircle className="h-4 w-4 text-[#c0ff02]" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-[#B05670]" />
                )}
              </div>
              <span>
                Monthly Net Profit After Financing:{" "}
                {monthlyNetProfit.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
                ({monthlyGrossMargin.toFixed(1)}% GM)
              </span>
            </li>
          </ul>
        </Card>

        <div className="-mx-6">
          <AnalysisCharts
            amortizationSchedule={amortizationSchedule}
            cashFlowData={{
              labels: cashFlowProjections.map((p) => p.label),
              datasets: [
                {
                  label: "Projected Monthly Free Cash Flow ($)",
                  data: cashFlowProjections.map((p) => p.data),
                },
              ],
            }}
            roiData={{
              labels: roiProjections.map((p) => p.label),
              datasets: [
                {
                  label: "ROI Projection (%)",
                  data: roiProjections.map((p) => p.data),
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
