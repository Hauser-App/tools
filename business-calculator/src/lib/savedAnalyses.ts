export interface BusinessFormData {
  businessName: string;
  revenue: number;
  cashflow: number;
  growthRate: number;
  cashflowMultiple: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
}

export interface AnalysisData {
  businessName: string;
  status: "GO" | "NO-GO";
  metrics: {
    cashOnCash: number;
    multipleOfCashflow: number;
    roi: number;
    debtAdjustedRoi: number;
    dscr: number;
    annualCashflow: number;
    monthlyPrincipal: number;
    monthlyInterest: number;
    valuation: number;
    financedAmount: number;
    monthlyPayment: number;
  };
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface SavedAnalysis {
  id: string;
  savedAt: string;
  formData: BusinessFormData;
  analysisData: AnalysisData;
  amortizationSchedule: AmortizationEntry[];
}

const STORAGE_KEY = "business-calculator:saved-analyses";

export function listSavedAnalyses(): SavedAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(entry: {
  formData: BusinessFormData;
  analysisData: AnalysisData;
  amortizationSchedule: AmortizationEntry[];
}): SavedAnalysis {
  const saved: SavedAnalysis = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    ...entry,
  };
  const existing = listSavedAnalyses();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([saved, ...existing]),
  );
  return saved;
}

export function deleteSavedAnalysis(id: string): void {
  const remaining = listSavedAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}
