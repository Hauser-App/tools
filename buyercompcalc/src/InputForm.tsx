import type { CalculatorInputs } from './types';
import CurrencyInput from './CurrencyInput';
import PercentInput from './PercentInput';

interface InputFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

export default function InputForm({ inputs, onChange }: InputFormProps) {
  const update = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Property & Commission */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-hauser-navy mb-4">
          Property & Commission
        </h2>
        <div className="space-y-4">
          <CurrencyInput
            id="purchasePrice"
            label="Purchase Price"
            value={inputs.purchasePrice}
            onChange={(v) => update('purchasePrice', v)}
            placeholder="1,694,000"
            helpText="The list or agreed-upon purchase price"
          />
          <PercentInput
            id="sellerCommissionRate"
            label="Seller-Offered Buyer Broker Commission"
            value={inputs.sellerCommissionRate}
            onChange={(v) => update('sellerCommissionRate', v)}
            helpText="Typically 2-3% of purchase price"
          />
          <CurrencyInput
            id="hauserFlatFee"
            label="Hauser Flat Fee"
            value={inputs.hauserFlatFee}
            onChange={(v) => update('hauserFlatFee', v)}
            min={15000}
            helpText="Minimum $15,000"
          />
          <PercentInput
            id="sellersAgentCommission"
            label="Seller's Agent Commission"
            value={inputs.sellersAgentCommission}
            onChange={(v) => update('sellersAgentCommission', v)}
            helpText="Commission paid to listing agent"
          />
        </div>
      </div>

      {/* Loan Payoff */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-hauser-navy mb-1">
          Loan Payoff
        </h2>
        <p className="text-xs text-hauser-gray mb-4">
          Seller's existing mortgage details
        </p>
        <div className="space-y-4">
          <CurrencyInput
            id="existingLoanBalance"
            label="Current Balance (1st Mortgage)"
            value={inputs.existingLoanBalance}
            onChange={(v) => update('existingLoanBalance', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="loanInterestAdjustment"
            label="Interest Adjustment"
            value={inputs.loanInterestAdjustment}
            onChange={(v) => update('loanInterestAdjustment', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="statementDemandFee"
            label="Statement / Demand Fee"
            value={inputs.statementDemandFee}
            onChange={(v) => update('statementDemandFee', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="reconveyanceFee"
            label="Reconveyance Fee"
            value={inputs.reconveyanceFee}
            onChange={(v) => update('reconveyanceFee', v)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Closing Costs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-hauser-navy mb-1">
          Closing Costs
        </h2>
        <p className="text-xs text-hauser-gray mb-4">
          Seller-side closing costs and fees
        </p>
        <div className="space-y-4">
          <CurrencyInput
            id="titleInsurance"
            label="Homeowner's Policy of Title Insurance"
            value={inputs.titleInsurance}
            onChange={(v) => update('titleInsurance', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="escrowFee"
            label="Escrow Fee"
            value={inputs.escrowFee}
            onChange={(v) => update('escrowFee', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="notaryFee"
            label="Notary Fee"
            value={inputs.notaryFee}
            onChange={(v) => update('notaryFee', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="recordingFees"
            label="Recording Fees"
            value={inputs.recordingFees}
            onChange={(v) => update('recordingFees', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="recordingServiceFee"
            label="Recording Service Fee"
            value={inputs.recordingServiceFee}
            onChange={(v) => update('recordingServiceFee', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="countyTransferTax"
            label="County Transfer Tax"
            value={inputs.countyTransferTax}
            onChange={(v) => update('countyTransferTax', v)}
            placeholder="0"
          />
          <CurrencyInput
            id="cityTransferTax"
            label="City Transfer Tax"
            value={inputs.cityTransferTax}
            onChange={(v) => update('cityTransferTax', v)}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
