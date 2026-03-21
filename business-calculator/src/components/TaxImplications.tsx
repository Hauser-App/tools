import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calculator } from "lucide-react";

interface TaxImplicationsProps {
  purchasePrice: number;
  annualCashflow: number;
  federalCapitalGainsRate?: number;
  stateCapitalGainsRate?: number;
  federalOrdinaryRate?: number;
  stateOrdinaryRate?: number;
  loanTermYears?: number;
  monthlyPayment?: number;
}

const TaxImplications = ({
  purchasePrice = 1000000,
  annualCashflow = 100000,
  federalCapitalGainsRate = 20,
  stateCapitalGainsRate = 5,
  federalOrdinaryRate = 37,
  stateOrdinaryRate = 8,
  loanTermYears = 5,
  monthlyPayment = 0,
}: TaxImplicationsProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  // Calculate total payments over loan term
  const totalPayments = monthlyPayment * 12 * loanTermYears;
  const totalInterestPayments = totalPayments - purchasePrice;

  // Capital Gains calculations
  const totalCapitalGainsRate = federalCapitalGainsRate + stateCapitalGainsRate;
  const federalCapitalGainsTax =
    (purchasePrice * federalCapitalGainsRate) / 100;
  const stateCapitalGainsTax = (purchasePrice * stateCapitalGainsRate) / 100;
  const totalCapitalGainsTax = federalCapitalGainsTax + stateCapitalGainsTax;

  // Seller Financing calculations (over entire loan term)
  const annualPayment = monthlyPayment * 12;
  const totalOrdinaryRate = federalOrdinaryRate + stateOrdinaryRate;
  const federalOrdinaryTaxAnnual = (annualPayment * federalOrdinaryRate) / 100;
  const stateOrdinaryTaxAnnual = (annualPayment * stateOrdinaryRate) / 100;
  const totalOrdinaryTaxAnnual =
    federalOrdinaryTaxAnnual + stateOrdinaryTaxAnnual;

  // Total tax over loan term
  const totalOrdinaryTaxOverTerm = totalOrdinaryTaxAnnual * loanTermYears;

  return (
    <div className="space-y-6">
      <h2 className="text-[20px] font-bold">Tax Implications</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-[#262626] text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asset/Stock Purchase
            </CardTitle>
            <Calculator className="h-4 w-4 text-[#c0ff02]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#BBB7AF] mb-1">Federal Rate</p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(federalCapitalGainsRate)}
                  </p>
                  <p className="text-sm text-[#BBB7AF] mt-1">
                    {formatCurrency(federalCapitalGainsTax)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BBB7AF] mb-1">State Rate</p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(stateCapitalGainsRate)}
                  </p>
                  <p className="text-sm text-[#BBB7AF] mt-1">
                    {formatCurrency(stateCapitalGainsTax)}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#3a3a3a]">
                <p className="text-xs text-[#BBB7AF] mb-1">Total Tax Impact</p>
                <p className="text-2xl font-bold">
                  {formatPercentage(totalCapitalGainsRate)}
                </p>
                <p className="text-sm text-[#BBB7AF] mt-1">
                  {formatCurrency(totalCapitalGainsTax)}
                </p>
                <p className="text-xs text-[#BBB7AF] mt-2">
                  One-time tax on {formatCurrency(purchasePrice)} sale price
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#262626] text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Seller Financing ({loanTermYears} Years)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#c0ff02]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#BBB7AF] mb-1">Federal Rate</p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(federalOrdinaryRate)}
                  </p>
                  <p className="text-sm text-[#BBB7AF] mt-1">
                    {formatCurrency(federalOrdinaryTaxAnnual)} /yr
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#BBB7AF] mb-1">State Rate</p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(stateOrdinaryRate)}
                  </p>
                  <p className="text-sm text-[#BBB7AF] mt-1">
                    {formatCurrency(stateOrdinaryTaxAnnual)} /yr
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#3a3a3a]">
                <p className="text-xs text-[#BBB7AF] mb-1">
                  Total Tax Over Term
                </p>
                <p className="text-2xl font-bold">
                  {formatPercentage(totalOrdinaryRate)}
                </p>
                <p className="text-sm text-[#BBB7AF] mt-1">
                  {formatCurrency(totalOrdinaryTaxOverTerm)}
                </p>
                <p className="text-xs text-[#BBB7AF] mt-2">
                  Tax on {formatCurrency(totalPayments)} total payments over{" "}
                  {loanTermYears} years
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxImplications;
