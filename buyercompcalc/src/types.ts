export interface CalculatorInputs {
  purchasePrice: number;
  sellerCommissionRate: number; // percentage, e.g. 2.5
  hauserFlatFee: number;
  sellersAgentCommission: number; // percentage, e.g. 2.5

  // Loan Payoff
  existingLoanBalance: number;
  loanInterestAdjustment: number;
  statementDemandFee: number;
  reconveyanceFee: number;

  // Closing Costs
  titleInsurance: number;
  escrowFee: number;
  notaryFee: number;
  recordingFees: number;
  recordingServiceFee: number;
  countyTransferTax: number;
  cityTransferTax: number;
}

export interface Option1Result {
  effectivePurchasePrice: number;
  buyerOutOfPocket: number;
  sellerSaves: number;
  buyerSavingsVsTraditional: number;
  grossCommission: number;
}

export interface Option2Result {
  purchasePrice: number;
  grossCommission: number;
  hauserRetains: number;
  buyerRebate: number;
  buyerOutOfPocket: number;
}

export interface SellerNetSheet {
  salesPrice: number;

  // Loan Payoff
  loanPayoffBalance: number;
  loanInterestAdjustment: number;
  statementDemandFee: number;
  reconveyanceFee: number;
  totalLoanPayoff: number;

  // Commissions
  buyerBrokerFee: number;
  sellerBrokerFee: number;
  totalCommissions: number;

  // Closing Costs
  titleInsurance: number;
  escrowFee: number;
  notaryFee: number;
  recordingFees: number;
  recordingServiceFee: number;
  countyTransferTax: number;
  cityTransferTax: number;
  totalClosingCosts: number;

  netToSeller: number;
}

export interface CalculatorResults {
  option1: Option1Result;
  option2: Option2Result;
  sellerNet1: SellerNetSheet;
  sellerNet2: SellerNetSheet;
  edgeCase: EdgeCase;
}

export type EdgeCase =
  | 'none'
  | 'commission_less_than_fee'
  | 'zero_commission'
  | 'commission_equals_fee';
