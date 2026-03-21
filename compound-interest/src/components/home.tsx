import React, { useState } from "react";
import CalculatorForm from "./CalculatorForm";
import ResultsCard from "./ResultsCard";
import GrowthChart from "./GrowthChart";
import QuartileMetrics from "./QuartileMetrics";
import WithdrawalCalculator from "./WithdrawalCalculator";

interface CalculationValues {
  principal: string;
  minInterestRate: string;
  maxInterestRate: string;
  timePeriod: string;
  contributionAmount: string;
  isMonthlyCompound: boolean;
  isMonthlyContribution: boolean;
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  const [results, setResults] = useState({
    finalAmount: 10000,
    totalContributions: 5000,
    interestEarned: 5000,
    maxFinalAmount: 12000,
    maxTotalContributions: 5000,
    maxInterestEarned: 7000,
  });

  const [isShowingMaxReturn, setIsShowingMaxReturn] = useState(false);

  const [chartData, setChartData] = useState([
    { year: currentYear, minAmount: 10000, maxAmount: 10000 },
    { year: currentYear + 1, minAmount: 11000, maxAmount: 12000 },
    { year: currentYear + 2, minAmount: 12100, maxAmount: 14400 },
    { year: currentYear + 3, minAmount: 13310, maxAmount: 17280 },
    { year: currentYear + 4, minAmount: 14641, maxAmount: 20736 },
  ]);

  const [withdrawalRate, setWithdrawalRate] = useState(0);
  const [withdrawalStartYear, setWithdrawalStartYear] = useState(0);
  const [showWithdrawals, setShowWithdrawals] = useState(true);

  const calculateGrowth = ({
    principal,
    rate,
    years,
    contribution,
    isMonthlyCompound,
    isMonthlyContribution,
  }: {
    principal: number;
    rate: number;
    years: number;
    contribution: number;
    isMonthlyCompound: boolean;
    isMonthlyContribution: boolean;
  }) => {
    const annualRate = rate / 100;
    const effectiveAnnualRate = isMonthlyCompound
      ? Math.pow(1 + annualRate / 12, 12) - 1
      : annualRate;

    let totalContributions = principal;
    let currentAmount = principal;
    const yearlyData = [{ year: currentYear, amount: principal }];

    for (let year = 1; year <= years; year++) {
      totalContributions += isMonthlyContribution
        ? contribution * 12
        : contribution;

      if (isMonthlyContribution) {
        const monthlyRate = annualRate / 12;
        const monthlyContribution = contribution;

        if (isMonthlyCompound) {
          for (let month = 1; month <= 12; month++) {
            currentAmount = currentAmount * (1 + monthlyRate);
            currentAmount += monthlyContribution;
          }
        } else {
          currentAmount = currentAmount * (1 + effectiveAnnualRate);
          for (let month = 1; month <= 12; month++) {
            const remainingMonths = 12 - month + 1;
            const contributionGrowth =
              monthlyContribution * Math.pow(1 + monthlyRate, remainingMonths);
            currentAmount += contributionGrowth;
          }
        }
      } else {
        currentAmount += contribution;

        if (isMonthlyCompound) {
          for (let month = 1; month <= 12; month++) {
            currentAmount *= 1 + annualRate / 12;
          }
        } else {
          currentAmount *= 1 + annualRate;
        }
      }

      yearlyData.push({
        year: currentYear + year,
        amount: Math.round(currentAmount),
      });
    }

    return {
      yearlyData,
      finalAmount: Math.round(currentAmount),
      totalContributions: Math.round(totalContributions),
    };
  };

