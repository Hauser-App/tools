import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Percent,
  Building,
  Calculator,
  Clock,
  ArrowUpCircle,
} from "lucide-react";

interface BusinessInputFormProps {
  onSubmit?: (data: BusinessFormData) => void;
  initialData?: BusinessFormData;
}

interface BusinessFormData {
  businessName: string;
  revenue: number;
  cashflow: number;
  growthRate: number;
  cashflowMultiple: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
}

const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return "";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const parseCurrencyInput = (value: string): number | undefined => {
  const numericValue = value.replace(/[^0-9.-]+/g, "");
  if (numericValue === "") return undefined;
  return parseFloat(numericValue);
};

const BusinessInputForm = ({
  onSubmit = () => {},
  initialData = {
    businessName: "",
    revenue: undefined,
    cashflow: undefined,
    growthRate: 5.0,
    cashflowMultiple: 2.3,
    downPaymentPercent: 20,
    interestRate: 8.0,
    loanTerm: 5,
  },
}: BusinessInputFormProps) => {
  const [formData, setFormData] = React.useState<BusinessFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "revenue" || name === "cashflow") {
      const numericValue = parseCurrencyInput(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "businessName" ? value : parseFloat(value) || 0,
    }));
  };

  const handleLoanTermChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      loanTerm: parseInt(value),
    }));
  };

  const inputClasses =
    "bg-[#3a3a3a] border-none text-white text-base placeholder:text-base";

  return (
    <div className="w-full max-w-[600px] bg-background pb-2 rounded-[20px] overflow-hidden">
      <Card className="bg-[#262626] border-none">
        <div className="pt-6 px-6">
          <h2 className="font-bold text-white text-xl">Acquisition Target</h2>
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#c0ff02]" />
                <Label htmlFor="businessName" className="text-base font-normal">
                  Business Name
                </Label>
              </div>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Enter business name"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#c0ff02]" />
                <Label htmlFor="revenue" className="text-base font-normal">
                  Annual Revenue
                </Label>
              </div>
              <Input
                id="revenue"
                name="revenue"
                value={formatCurrency(formData.revenue)}
                onChange={handleInputChange}
                placeholder="Enter annual revenue"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#c0ff02]" />
                <Label htmlFor="cashflow" className="text-base font-normal">
                  Annual Cashflow
                </Label>
              </div>
              <Input
                id="cashflow"
                name="cashflow"
                value={formatCurrency(formData.cashflow)}
                onChange={handleInputChange}
                placeholder="Enter annual cashflow"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-[#c0ff02]" />
                <Label htmlFor="growthRate" className="text-base font-normal">
                  Expected YoY Growth Rate (%)
                </Label>
              </div>
              <Input
                id="growthRate"
                name="growthRate"
                type="number"
                value={formData.growthRate}
                onChange={handleInputChange}
                placeholder="5.0"
                min="0"
                max="100"
                step="0.1"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-[#c0ff02]" />
                <Label
                  htmlFor="cashflowMultiple"
                  className="text-base font-normal"
                >
                  Cashflow Multiple
                </Label>
              </div>
              <Input
                id="cashflowMultiple"
                name="cashflowMultiple"
                type="number"
                value={formData.cashflowMultiple}
                onChange={handleInputChange}
                placeholder="2.3"
                min="1.0"
                max="10.0"
                step="0.1"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-[#c0ff02]" />
                <Label
                  htmlFor="downPaymentPercent"
                  className="text-base font-normal"
                >
                  Down Payment (%)
                </Label>
              </div>
              <Input
                id="downPaymentPercent"
                name="downPaymentPercent"
                type="number"
                value={formData.downPaymentPercent}
                onChange={handleInputChange}
                placeholder="20"
                min="0"
                max="100"
                step="1"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-[#c0ff02]" />
                <Label htmlFor="interestRate" className="text-base font-normal">
                  Interest Rate (%)
                </Label>
              </div>
              <Input
                id="interestRate"
                name="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={handleInputChange}
                placeholder="8.0"
                min="0"
                max="100"
                step="0.1"
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#c0ff02]" />
                <Label className="text-base font-normal">
                  Loan Term (Years)
                </Label>
              </div>
              <Select
                value={formData.loanTerm.toString()}
                onValueChange={handleLoanTermChange}
              >
                <SelectTrigger className="bg-[#3a3a3a] border-none text-white text-base">
                  <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Years</SelectItem>
                  <SelectItem value="5">5 Years</SelectItem>
                  <SelectItem value="6">6 Years</SelectItem>
                  <SelectItem value="7">7 Years</SelectItem>
                  <SelectItem value="8">8 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#c0ff02] hover:bg-[#c0ff02]/90 text-black"
            >
              Run Analysis
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInputForm;
