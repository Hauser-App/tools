import React, { useState } from "react";
import { Card } from "./ui/card";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AnalysisChartsProps {
  amortizationSchedule?: AmortizationEntry[];
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const AnalysisCharts = ({ amortizationSchedule = [] }: AnalysisChartsProps) => {
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

  const totals = amortizationSchedule.reduce(
    (acc, entry) => ({
      principal: acc.principal + entry.principal,
      interest: acc.interest + entry.interest,
      payment: acc.payment + entry.payment,
    }),
    { principal: 0, interest: 0, payment: 0 },
  );

  if (amortizationSchedule.length === 0) return null;

  return (
    <div className="w-full bg-[#BBB7AF]">
      <Card className="p-5 bg-[#262626] text-[#BBB7AF]">
        <button
          type="button"
          onClick={() => setIsScheduleExpanded((v) => !v)}
          className="flex items-center gap-2 w-full text-left"
        >
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em]">
            Amortization Schedule
          </h3>
          <ChevronDown
            className={`h-4 w-4 ml-auto transition-transform ${isScheduleExpanded ? "rotate-180" : ""}`}
          />
        </button>
        {isScheduleExpanded && (
          <Table className="mt-4">
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="h-8 hover:bg-transparent">
                <TableHead className="text-[#BBB7AF] h-8 py-2">Month</TableHead>
                <TableHead className="text-[#BBB7AF] h-8 py-2">Payment</TableHead>
                <TableHead className="text-[#BBB7AF] h-8 py-2">
                  Principal
                </TableHead>
                <TableHead className="text-[#BBB7AF] h-8 py-2">
                  Interest
                </TableHead>
                <TableHead className="text-[#BBB7AF] h-8 py-2">
                  Remaining Balance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:border-0">
              {amortizationSchedule.map((entry) => (
                <TableRow key={entry.month} className="h-8 hover:bg-transparent">
                  <TableCell className="text-[#BBB7AF] py-1">
                    {entry.month}
                  </TableCell>
                  <TableCell className="text-[#BBB7AF] py-1">
                    {formatCurrency(entry.payment)}
                  </TableCell>
                  <TableCell className="text-[#BBB7AF] py-1">
                    {formatCurrency(entry.principal)}
                  </TableCell>
                  <TableCell className="text-[#BBB7AF] py-1">
                    {formatCurrency(entry.interest)}
                  </TableCell>
                  <TableCell className="text-[#BBB7AF] py-1">
                    {formatCurrency(entry.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow className="h-8 hover:bg-transparent">
                <TableCell className="text-[#BBB7AF] font-bold py-1">
                  Totals
                </TableCell>
                <TableCell className="text-[#BBB7AF] font-bold py-1">
                  {formatCurrency(totals.payment)}
                </TableCell>
                <TableCell className="text-[#BBB7AF] font-bold py-1">
                  {formatCurrency(totals.principal)}
                </TableCell>
                <TableCell className="text-[#BBB7AF] font-bold py-1">
                  {formatCurrency(totals.interest)}
                </TableCell>
                <TableCell className="text-[#BBB7AF] font-bold py-1"></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AnalysisCharts;
