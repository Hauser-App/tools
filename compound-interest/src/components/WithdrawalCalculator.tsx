import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

interface WithdrawalCalculatorProps {
  data?: Array<{ year: number; amount: number }>;
  interestRate?: number;
  onWithdrawalRateChange?: (rate: number) => void;
  onWithdrawalStartYearChange?: (year: number) => void;
  onShowWithdrawalsChange?: (show: boolean) => void;
}

const WithdrawalCalculator = ({
  data = [],
  interestRate = 5,
  onWithdrawalRateChange = () => {},
  onWithdrawalStartYearChange = () => {},
  onShowWithdrawalsChange = () => {},
}: WithdrawalCalculatorProps) => {
  const [withdrawalRate, setWithdrawalRate] = useState(0);
  const [withdrawalStartYear, setWithdrawalStartYear] = useState(0);
  const [showWithdrawals, setShowWithdrawals] = useState(true);

  useEffect(() => {
    onWithdrawalRateChange(withdrawalRate);
    onWithdrawalStartYearChange(withdrawalStartYear);
  }, [
    withdrawalRate,
    withdrawalStartYear,
    onWithdrawalRateChange,
    onWithdrawalStartYearChange,
  ]);

  useEffect(() => {
    onShowWithdrawalsChange(showWithdrawals);
  }, [showWithdrawals, onShowWithdrawalsChange]);

  const calculateWithdrawal = () => {
    if (data.length < 2) return { monthlyWithdrawal: 0, yearlyWithdrawal: 0 };

    const balanceAtStartYear = data[withdrawalStartYear]?.amount || 0;
    const yearlyWithdrawal = balanceAtStartYear * (withdrawalRate / 100);
    const monthlyWithdrawal = yearlyWithdrawal * (1 / 12);

    return { monthlyWithdrawal, yearlyWithdrawal };
  };

  const { monthlyWithdrawal, yearlyWithdrawal } = calculateWithdrawal();

  // Calculate final balances
  const finalYearIndex = data.length - 1;
  const yearsOfWithdrawals = finalYearIndex - withdrawalStartYear;
  const compoundedWithdrawalImpact = Math.pow(
    1 - withdrawalRate / 100,
    yearsOfWithdrawals,
  );
  const finalBalanceWithWithdrawals =
    data[finalYearIndex]?.amount * compoundedWithdrawalImpact;
  const finalBalanceWithoutWithdrawals = data[finalYearIndex]?.amount;
  const opportunityCost =
    finalBalanceWithWithdrawals - finalBalanceWithoutWithdrawals;

  return (
    <Card
      className="p-3 sm:p-4 md:p-5 h-auto sm:h-[412px] lg:h-auto"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <div className="space-y-4 sm:space-y-6 h-auto sm:h-[372px] lg:h-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h3
            className="text-lg sm:text-xl font-medium"
            style={{ color: "#BBB7AF" }}
          >
            Safe Withdrawal Calculator
          </h3>
          <div className="flex items-center gap-2">
            <span style={{ color: "#BBB7AF", fontSize: "12px" }}>
              Show Impact
            </span>
            <Switch
              checked={showWithdrawals}
              onCheckedChange={setShowWithdrawals}
              className="data-[state=checked]:bg-[#C0FF02] data-[state=unchecked]:bg-[#333333]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-12">
              <div>
                <div className="flex justify-between mb-8">
                  <p className="text-sm" style={{ color: "#BBB7AF" }}>
                    Annual Withdrawal Rate
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#C0FF02" }}
                  >
                    {withdrawalRate.toFixed(2)}%
                  </p>
                </div>
                <Slider
                  value={[withdrawalRate]}
                  onValueChange={(value) => setWithdrawalRate(value[0])}
                  max={20}
                  step={0.1}
                  className="[&_[data-orientation=horizontal]]:!bg-[#333333] [&_[role=slider]]:!bg-[#C0FF02] [&_[role=slider]]:!h-4 [&_[role=slider]]:!w-4 [&_[role=slider]]:!border-2 [&_[role=slider]]:!border-[#C0FF02]"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    value={`$${Math.round(monthlyWithdrawal).toLocaleString()}`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      const newMonthlyWithdrawal = parseInt(value) || 0;
                      const balanceAtStartYear =
                        data[withdrawalStartYear]?.amount || 0;
                      const newRate =
                        ((newMonthlyWithdrawal * 12) / balanceAtStartYear) *
                        100;
                      setWithdrawalRate(Math.min(20, Math.max(0, newRate)));
                    }}
                    className="text-4xl font-bold w-full px-4 py-2 rounded-lg text-center"
                    style={{ backgroundColor: "#333333", color: "#BBB7AF" }}
                  />
                  <p
                    className="text-xs mt-2 text-center"
                    style={{ color: "#BBB7AF" }}
                  >
                    Monthly Withdrawal
                  </p>
                </div>

                <div className="w-1/2">
                  <p
                    className="text-4xl font-bold px-4 py-2 text-center"
                    style={{ color: "#FFFFFF" }}
                  >
                    ${Math.round(yearlyWithdrawal).toLocaleString()}
                  </p>
                  <p
                    className="text-xs mt-2 text-center"
                    style={{ color: "#BBB7AF" }}
                  >
                    Yearly Withdrawal
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex justify-between mb-8">
                <p className="text-sm" style={{ color: "#BBB7AF" }}>
                  Start Withdrawals in Year
                </p>
                <p className="text-sm font-medium" style={{ color: "#C0FF02" }}>
                  {data[withdrawalStartYear]?.year || new Date().getFullYear()}
                </p>
              </div>
              <Slider
                value={[withdrawalStartYear]}
                onValueChange={(value) => setWithdrawalStartYear(value[0])}
                max={Math.max(0, data.length - 1)}
                step={1}
                className="[&_[data-orientation=horizontal]]:!bg-[#333333] [&_[role=slider]]:!bg-[#C0FF02] [&_[role=slider]]:!h-4 [&_[role=slider]]:!w-4 [&_[role=slider]]:!border-2 [&_[role=slider]]:!border-[#C0FF02]"
              />
            </div>

            <div className="pt-4 border-t border-[#333333] space-y-4">
              <div className="space-y-1">
                <p className="text-sm" style={{ color: "#BBB7AF" }}>
                  Final Balance with Withdrawals
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#FFFFFF" }}
                >
                  ${Math.round(finalBalanceWithWithdrawals).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm" style={{ color: "#BBB7AF" }}>
                  Final Balance without Withdrawals
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#FFFFFF" }}
                >
                  ${Math.round(finalBalanceWithoutWithdrawals).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm" style={{ color: "#BBB7AF" }}>
                  Opportunity Cost (Lost Growth Potential)
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: opportunityCost < 0 ? "#B05670" : "#C0FF02" }}
                >
                  {opportunityCost === 0
                    ? "$0"
                    : `${opportunityCost > 0 ? "+$" : "-$"}${Math.abs(
                        Math.round(opportunityCost),
                      ).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WithdrawalCalculator;