  const handleCalculate = (values: CalculationValues) => {
    const principal = parseFloat(values.principal.replace(/,/g, ""));
    const minRate = parseFloat(values.minInterestRate);
    const maxRate = parseFloat(values.maxInterestRate);
    const years = parseInt(values.timePeriod);
    const contribution = parseFloat(
      values.contributionAmount.replace(/,/g, ""),
    );
    const isMonthlyCompound = values.isMonthlyCompound;
    const isMonthlyContribution = values.isMonthlyContribution;

    const minGrowth = calculateGrowth({
      principal,
      rate: minRate,
      years,
      contribution,
      isMonthlyCompound,
      isMonthlyContribution,
    });

    const maxGrowth = calculateGrowth({
      principal,
      rate: maxRate,
      years,
      contribution,
      isMonthlyCompound,
      isMonthlyContribution,
    });

    const newChartData = minGrowth.yearlyData.map((data, index) => ({
      year: data.year,
      minAmount: data.amount,
      maxAmount: maxGrowth.yearlyData[index].amount,
    }));

    setResults({
      finalAmount: minGrowth.finalAmount,
      totalContributions: minGrowth.totalContributions,
      interestEarned: minGrowth.finalAmount - minGrowth.totalContributions,
      maxFinalAmount: maxGrowth.finalAmount,
      maxTotalContributions: maxGrowth.totalContributions,
      maxInterestEarned: maxGrowth.finalAmount - maxGrowth.totalContributions,
    });

    setChartData(newChartData);
  };

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-6 md:p-8 overflow-x-hidden"
      style={{ backgroundColor: "#BBB7AF" }}
    >
      <div className="mx-auto space-y-4 sm:space-y-5 max-w-7xl">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-center mb-4 sm:mb-6 md:mb-10"
          style={{ color: "#262626" }}
        >
          Compound Interest Calculator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 sm:gap-5">
          <div className="space-y-4 sm:space-y-5 w-full mx-auto">
            <CalculatorForm onCalculate={handleCalculate} />
            <ResultsCard
              finalAmount={results.finalAmount}
              totalContributions={results.totalContributions}
              interestEarned={results.interestEarned}
              maxFinalAmount={results.maxFinalAmount}
              maxTotalContributions={results.maxTotalContributions}
              maxInterestEarned={results.maxInterestEarned}
              isShowingMaxReturn={isShowingMaxReturn}
              onToggleReturnRate={() => {
                setIsShowingMaxReturn(!isShowingMaxReturn);
                // Update withdrawal calculator data through props
              }}
            />
          </div>

          <div className="lg:col-span-1 space-y-4 sm:space-y-5 w-full">
            <GrowthChart
              data={chartData}
              withdrawalRate={withdrawalRate}
              withdrawalStartYear={withdrawalStartYear}
              showWithdrawals={showWithdrawals}
            />
            <QuartileMetrics
              data={chartData.map((d) => ({
                year: d.year,
                amount: d.minAmount,
              }))}
            />
            <WithdrawalCalculator
              data={chartData.map((d) => ({
                year: d.year,
                amount: isShowingMaxReturn ? d.maxAmount : d.minAmount,
              }))}
              interestRate={5}
              onWithdrawalRateChange={setWithdrawalRate}
              onWithdrawalStartYearChange={setWithdrawalStartYear}
              onShowWithdrawalsChange={setShowWithdrawals}
            />
          </div>
        </div>
      </div>

      <div
        className="mt-6 sm:mt-8 md:mt-12 max-w-7xl mx-auto text-[10px] sm:text-[12px] leading-tight"
        style={{ color: "#333333" }}
      >
        <p className="mb-2 font-bold text-sm">Disclaimer</p>
        <p className="mb-4 font-light">
          The Compound Interest Calculator is designed to provide a directional
          visualization and articulation of potential financial outcomes based
          on user-inputted assumptions. The calculations presented do not
          account for real-world variables such as market volatility, inflation,
          changes in interest rates, taxes, unexpected withdrawals, or other
          economic factors that may impact actual results. The projections shown
          are hypothetical and for illustrative purposes only.
        </p>
        <p className="mb-4 font-light">
          The investing information provided on this page is for educational
          purposes only. We do not offer advisory, brokerage, or financial
          planning services, nor do we recommend or advise investors to buy or
          sell any particular stocks, securities, or other investments.
          Investment decisions should be made based on individual financial
          circumstances and in consultation with a qualified financial
          professional.
        </p>
        <p className="mb-4 font-light">
          Past performance is not indicative of future results, and there is no
          guarantee that any investment strategy will achieve its objectives.
          Users should consider their own risk tolerance and financial goals
          before making investment decisions.
        </p>
        <p className="font-light">
          By using this calculator, you acknowledge that the estimates provided
          are not financial advice and should not be solely relied upon for
          making investment, retirement, or savings decisions.
        </p>
      </div>
    </div>
  );
}
