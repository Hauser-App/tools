import React, { useState } from "react";
import BusinessInputForm from "./BusinessInputForm";
import AnalysisResults from "./AnalysisResults";
import ChatInterface from "./ChatInterface";

interface BusinessFormData {
  businessName: string;
  revenue: number;
  cashflow: number;
  growthRate: number;
  cashflowMultiple: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
}

interface AnalysisData {
  businessName: string;
  status: "GO" | "NO-GO";
  metrics: {
    cashOnCash: number;
    multipleOfCashflow: number;
    roi: number;
    debtAdjustedRoi: number;
    annualCashflow: number;
    monthlyPrincipal: number;
    monthlyInterest: number;
    valuation: number;
    financedAmount: number;
    monthlyPayment: number;
  };
  cashFlowProjections: { label: string; data: number }[];
  roiProjections: { label: string; data: number }[];
}

const Home = () => {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<
    {
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }[]
  >([]);

  const calculateAmortization = (
    principal: number,
    rate: number,
    years: number,
  ) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      const principalPart = monthlyPayment - interest;
      balance -= principalPart;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPart,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return { schedule, monthlyPayment };
  };

  const handleAnalysis = (data: BusinessFormData) => {
    setFormData(data);

    const valuation = data.cashflow * data.cashflowMultiple;
    const downPayment = (valuation * data.downPaymentPercent) / 100;
    const financedAmount = valuation - downPayment;

    const { schedule, monthlyPayment } = calculateAmortization(
      financedAmount,
      data.interestRate,
      data.loanTerm,
    );

    const monthlyPrincipal = schedule[0].principal;
    const monthlyInterest = schedule[0].interest;

    const annualDebtService = monthlyPayment * 12;
    const cashOnCash =
      ((data.cashflow - annualDebtService) / downPayment) * 100;

    // Calculate standard ROI
    const standardRoi = (data.cashflow / valuation) * 100;

    // Calculate debt-adjusted ROI
    const totalInterest = schedule.reduce(
      (sum, month) => sum + month.interest,
      0,
    );
    const averageAnnualInterest = totalInterest / data.loanTerm;
    const debtAdjustedRoi =
      ((data.cashflow - averageAnnualInterest) / valuation) * 100;

    const analysisResult: AnalysisData = {
      businessName: data.businessName,
      status: cashOnCash >= 40 ? "GO" : "NO-GO",
      metrics: {
        cashOnCash,
        multipleOfCashflow: data.cashflowMultiple,
        roi: standardRoi,
        debtAdjustedRoi,
        annualCashflow: data.cashflow,
        monthlyPrincipal,
        monthlyInterest,
        valuation,
        financedAmount,
        monthlyPayment,
      },
      cashFlowProjections: Array.from({ length: 12 }, (_, i) => ({
        label: new Date(2024, i).toLocaleString("default", { month: "short" }),
        data: (data.cashflow / 12) * (1 + (data.growthRate / 100 / 12) * i),
      })),
      roiProjections: Array.from({ length: 5 }, (_, i) => ({
        label: `Year ${i + 1}`,
        data: debtAdjustedRoi * (1 + (data.growthRate / 100) * i),
      })),
    };

    setAnalysisData(analysisResult);
    setAmortizationSchedule(schedule);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-[#BBB7AF] text-white p-8">
      <div className="max-w-[1680px] mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl text-[#262626] mb-4 font-medium tracking-tight font-sans">
            Small Business Acquisition Calculator
          </h1>
          <p className="text-[#262626] max-w-2xl mx-auto text-base tracking-normal text-center">
            Transaction analysis with comprehensive metrics and visual insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
            <BusinessInputForm onSubmit={handleAnalysis} />
            <ChatInterface />
          </div>

          <div
            className={`transition-opacity duration-300 ${showResults ? "opacity-100" : "opacity-0"}`}
          >
            {showResults && formData && analysisData && (
              <AnalysisResults
                businessName={analysisData.businessName}
                status={analysisData.status}
                metrics={analysisData.metrics}
                amortizationSchedule={amortizationSchedule}
                cashFlowProjections={analysisData.cashFlowProjections}
                roiProjections={analysisData.roiProjections}
                recommendations={[
                  `Cash on Cash Return: ${analysisData.metrics.cashOnCash.toFixed(2)}% indicates ${analysisData.metrics.cashOnCash >= 40 ? "strong" : "weak"} returns`,
                  `Multiple of Cashflow: ${formData.cashflowMultiple}x (standard valuation metric)`,
                  `Standard ROI: ${analysisData.metrics.roi.toFixed(2)}% vs Debt-Adjusted ROI: ${analysisData.metrics.debtAdjustedRoi.toFixed(2)}%`,
                  `Debt-adjusted ROI accounts for $${(analysisData.metrics.monthlyInterest * 12).toLocaleString()} in annual interest payments`,
                  `${analysisData.metrics.debtAdjustedRoi < analysisData.metrics.roi ? "Financing costs significantly impact returns" : "Favorable financing terms maintain strong returns"}`,
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
