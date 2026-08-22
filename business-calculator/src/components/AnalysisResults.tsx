import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, AlertCircle, Printer, Save } from "lucide-react";
import MetricsDisplay, { MetricRow, HeroStat } from "./MetricsDisplay";
import AnalysisCharts from "./AnalysisCharts";

interface DealInputs {
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  growthRate: number;
  cashflowMultiple: number;
}

const NO_FLAGS_MESSAGE = "No major red flags in the current inputs.";

interface SparklineSeries {
  data: number[];
  color: string;
  fill?: boolean;
}

const TrendSparkline = ({
  series,
  height = 56,
}: {
  series: SparklineSeries[];
  height?: number;
}) => {
  const width = 100;
  const totalPoints = Math.max(...series.map((s) => s.data.length));
  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const toPoints = (data: number[]) =>
    data
      .map((value, i) => {
        const x = (i / (totalPoints - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient id="considerationsSparklineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0ff02" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c0ff02" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sparklineReveal">
          <rect x="0" y="0" width="0" height={height}>
            <animate
              attributeName="width"
              from="0"
              to={width}
              dur="1.1s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.22 1 0.36 1"
            />
          </rect>
        </clipPath>
      </defs>
      <g clipPath="url(#sparklineReveal)">
        {series.map((s, i) => {
          const linePoints = toPoints(s.data);
          return (
            <g key={i}>
              {s.fill && (
                <polygon
                  points={`0,${height} ${linePoints} ${width},${height}`}
                  fill="url(#considerationsSparklineFill)"
                />
              )}
              <polyline
                points={linePoints}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

function buildConsiderations(
  inputs: DealInputs,
  metrics: {
    cashOnCash: number | null;
    roi: number;
    debtAdjustedRoi: number;
    dscr: number | null;
  },
): string[] {
  const notes: string[] = [];

  if (metrics.cashOnCash !== null && Math.abs(metrics.cashOnCash - 40) <= 10) {
    notes.push(
      "Cash-on-cash return is within 10 points of the 40% GO/NO-GO threshold — sensitive to small changes in terms.",
    );
  }
  if (metrics.dscr !== null && metrics.dscr < 1.25) {
    notes.push(
      `DSCR of ${metrics.dscr.toFixed(2)}x is below the 1.25x lenders typically require.`,
    );
  }
  if (inputs.downPaymentPercent < 15) {
    notes.push(
      "Down payment is under 15% of the purchase price — a thinner equity cushion raises risk if cashflow dips.",
    );
  }
  if (inputs.interestRate > 10) {
    notes.push(
      "Interest rate is above 10% — financing costs are meaningfully eroding returns.",
    );
  }
  if (inputs.loanTerm <= 3) {
    notes.push(
      `A ${inputs.loanTerm}-year loan term concentrates debt service into higher monthly payments.`,
    );
  }
  if (inputs.growthRate > 15) {
    notes.push(
      `Projections assume ${inputs.growthRate}% annual growth — confirm this is realistic for the business.`,
    );
  }
  if (inputs.cashflowMultiple > 4) {
    notes.push(
      `A ${inputs.cashflowMultiple}x cashflow multiple is on the high end for small business acquisitions.`,
    );
  }
  if (metrics.roi > 0 && metrics.debtAdjustedRoi < metrics.roi * 0.85) {
    notes.push(
      "Financing costs reduce ROI by more than 15% relative to an all-cash purchase.",
    );
  }

  return notes.length > 0 ? notes : [NO_FLAGS_MESSAGE];
}

interface AnalysisResultsProps {
  businessName?: string;
  analysisDate?: string;
  status?: "GO" | "NO-GO";
  metrics?: {
    cashOnCash: number | null;
    multipleOfCashflow: number;
    roi: number;
    debtAdjustedRoi: number;
    dscr: number | null;
    annualCashflow: number;
    monthlyPrincipal: number;
    monthlyInterest: number;
    averageAnnualInterest: number;
    valuation: number;
    financedAmount: number;
    monthlyPayment: number;
    totalCostOfAcquisition: number;
  };
  dealInputs?: DealInputs;
  amortizationSchedule?: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
  onSave?: () => void;
  onExport?: () => void;
}

const AnalysisResults = ({
  businessName = "Sample Business",
  analysisDate = new Date().toLocaleDateString(),
  status = "GO",
  metrics = {
    cashOnCash: 15.5,
    multipleOfCashflow: 3.2,
    roi: 22.4,
    debtAdjustedRoi: 20.4,
    dscr: 1.5,
    annualCashflow: 0,
    monthlyPrincipal: 0,
    monthlyInterest: 0,
    averageAnnualInterest: 0,
    valuation: 0,
    financedAmount: 0,
    monthlyPayment: 0,
    totalCostOfAcquisition: 0,
  },
  dealInputs = {
    downPaymentPercent: 20,
    interestRate: 8,
    loanTerm: 5,
    growthRate: 5,
    cashflowMultiple: 2.3,
  },
  amortizationSchedule = [],
  onSave,
  onExport,
}: AnalysisResultsProps) => {
  const [outlookYear, setOutlookYear] = useState(5);

  const profitabilityRef = useRef<HTMLDivElement>(null);
  const [profitabilityHeight, setProfitabilityHeight] = useState<number>();

  useEffect(() => {
    const el = profitabilityRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setProfitabilityHeight(entry.target.getBoundingClientRect().height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { monthlyNetProfit, monthlyGrossMargin } = useMemo(() => {
    const mnp = metrics.annualCashflow / 12 - metrics.monthlyPayment;
    const mgm =
      metrics.annualCashflow > 0
        ? ((mnp * 12) / metrics.annualCashflow) * 100
        : 0;
    return { monthlyNetProfit: mnp, monthlyGrossMargin: mgm };
  }, [metrics.annualCashflow, metrics.monthlyPayment]);

  const paybackYears = useMemo(() => {
    const downPayment = metrics.valuation - metrics.financedAmount;
    if (monthlyNetProfit <= 0) return null;
    return downPayment / (monthlyNetProfit * 12);
  }, [metrics.valuation, metrics.financedAmount, monthlyNetProfit]);

  const outlookCashflow = useMemo(
    () =>
      metrics.annualCashflow * Math.pow(1 + dealInputs.growthRate / 100, outlookYear),
    [metrics.annualCashflow, dealInputs.growthRate, outlookYear],
  );

  const cashflowTrend = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) =>
        metrics.annualCashflow * Math.pow(1 + dealInputs.growthRate / 100, i + 1),
      ),
    [metrics.annualCashflow, dealInputs.growthRate],
  );

  const loanBalanceTrend = useMemo(() => {
    const fullTrend = Array.from({ length: 5 }, (_, i) => {
      const yearEnd = amortizationSchedule.find(
        (entry) => entry.month === (i + 1) * 12,
      );
      return yearEnd ? yearEnd.balance : 0;
    });
    const payoffIndex = fullTrend.findIndex((balance) => balance <= 0);
    return payoffIndex === -1 ? fullTrend : fullTrend.slice(0, payoffIndex + 1);
  }, [amortizationSchedule]);

  const considerations = useMemo(
    () => buildConsiderations(dealInputs, metrics),
    [dealInputs, metrics],
  );
  const hasNoFlags =
    considerations.length === 1 && considerations[0] === NO_FLAGS_MESSAGE;

  return (
    <div className="print-report w-full min-h-[800px] bg-[#BBB7AF] px-0 py-[10px] lg:py-6 space-y-[10px] lg:space-y-[20px]">
      <div className="hidden lg:flex items-center justify-end gap-[10px] no-print">
        <Button
          className="text-[#ddd8cf] bg-[#262626] hover:bg-[#333] h-9 px-2.5"
          onClick={onExport}
          aria-label="Export report"
        >
          <Printer className="h-4 w-4" />
          <span className="h-4 w-px bg-[#ddd8cf]/30 mx-[10px]" />
          <span className="text-[13px] font-bold">PDF</span>
        </Button>
        <Button
          size="icon"
          className="text-[#ddd8cf] bg-[#262626] hover:bg-[#333]"
          onClick={onSave}
          aria-label="Save analysis"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-[10px] lg:space-y-[20px]">
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
          totalCostOfAcquisition={metrics.totalCostOfAcquisition}
        />

        <div className="grid gap-[10px] lg:gap-[20px] lg:grid-cols-2 items-start">
          <Card ref={profitabilityRef} className="p-5 bg-[#262626]">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF] mb-4">
              Profitability
            </h3>
            <div className="flex items-start justify-between gap-4 mb-4">
              <HeroStat
                label="DSCR"
                value={metrics.dscr !== null ? `${metrics.dscr.toFixed(2)}x` : "N/A"}
                description={
                  metrics.dscr !== null
                    ? "Lenders typically require 1.25x+"
                    : "No debt service to cover"
                }
              />
              <div className="text-right">
                <p className="text-sm text-[#BBB7AF] mb-1">Payback Period</p>
                <p className="font-display font-bold text-[40px] leading-none text-[#fff]">
                  {paybackYears !== null ? `${paybackYears.toFixed(1)} yrs` : "N/A"}
                </p>
                <p className="text-xs text-[#8B8680] mt-1.5">
                  To recoup down payment
                </p>
              </div>
            </div>
            <div className="divide-y divide-[#333] border-t border-[#333] [&>*:last-child]:pb-0">
              <MetricRow
                label="Debt-Adjusted ROI"
                value={`${metrics.debtAdjustedRoi.toFixed(2)}%`}
                description="ROI net of annual interest cost"
              />
              <MetricRow
                label="Annual Interest Cost"
                value={`$${Math.round(metrics.averageAnnualInterest).toLocaleString()}`}
                description="Average interest paid per year over the loan"
              />
              <MetricRow
                label="Monthly Net Profit"
                value={monthlyNetProfit.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                description={`Cash flow after debt service (${monthlyGrossMargin.toFixed(1)}% GM)`}
              />
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-[#BBB7AF]">Cashflow Outlook</p>
                    <div className="flex gap-1">
                      {[2, 3, 4, 5].map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setOutlookYear(year)}
                          className={`inline-flex items-center justify-center h-5 px-2.5 rounded-full text-[11px] font-semibold transition-colors ${
                            outlookYear === year
                              ? "bg-[#c0ff02] text-[#262626]"
                              : "bg-[#333] text-[#BBB7AF] hover:bg-[#3a3a3a]"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#8B8680]">
                    Year {outlookYear} at {dealInputs.growthRate}% annual growth
                  </p>
                </div>
                <div className="font-display font-bold text-[26px] text-[#f3f3f3] whitespace-nowrap">
                  ${Math.round(outlookCashflow).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="p-5 bg-[#262626] text-[#BBB7AF] flex flex-col overflow-hidden"
            style={profitabilityHeight ? { height: profitabilityHeight } : undefined}
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] mb-4">
              Considerations
            </h3>
            <div className="flex-1 min-h-[120px] flex flex-col mb-4">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs text-[#8B8680]">5-Year Outlook</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-[#8B8680]">
                    <span className="h-1.5 w-3 rounded-full bg-[#c0ff02]" />
                    Cashflow
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#8B8680]">
                    <span className="h-1.5 w-3 rounded-full bg-[#BBB7AF]" />
                    Loan Balance
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <TrendSparkline
                  series={[
                    { data: cashflowTrend, color: "#c0ff02", fill: true },
                    { data: loanBalanceTrend, color: "#BBB7AF" },
                  ]}
                />
              </div>
            </div>
            <div className="border-t border-[#333] pt-4 overflow-y-auto">
              <ul className="space-y-3">
                {considerations.map((note, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5">
                      {hasNoFlags ? (
                        <CheckCircle className="h-4 w-4 text-[#c0ff02]" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-[#E68A6B]" />
                      )}
                    </div>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <AnalysisCharts amortizationSchedule={amortizationSchedule} />
      </div>
    </div>
  );
};

export default AnalysisResults;
