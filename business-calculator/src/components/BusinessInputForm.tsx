import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessInputFormProps {
  onChange?: (data: BusinessFormData) => void;
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
  deferredCompEnabled: boolean;
  deferredCompCategory: string;
  deferredCompAmount: number;
  deferredCompTerm: number;
}

interface BusinessInfo {
  ownerName: string;
  phone: string;
  email: string;
  websiteUrl: string;
  address: string;
  yearsInBusiness: string;
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

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const StepperControls = ({
  onIncrement,
  onDecrement,
}: {
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
    <button
      type="button"
      tabIndex={-1}
      onClick={onIncrement}
      className="text-[#BBB7AF] hover:text-[#f3f3f3] leading-none"
      aria-label="Increase"
    >
      <ChevronUp className="h-3 w-3" />
    </button>
    <button
      type="button"
      tabIndex={-1}
      onClick={onDecrement}
      className="text-[#BBB7AF] hover:text-[#f3f3f3] leading-none"
      aria-label="Decrease"
    >
      <ChevronDown className="h-3 w-3" />
    </button>
  </div>
);

const BusinessInputForm = ({
  onChange = () => {},
  initialData = {
    businessName: "",
    revenue: undefined,
    cashflow: undefined,
    growthRate: 5.0,
    cashflowMultiple: 2.3,
    downPaymentPercent: 20,
    interestRate: 8.0,
    loanTerm: 5,
    deferredCompEnabled: false,
    deferredCompCategory: "Advisory Fee",
    deferredCompAmount: 2000,
    deferredCompTerm: 3,
  },
}: BusinessInputFormProps) => {
  const [formData, setFormData] = React.useState<BusinessFormData>(initialData);
  const [isInfoExpanded, setIsInfoExpanded] = React.useState(false);
  const [businessInfo, setBusinessInfo] = React.useState<BusinessInfo>({
    ownerName: "",
    phone: "",
    email: "",
    websiteUrl: "",
    address: "",
    yearsInBusiness: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "revenue" || name === "cashflow" || name === "deferredCompAmount") {
      const numericValue = parseCurrencyInput(value) ?? 0;
      const updated = { ...formData, [name]: numericValue };
      setFormData(updated);
      onChange(updated);
      return;
    }

    const updated = {
      ...formData,
      [name]: name === "businessName" ? value : parseFloat(value) || 0,
    };
    setFormData(updated);
    onChange(updated);
  };

  const handleLoanTermChange = (value: string) => {
    const updated = { ...formData, loanTerm: parseInt(value) };
    setFormData(updated);
    onChange(updated);
  };

  const handleDeferredCompToggle = (checked: boolean) => {
    const updated = { ...formData, deferredCompEnabled: checked };
    setFormData(updated);
    onChange(updated);
  };

  const handleDeferredCompCategoryChange = (value: string) => {
    const updated = { ...formData, deferredCompCategory: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleDeferredCompTermChange = (value: string) => {
    const updated = { ...formData, deferredCompTerm: parseInt(value) };
    setFormData(updated);
    onChange(updated);
  };

  const handleDeferredCompAmountStep = (direction: 1 | -1) => {
    const current = formData.deferredCompAmount ?? 0;
    const next = Math.max(0, current + 100 * direction);
    const updated = { ...formData, deferredCompAmount: next };
    setFormData(updated);
    onChange(updated);
  };

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "phone" ? formatPhoneNumber(value) : value;
    setBusinessInfo((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleStep = (
    name: "growthRate" | "cashflowMultiple" | "downPaymentPercent" | "interestRate",
    step: number,
    min: number,
    max: number,
    direction: 1 | -1,
  ) => {
    const current = formData[name] ?? 0;
    const next = Math.min(
      max,
      Math.max(min, Math.round((current + step * direction) * 100) / 100),
    );
    const updated = { ...formData, [name]: next };
    setFormData(updated);
    onChange(updated);
  };

  const handleYearsStep = (direction: 1 | -1) => {
    const current = parseInt(businessInfo.yearsInBusiness, 10) || 0;
    const next = Math.max(0, current + direction);
    setBusinessInfo((prev) => ({ ...prev, yearsInBusiness: String(next) }));
  };

  const baseInputClasses =
    "!appearance-none !border-0 bg-[#333] rounded-[8px] text-[#BBB7AF] font-semibold text-[15px] placeholder:text-[#BBB7AF] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-[0_0_0_1.5px_rgba(192,255,2,0.35)]";

  return (
    <>
      <div className="w-full lg:max-w-[350px] bg-background rounded-[25px] overflow-hidden">
        <Card className="bg-[#262626]">
          <div className="pt-5 px-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF]">
              Acquisition Target
            </h2>
          </div>
          <CardContent className="pt-5">
            <div className="space-y-[9px]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="businessName" className="text-[13px]">
                    Business Name/Info
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsInfoExpanded((v) => !v)}
                    className="text-[#BBB7AF] hover:text-[#f3f3f3] transition-colors"
                    aria-label="Toggle business info"
                  >
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${isInfoExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                <Input
                  id="businessName"
                  name="businessName"
                  autoComplete="off"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={baseInputClasses}
                />
              </div>

              {isInfoExpanded && (
                <div className="space-y-[9px] pt-1">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-[13px]">
                      Owner Name
                    </Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      autoComplete="off"
                      value={businessInfo.ownerName}
                      onChange={handleBusinessInfoChange}
                      className={baseInputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[13px]">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      autoComplete="off"
                      value={businessInfo.address}
                      onChange={handleBusinessInfoChange}
                      className={baseInputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[13px]">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="off"
                      value={businessInfo.phone}
                      onChange={handleBusinessInfoChange}
                      className={baseInputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13px]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="off"
                      value={businessInfo.email}
                      onChange={handleBusinessInfoChange}
                      className={baseInputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-[13px]">
                      Website URL
                    </Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      autoComplete="off"
                      value={businessInfo.websiteUrl}
                      onChange={handleBusinessInfoChange}
                      className={baseInputClasses}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsInBusiness" className="text-[13px]">
                      Years in Business
                    </Label>
                    <div className="relative group">
                      <Input
                        id="yearsInBusiness"
                        name="yearsInBusiness"
                        type="number"
                        min="0"
                        step="1"
                        value={businessInfo.yearsInBusiness}
                        onChange={handleBusinessInfoChange}
                        className={`${baseInputClasses} pr-7`}
                      />
                      <StepperControls
                        onIncrement={() => handleYearsStep(1)}
                        onDecrement={() => handleYearsStep(-1)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:max-w-[350px] bg-background rounded-[25px] overflow-hidden">
        <Card className="bg-[#262626]">
          <div className="pt-5 px-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF]">
              Deal Terms
            </h2>
          </div>
          <CardContent className="pt-5">
            <div className="space-y-[9px]">
              <div className="space-y-2">
                <Label htmlFor="revenue" className="text-[13px]">
                  Annual Revenue
                </Label>
                <Input
                  id="revenue"
                  name="revenue"
                  value={formatCurrency(formData.revenue)}
                  onChange={handleInputChange}
                  className={baseInputClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cashflow" className="text-[13px]">
                  Annual Cashflow
                </Label>
                <Input
                  id="cashflow"
                  name="cashflow"
                  value={formatCurrency(formData.cashflow)}
                  onChange={handleInputChange}
                  className={baseInputClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="growthRate" className="text-[13px]">
                  Expected YoY Growth Rate (%)
                </Label>
                <div className="relative group">
                  <Input
                    id="growthRate"
                    name="growthRate"
                    type="number"
                    value={formData.growthRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`${baseInputClasses} pr-7`}
                  />
                  <StepperControls
                    onIncrement={() => handleStep("growthRate", 0.1, 0, 100, 1)}
                    onDecrement={() => handleStep("growthRate", 0.1, 0, 100, -1)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cashflowMultiple" className="text-[13px]">
                  Cashflow Multiple
                </Label>
                <div className="relative group">
                  <Input
                    id="cashflowMultiple"
                    name="cashflowMultiple"
                    type="number"
                    value={formData.cashflowMultiple}
                    onChange={handleInputChange}
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    className={`${baseInputClasses} pr-7`}
                  />
                  <StepperControls
                    onIncrement={() =>
                      handleStep("cashflowMultiple", 0.1, 1.0, 10.0, 1)
                    }
                    onDecrement={() =>
                      handleStep("cashflowMultiple", 0.1, 1.0, 10.0, -1)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPaymentPercent" className="text-[13px]">
                  Down Payment (%)
                </Label>
                <div className="relative group">
                  <Input
                    id="downPaymentPercent"
                    name="downPaymentPercent"
                    type="number"
                    value={formData.downPaymentPercent}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="1"
                    className={`${baseInputClasses} pr-7`}
                  />
                  <StepperControls
                    onIncrement={() =>
                      handleStep("downPaymentPercent", 1, 0, 100, 1)
                    }
                    onDecrement={() =>
                      handleStep("downPaymentPercent", 1, 0, 100, -1)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate" className="text-[13px]">
                  Interest Rate (%)
                </Label>
                <div className="relative group">
                  <Input
                    id="interestRate"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`${baseInputClasses} pr-7`}
                  />
                  <StepperControls
                    onIncrement={() => handleStep("interestRate", 0.1, 0, 100, 1)}
                    onDecrement={() =>
                      handleStep("interestRate", 0.1, 0, 100, -1)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[13px]">Loan Term (Years)</Label>
                <Select
                  value={formData.loanTerm.toString()}
                  onValueChange={handleLoanTermChange}
                >
                  <SelectTrigger className="bg-[#333] border-none rounded-[8px] text-[#BBB7AF] font-semibold text-[15px] focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="4">4 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="6">6 Years</SelectItem>
                    <SelectItem value="7">7 Years</SelectItem>
                    <SelectItem value="8">8 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:max-w-[350px] bg-background rounded-[25px] overflow-hidden">
        <Card className="bg-[#262626]">
          <div className="pt-5 px-5 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF]">
              Deferred Compensation
            </h2>
            <Switch
              checked={formData.deferredCompEnabled}
              onCheckedChange={handleDeferredCompToggle}
              aria-label="Toggle deferred compensation"
              className="data-[state=checked]:bg-[#BBB7AF]"
            />
          </div>
          <CardContent className="pt-5">
            {formData.deferredCompEnabled ? (
              <div className="space-y-[9px]">
                <div className="space-y-2">
                  <Label className="text-[13px]">Category</Label>
                  <Select
                    value={formData.deferredCompCategory}
                    onValueChange={handleDeferredCompCategoryChange}
                  >
                    <SelectTrigger className="bg-[#333] border-none rounded-[8px] text-[#BBB7AF] font-semibold text-[15px] focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Advisory Fee">Advisory Fee</SelectItem>
                      <SelectItem value="Consulting Agreement">
                        Consulting Agreement
                      </SelectItem>
                      <SelectItem value="Profit Share">Profit Share</SelectItem>
                      <SelectItem value="Seller Retention">
                        Seller Retention
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deferredCompAmount" className="text-[13px]">
                    Monthly Amount
                  </Label>
                  <div className="relative group">
                    <Input
                      id="deferredCompAmount"
                      name="deferredCompAmount"
                      value={formatCurrency(formData.deferredCompAmount)}
                      onChange={handleInputChange}
                      className={`${baseInputClasses} pr-7`}
                    />
                    <StepperControls
                      onIncrement={() => handleDeferredCompAmountStep(1)}
                      onDecrement={() => handleDeferredCompAmountStep(-1)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px]">Term (Years)</Label>
                  <Select
                    value={formData.deferredCompTerm.toString()}
                    onValueChange={handleDeferredCompTermChange}
                  >
                    <SelectTrigger className="bg-[#333] border-none rounded-[8px] text-[#BBB7AF] font-semibold text-[15px] focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} {year === 1 ? "Year" : "Years"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#BBB7AF]">
                Add a post-payoff advisory fee, consulting agreement, or
                profit share to sweeten the deal beyond the core terms.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BusinessInputForm;
