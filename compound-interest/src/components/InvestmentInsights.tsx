import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface InvestmentInsightsProps {
  data?: Array<{ year: number; amount: number }>;
  principal: number;
  monthlyContribution: number;
  interestRate: number;
}

const InvestmentInsights = ({
  data = [],
  principal = 10000,
  monthlyContribution = 100,
  interestRate = 5,
}: InvestmentInsightsProps) => {
  const calculateInsights = () => {
    if (data.length < 2) return null;

    const finalAmount = data[data.length - 1].amount;
    const totalContributions =
      principal + monthlyContribution * 12 * (data.length - 1);
    const interestEarned = finalAmount - totalContributions;
    const interestPercentage = Math.round((interestEarned / finalAmount) * 100);

    // Calculate delayed investment scenarios
    const yearlyReturn = Math.pow(1 + interestRate / 100, 1) - 1;
    const delayedScenarios = [1, 5, 10].map((delay) => {
      const remainingYears = data.length - 1 - delay;
      if (remainingYears <= 0) return 0;

      const delayedAmount =
        principal * Math.pow(1 + yearlyReturn, remainingYears) +
        monthlyContribution *
          12 *
          ((Math.pow(1 + yearlyReturn, remainingYears) - 1) / yearlyReturn);

      return Math.round(finalAmount - delayedAmount);
    });

    // Calculate passive income breakpoint
    const monthlyExpense = 2500; // Example monthly expense
    const yearlyExpenseRequired = monthlyExpense * 12;
    const breakpointYear = Math.ceil(
      Math.log(yearlyExpenseRequired / (principal * (interestRate / 100))) /
        Math.log(1 + interestRate / 100),
    );

    return {
      interestPercentage,
      delayedScenarios,
      breakpointYear,
      monthlyExpense,
    };
  };

  const insights = calculateInsights();
  if (!insights) return null;

  return (
    <Card
      className="w-full"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-medium" style={{ color: "#BBB7AF" }}>
          AI Investment Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3" style={{ color: "#BBB7AF" }}>
          <p>
            <span className="font-semibold" style={{ color: "#C0FF02" }}>
              Interest vs. Contributions:
            </span>{" "}
            {insights.interestPercentage}% of your final amount comes from
            compound interest, demonstrating how your money works for you over
            time.
          </p>

          <p>
            <span className="font-semibold" style={{ color: "#C0FF02" }}>
              Cost of Delay:
            </span>{" "}
            Postponing your investment would cost you:
            <br />• 1 year: ${insights.delayedScenarios[0].toLocaleString()}
            <br />• 5 years: ${insights.delayedScenarios[1].toLocaleString()}
            <br />• 10 years: ${insights.delayedScenarios[2].toLocaleString()}
          </p>

          <p>
            <span className="font-semibold" style={{ color: "#C0FF02" }}>
              Passive Income Potential:
            </span>{" "}
            {insights.breakpointYear > 0
              ? `By year ${insights.breakpointYear}, your investment returns could cover a monthly expense of $${insights.monthlyExpense.toLocaleString()}.`
              : "Your investment returns already cover your target monthly expenses."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentInsights;
