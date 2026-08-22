import React, { useState } from "react";
import BusinessInputForm from "./BusinessInputForm";
import AnalysisResults from "./AnalysisResults";
import ResultsSkeleton from "./ResultsSkeleton";
import SavedAnalysesList from "./SavedAnalysesList";
import { Button } from "./ui/button";
import { Printer, Save } from "lucide-react";
import { Toaster } from "./ui/toaster";
import { useToast } from "./ui/use-toast";
import {
  listSavedAnalyses,
  saveAnalysis,
  deleteSavedAnalysis,
  type BusinessFormData,
  type AnalysisData,
  type AmortizationEntry,
  type SavedAnalysis,
} from "@/lib/savedAnalyses";

const Home = () => {
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<
    AmortizationEntry[]
  >([]);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(() =>
    listSavedAnalyses(),
  );
  const [formKey, setFormKey] = useState(0);

  const calculateAmortization = (
    principal: number,
    rate: number,
    years: number,
  ) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      const principalPart = monthlyPayment - interest;
      balance -= principalPart;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPart,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return { schedule, monthlyPayment };
  };

  const handleAnalysis = (data: BusinessFormData) => {
    setFormData(data);

    if (!data.cashflow || data.cashflow <= 0) {
      setShowResults(false);
      return;
    }

    const valuation = data.cashflow * data.cashflowMultiple;
    const downPayment = (valuation * data.downPaymentPercent) / 100;
    const financedAmount = valuation - downPayment;

    const { schedule, monthlyPayment } = calculateAmortization(
      financedAmount,
      data.interestRate,
      data.loanTerm,
    );

    const monthlyPrincipal = schedule[0].principal;
    const monthlyInterest = schedule[0].interest;

    const annualDebtService = monthlyPayment * 12;
    const cashOnCash =
      ((data.cashflow - annualDebtService) / downPayment) * 100;
    const dscr = data.cashflow / annualDebtService;

    // Calculate standard ROI
    const standardRoi = (data.cashflow / valuation) * 100;

    // Calculate debt-adjusted ROI
    const totalInterest = schedule.reduce(
      (sum, month) => sum + month.interest,
      0,
    );
    const averageAnnualInterest = totalInterest / data.loanTerm;
    const debtAdjustedRoi =
      ((data.cashflow - averageAnnualInterest) / valuation) * 100;

    const analysisResult: AnalysisData = {
      businessName: data.businessName,
      status: cashOnCash >= 40 ? "GO" : "NO-GO",
      metrics: {
        cashOnCash,
        multipleOfCashflow: data.cashflowMultiple,
        roi: standardRoi,
        debtAdjustedRoi,
        dscr,
        annualCashflow: data.cashflow,
        monthlyPrincipal,
        monthlyInterest,
        valuation,
        financedAmount,
        monthlyPayment,
      },
    };

    setAnalysisData(analysisResult);
    setAmortizationSchedule(schedule);
    setShowResults(true);
  };

  const handleSave = () => {
    if (!formData || !analysisData) return;
    saveAnalysis({ formData, analysisData, amortizationSchedule });
    setSavedAnalyses(listSavedAnalyses());
    toast({ title: "Analysis saved" });
  };

  const handleExport = () => {
    window.print();
  };

  const handleLoad = (saved: SavedAnalysis) => {
    setFormData(saved.formData);
    setAnalysisData(saved.analysisData);
    setAmortizationSchedule(saved.amortizationSchedule);
    setShowResults(true);
    setFormKey((key) => key + 1);
  };

  const handleDelete = (id: string) => {
    deleteSavedAnalysis(id);
    setSavedAnalyses(listSavedAnalyses());
  };

  return (
    <div className="min-h-screen bg-[#BBB7AF] text-white p-[10px] pb-[86px] lg:p-8">
      <div className="lg:hidden fixed bottom-[calc(10px+env(safe-area-inset-bottom))] left-[10px] right-[10px] z-50 flex items-center justify-between gap-[10px] rounded-[20px] bg-[#262626]/70 backdrop-blur-md p-[10px] no-print">
        <img
          src="/images/hauser-logo.svg"
          alt="Hauser"
          className="h-[20px] w-auto ml-[10px]"
        />
        {showResults && (
          <div className="flex items-center gap-[10px]">
            <Button
              className="text-[#262626] bg-[#ddd8cf]/70 backdrop-blur-sm hover:bg-[#ddd8cf]/85 h-9 px-2.5"
              onClick={handleExport}
              aria-label="Export report"
            >
              <Printer className="h-4 w-4" />
              <span className="h-4 w-px bg-[#262626]/30 mx-[10px]" />
              <span className="text-[13px] font-bold">PDF</span>
            </Button>
            <Button
              size="icon"
              className="text-[#262626] bg-[#ddd8cf]/70 backdrop-blur-sm hover:bg-[#ddd8cf]/85"
              onClick={handleSave}
              aria-label="Save analysis"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="max-w-[1680px] mx-auto space-y-[10px] lg:space-y-[20px]">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-[10px] lg:gap-[30px]">
          <div
            className={`lg:sticky lg:top-8 ${showResults ? "lg:mt-[24px]" : ""} lg:h-fit space-y-[10px] lg:space-y-[20px] no-print`}
          >
            <img
              src="/images/hauser-logo.svg"
              alt="Hauser"
              className="hidden lg:block h-9 w-auto mt-[8px] lg:ml-[20px] lg:-mb-[8px]"
            />
            <BusinessInputForm
              key={formKey}
              onChange={handleAnalysis}
              initialData={formData ?? undefined}
            />
            <SavedAnalysesList
              analyses={savedAnalyses}
              onLoad={handleLoad}
              onDelete={handleDelete}
            />
          </div>

          <div>
            {showResults && formData && analysisData ? (
              <AnalysisResults
                businessName={analysisData.businessName}
                status={analysisData.status}
                metrics={analysisData.metrics}
                dealInputs={{
                  downPaymentPercent: formData.downPaymentPercent,
                  interestRate: formData.interestRate,
                  loanTerm: formData.loanTerm,
                  growthRate: formData.growthRate,
                  cashflowMultiple: formData.cashflowMultiple,
                }}
                amortizationSchedule={amortizationSchedule}
                onSave={handleSave}
                onExport={handleExport}
              />
            ) : (
              <ResultsSkeleton />
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
