import type {
  CalculatorInputs,
  CalculatorResults,
  EdgeCase,
  SellerNetSheet,
} from './types';

function buildSellerNet(
  salesPrice: number,
  buyerBrokerFee: number,
  sellersAgentCommissionRate: number,
  inputs: CalculatorInputs
): SellerNetSheet {
  const sellerBrokerFee = salesPrice * (sellersAgentCommissionRate / 100);

  const totalLoanPayoff =
    inputs.existingLoanBalance +
    inputs.loanInterestAdjustment +
    inputs.statementDemandFee +
    inputs.reconveyanceFee;

  const totalCommissions = buyerBrokerFee + sellerBrokerFee;

  const totalClosingCosts =
    inputs.titleInsurance +
    inputs.escrowFee +
    inputs.notaryFee +
    inputs.recordingFees +
    inputs.recordingServiceFee +
    inputs.countyTransferTax +
    inputs.cityTransferTax;

  const netToSeller =
    salesPrice - totalLoanPayoff - totalCommissions - totalClosingCosts;

  return {
    salesPrice,

    loanPayoffBalance: inputs.existingLoanBalance,
    loanInterestAdjustment: inputs.loanInterestAdjustment,
    statementDemandFee: inputs.statementDemandFee,
    reconveyanceFee: inputs.reconveyanceFee,
    totalLoanPayoff,

    buyerBrokerFee,
    sellerBrokerFee,
    totalCommissions,

    titleInsurance: inputs.titleInsurance,
    escrowFee: inputs.escrowFee,
    notaryFee: inputs.notaryFee,
    recordingFees: inputs.recordingFees,
    recordingServiceFee: inputs.recordingServiceFee,
    countyTransferTax: inputs.countyTransferTax,
    cityTransferTax: inputs.cityTransferTax,
    totalClosingCosts,

    netToSeller,
  };
}

export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const { purchasePrice, sellerCommissionRate, hauserFlatFee } = inputs;

  const grossCommission = purchasePrice * (sellerCommissionRate / 100);

  // Determine edge case
  let edgeCase: EdgeCase = 'none';
  if (sellerCommissionRate === 0) {
    edgeCase = 'zero_commission';
  } else if (grossCommission < hauserFlatFee) {
    edgeCase = 'commission_less_than_fee';
  } else if (grossCommission === hauserFlatFee) {
    edgeCase = 'commission_equals_fee';
  }

  // Option 1: Buyer Waives Seller Obligation (Direct Pay)
  const effectivePurchasePrice = purchasePrice - grossCommission;
  const option1 = {
    effectivePurchasePrice,
    buyerOutOfPocket: hauserFlatFee,
    sellerSaves: grossCommission,
    buyerSavingsVsTraditional: grossCommission - hauserFlatFee,
    grossCommission,
  };

  // Option 2: Seller Pays Commission (Rebate Model)
  const buyerRebate = Math.max(grossCommission - hauserFlatFee, 0);
  const option2 = {
    purchasePrice,
    grossCommission,
    hauserRetains: hauserFlatFee,
    buyerRebate,
    buyerOutOfPocket: 0,
  };

  // Seller Net Sheets
  const sellerNet1 = buildSellerNet(
    effectivePurchasePrice,
    0, // no buyer broker fee in Option 1
    inputs.sellersAgentCommission,
    inputs
  );

  const sellerNet2 = buildSellerNet(
    purchasePrice,
    grossCommission,
    inputs.sellersAgentCommission,
    inputs
  );

  return { option1, option2, sellerNet1, sellerNet2, edgeCase };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
