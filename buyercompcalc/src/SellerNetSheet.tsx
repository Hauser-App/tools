import { useState } from 'react';
import type { CalculatorResults } from './types';
import { formatCurrency } from './calculator';

interface SellerNetSheetProps {
  results: CalculatorResults;
}

export default function SellerNetSheet({ results }: SellerNetSheetProps) {
  const [open, setOpen] = useState(false);
  const { sellerNet1, sellerNet2 } = results;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-hauser-navy text-sm">
          Seller Net Sheet Comparison
        </span>
        <svg
          className={`w-5 h-5 text-hauser-gray transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-hauser-gray">
                  Line Item
                </th>
                <th className="text-right py-2 font-medium text-hauser-gray">
                  Option 1
                </th>
                <th className="text-right py-2 font-medium text-hauser-gray">
                  Option 2
                </th>
                <th className="text-right py-2 font-medium text-hauser-gray">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sales Price */}
              <NetRow
                label="Sales Price"
                opt1={sellerNet1.salesPrice}
                opt2={sellerNet2.salesPrice}
              />

              {/* Loan Payoff Section */}
              <SectionHeader label="Loan Payoff (1st Mortgage)" />
              <NetRow
                label="Current Balance"
                opt1={sellerNet1.loanPayoffBalance}
                opt2={sellerNet2.loanPayoffBalance}
                isCost
                indent
              />
              <NetRow
                label="Interest Adjustment"
                opt1={sellerNet1.loanInterestAdjustment}
                opt2={sellerNet2.loanInterestAdjustment}
                isCost
                indent
              />
              <NetRow
                label="Statement / Demand Fee"
                opt1={sellerNet1.statementDemandFee}
                opt2={sellerNet2.statementDemandFee}
                isCost
                indent
              />
              <NetRow
                label="Reconveyance Fee"
                opt1={sellerNet1.reconveyanceFee}
                opt2={sellerNet2.reconveyanceFee}
                isCost
                indent
              />
              <SubtotalRow
                label="Total Loan Payoff"
                opt1={sellerNet1.totalLoanPayoff}
                opt2={sellerNet2.totalLoanPayoff}
              />

              {/* Commission Section */}
              <SectionHeader label="Broker's Compensation" />
              <NetRow
                label="Buyer's Broker Fee"
                opt1={sellerNet1.buyerBrokerFee}
                opt2={sellerNet2.buyerBrokerFee}
                isCost
                indent
              />
              <NetRow
                label="Seller's Broker Fee"
                opt1={sellerNet1.sellerBrokerFee}
                opt2={sellerNet2.sellerBrokerFee}
                isCost
                indent
              />
              <SubtotalRow
                label="Total Commissions"
                opt1={sellerNet1.totalCommissions}
                opt2={sellerNet2.totalCommissions}
              />

              {/* Closing Costs Section */}
              <SectionHeader label="Closing Costs" />
              <NetRow
                label="Title Insurance"
                opt1={sellerNet1.titleInsurance}
                opt2={sellerNet2.titleInsurance}
                isCost
                indent
              />
              <NetRow
                label="Escrow Fee"
                opt1={sellerNet1.escrowFee}
                opt2={sellerNet2.escrowFee}
                isCost
                indent
              />
              <NetRow
                label="Notary Fee"
                opt1={sellerNet1.notaryFee}
                opt2={sellerNet2.notaryFee}
                isCost
                indent
              />
              <NetRow
                label="Recording Fees"
                opt1={sellerNet1.recordingFees}
                opt2={sellerNet2.recordingFees}
                isCost
                indent
              />
              <NetRow
                label="Recording Service Fee"
                opt1={sellerNet1.recordingServiceFee}
                opt2={sellerNet2.recordingServiceFee}
                isCost
                indent
              />
              <NetRow
                label="County Transfer Tax"
                opt1={sellerNet1.countyTransferTax}
                opt2={sellerNet2.countyTransferTax}
                isCost
                indent
              />
              <NetRow
                label="City Transfer Tax"
                opt1={sellerNet1.cityTransferTax}
                opt2={sellerNet2.cityTransferTax}
                isCost
                indent
              />
              <SubtotalRow
                label="Total Closing Costs"
                opt1={sellerNet1.totalClosingCosts}
                opt2={sellerNet2.totalClosingCosts}
              />

              {/* Net to Seller */}
              <tr className="border-t-2 border-hauser-navy font-bold">
                <td className="py-3 text-hauser-navy">Net to Seller</td>
                <td className="py-3 text-right text-hauser-navy tabular-nums">
                  {formatCurrency(sellerNet1.netToSeller)}
                </td>
                <td className="py-3 text-right text-hauser-navy tabular-nums">
                  {formatCurrency(sellerNet2.netToSeller)}
                </td>
                <DeltaCell
                  value={sellerNet2.netToSeller - sellerNet1.netToSeller}
                />
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-hauser-gray italic">
            Key Insight: The seller nets approximately the same either way. The
            difference flows to the buyer.
          </p>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr className="border-t border-gray-200">
      <td
        colSpan={4}
        className="pt-3 pb-1 text-xs font-semibold text-hauser-gray uppercase tracking-wide"
      >
        {label}
      </td>
    </tr>
  );
}

function NetRow({
  label,
  opt1,
  opt2,
  isCost,
  indent,
}: {
  label: string;
  opt1: number;
  opt2: number;
  isCost?: boolean;
  indent?: boolean;
}) {
  const format = (v: number) => {
    if (v === 0) return '$0';
    if (isCost) return `(${formatCurrency(v)})`;
    return formatCurrency(v);
  };

  const delta = isCost ? -(opt2 - opt1) : opt2 - opt1;

  return (
    <tr className="border-b border-gray-50">
      <td className={`py-1.5 text-hauser-navy ${indent ? 'pl-4' : ''}`}>
        {label}
      </td>
      <td className="py-1.5 text-right text-hauser-navy tabular-nums">
        {format(opt1)}
      </td>
      <td className="py-1.5 text-right text-hauser-navy tabular-nums">
        {format(opt2)}
      </td>
      <DeltaCell value={delta} />
    </tr>
  );
}

function SubtotalRow({
  label,
  opt1,
  opt2,
}: {
  label: string;
  opt1: number;
  opt2: number;
}) {
  const delta = -(opt2 - opt1);
  return (
    <tr className="border-b border-gray-200 font-medium">
      <td className="py-2 text-hauser-navy">{label}</td>
      <td className="py-2 text-right text-hauser-navy tabular-nums">
        ({formatCurrency(opt1)})
      </td>
      <td className="py-2 text-right text-hauser-navy tabular-nums">
        ({formatCurrency(opt2)})
      </td>
      <DeltaCell value={delta} />
    </tr>
  );
}

function DeltaCell({ value }: { value: number }) {
  if (value === 0) {
    return (
      <td className="py-1.5 text-right text-hauser-gray tabular-nums">-</td>
    );
  }
  return (
    <td
      className={`py-1.5 text-right tabular-nums ${
        value > 0 ? 'text-hauser-green' : 'text-hauser-red'
      }`}
    >
      {value > 0 ? '+' : ''}
      {formatCurrency(value)}
    </td>
  );
}
