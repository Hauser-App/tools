import { useState, useMemo } from 'react';
import type { CalculatorInputs } from './types';
import { calculate } from './calculator';
import InputForm from './InputForm';
import ComparisonCards from './ComparisonCards';
import SellerNetSheet from './SellerNetSheet';
import Disclaimer from './Disclaimer';

const DEFAULT_INPUTS: CalculatorInputs = {
  purchasePrice: 0,
  sellerCommissionRate: 2.5,
  hauserFlatFee: 20000,
  sellersAgentCommission: 2.5,

  existingLoanBalance: 0,
  loanInterestAdjustment: 0,
  statementDemandFee: 0,
  reconveyanceFee: 0,

  titleInsurance: 0,
  escrowFee: 0,
  notaryFee: 0,
  recordingFees: 0,
  recordingServiceFee: 0,
  countyTransferTax: 0,
  cityTransferTax: 0,
};

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => calculate(inputs), [inputs]);

  const hasPrice = inputs.purchasePrice > 0;
  const feeValid = inputs.hauserFlatFee >= 15000;

  return (
    <div className="min-h-screen bg-hauser-bg">
      {/* Header */}
      <header className="bg-hauser-navy">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
              Buyer Broker Compensation Calculator
            </h1>
            <p className="text-hauser-light/80 text-sm mt-1">
              See how Hauser puts more money in your pocket
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Input Panel */}
          <div className="space-y-6">
            <InputForm inputs={inputs} onChange={setInputs} />
            <div className="lg:block hidden">
              <Disclaimer />
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {hasPrice && feeValid ? (
              <>
                <ComparisonCards
                  results={results}
                  hauserFlatFee={inputs.hauserFlatFee}
                />
                <SellerNetSheet results={results} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-hauser-gray">
                  <svg
                    className="mx-auto h-12 w-12 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.25-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.25-2.25h.008v.008H15v-.008z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 005.25 9v.878m13.5-3A2.25 2.25 0 0118.75 9v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 12v6a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18v-6a2.25 2.25 0 00-1.5-2.122"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Enter a purchase price to see your comparison
                  </p>
                  {!feeValid && inputs.hauserFlatFee > 0 && (
                    <p className="text-xs text-hauser-red mt-2">
                      Hauser flat fee must be at least $15,000
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mobile disclaimer */}
            <div className="lg:hidden">
              <Disclaimer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
