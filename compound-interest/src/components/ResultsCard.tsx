import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface ResultsCardProps {
  finalAmount?: number;
  totalContributions?: number;
  interestEarned?: number;
  maxFinalAmount?: number;
  maxTotalContributions?: number;
  maxInterestEarned?: number;
  onToggleReturnRate?: () => void;
  isShowingMaxReturn?: boolean;
}

const ResultsCard = ({
  finalAmount = 10000,
  totalContributions = 5000,
  interestEarned = 5000,
  maxFinalAmount = 12000,
  maxTotalContributions = 5000,
  maxInterestEarned = 7000,
  onToggleReturnRate = () => {},
  isShowingMaxReturn = false,
}: ResultsCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculatePercentages = () => {
    const currentContributions = isShowingMaxReturn
      ? maxTotalContributions
      : totalContributions;
    const currentInterest = isShowingMaxReturn
      ? maxInterestEarned
      : interestEarned;
    const total = currentContributions + currentInterest;
    const contributionPercentage = (currentContributions / total) * 100;
    const interestPercentage = (currentInterest / total) * 100;
    return { contributionPercentage, interestPercentage };
  };

  const { contributionPercentage, interestPercentage } = calculatePercentages();

  return (
    <Card
      className="w-full max-w-md p-3 sm:p-4 md:p-5"
      style={{ backgroundColor: "#262626", border: "none" }}
    >
      <div className="space-y-6">
        <h3 className="text-xl font-medium" style={{ color: "#BBB7AF" }}>
          <div className="flex justify-between items-center">
            <span>Potential Returns</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1" style={{ fontSize: "12px" }}>
                <span
                  style={{ color: !isShowingMaxReturn ? "#C0FF02" : "#BBB7AF" }}
                >
                  Min
                </span>
                <span style={{ color: "#BBB7AF" }}>/</span>
                <span
                  style={{ color: isShowingMaxReturn ? "#C0FF02" : "#BBB7AF" }}
                >
                  Max
                </span>
              </div>
              <Switch
                checked={isShowingMaxReturn}
                onCheckedChange={onToggleReturnRate}
                className="data-[state=checked]:bg-[#C0FF02] data-[state=unchecked]:bg-[#333333]"
              />
            </div>
          </div>
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span style={{ color: "#BBB7AF" }}>Final Amount:</span>
              <span
                className="text-xl font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                {formatCurrency(
                  isShowingMaxReturn ? maxFinalAmount : finalAmount,
                )}
              </span>
            </div>
            <Separator className="bg-[#333333]" />
            <div className="flex justify-between items-center">
              <span style={{ color: "#BBB7AF" }}>Total Contributions:</span>
              <span className="text-lg" style={{ color: "#BBB7AF" }}>
                {formatCurrency(
                  isShowingMaxReturn
                    ? maxTotalContributions
                    : totalContributions,
                )}
              </span>
            </div>
            <Separator className="bg-[#333333]" />
            <div className="flex justify-between items-center">
              <span style={{ color: "#BBB7AF" }}>Interest Earned:</span>
              <span className="text-lg" style={{ color: "#C0FF02" }}>
                {formatCurrency(
                  isShowingMaxReturn ? maxInterestEarned : interestEarned,
                )}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#333333]">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm" style={{ color: "#BBB7AF" }}>
                  Contribution
                </p>
                <div>
                  <p
                    className="text-2xl font-semibold"
                    style={{ color: "#BBB7AF" }}
                  >
                    {contributionPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs" style={{ color: "#BBB7AF" }}>
                    of total
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm" style={{ color: "#BBB7AF" }}>
                  Interest
                </p>
                <div>
                  <p
                    className="text-2xl font-semibold"
                    style={{ color: "#C0FF02" }}
                  >
                    {interestPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs" style={{ color: "#BBB7AF" }}>
                    of total
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#333333]">
            <p className="text-xs font-light" style={{ color: "#BBB7AF" }}>
              These figures represent a conservative estimate based on the
              minimum return rate. The chart above shows the potential range
              between minimum and maximum returns.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultsCard;
