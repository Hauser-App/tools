import React from "react";
import { Card } from "./ui/card";
import { LineChart, BarChart, Table as TableIcon } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AnalysisChartsProps {
  cashFlowData?: ChartData;
  roiData?: ChartData;
  amortizationSchedule?: AmortizationEntry[];
}

const defaultCashFlowData: ChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Projected Cash Flow ($)",
      data: [
        5000, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8200, 8500, 8800, 9000,
      ],
    },
  ],
};

const defaultRoiData: ChartData = {
  labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
  datasets: [
    {
      label: "ROI Projection (%)",
      data: [15, 22, 28, 35, 42],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    tooltip: { backgroundColor: "#262626" },
    legend: {
      position: "top" as const,
      align: "end" as const,
      padding: 24,
      labels: {
        color: "#BBB7AF",
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.2)",
      },
      ticks: {
        color: "#BBB7AF",
      },
      title: {
        display: true,
        text: "Time Period",
        color: "#BBB7AF",
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.2)",
      },
      ticks: {
        color: "#BBB7AF",
        callback: (value: number) => {
          return value + (value.toString().includes("%") ? "%" : "$");
        },
      },
      title: {
        display: true,
        text: "Value",
        color: "#BBB7AF",
      },
    },
  },
};

const getChartDataset = (data: ChartData, isROI: boolean) => ({
  labels: data.labels,
  datasets: data.datasets.map((dataset) => ({
    ...dataset,
    borderColor: "#c0ff02",
    backgroundColor: "rgb(192, 255, 2)",
  })),
});

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AnalysisCharts = ({
  cashFlowData = defaultCashFlowData,
  roiData = defaultRoiData,
  amortizationSchedule = [],
}: AnalysisChartsProps) => {
  const totals = amortizationSchedule.reduce(
    (acc, entry) => ({
      principal: acc.principal + entry.principal,
      interest: acc.interest + entry.interest,
      payment: acc.payment + entry.payment,
    }),
    { principal: 0, interest: 0, payment: 0 },
  );

  return (
    <div className="w-full bg-[#BBB7AF] p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#262626] text-white border-none">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="h-5 w-5 text-[#C0FF02]" />
            <h3 className="font-semibold text-lg">Cash Flow Projection</h3>
          </div>
          <div className="mb-6">
            <div className="h-[280px]">
              <Line
                options={chartOptions}
                data={getChartDataset(cashFlowData, false)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#262626] text-white border-none">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-[#C0FF02]" />
            <h3 className="font-semibold text-lg">ROI Analysis</h3>
          </div>
          <div className="mb-6">
            <div className="h-[280px]">
              <Bar
                options={chartOptions}
                data={getChartDataset(roiData, true)}
              />
            </div>
          </div>
        </Card>
      </div>
      {amortizationSchedule.length > 0 && (
        <Card className="p-6 bg-[#262626] text-white border-none">
          <div className="flex items-center gap-2 mb-4">
            <TableIcon className="h-5 w-5 text-[#C0FF02]" />
            <h3 className="font-semibold text-lg">Amortization Schedule</h3>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="h-8 hover:bg-transparent">
                  <TableHead className="text-white h-8 py-2">Month</TableHead>
                  <TableHead className="text-white h-8 py-2">Payment</TableHead>
                  <TableHead className="text-white h-8 py-2">
                    Principal
                  </TableHead>
                  <TableHead className="text-white h-8 py-2">
                    Interest
                  </TableHead>
                  <TableHead className="text-white h-8 py-2">
                    Remaining Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationSchedule.map((entry) => (
                  <TableRow
                    key={entry.month}
                    className="h-8 hover:bg-transparent"
                  >
                    <TableCell className="text-white py-1">
                      {entry.month}
                    </TableCell>
                    <TableCell className="text-white py-1">
                      {formatCurrency(entry.payment)}
                    </TableCell>
                    <TableCell className="text-white py-1">
                      {formatCurrency(entry.principal)}
                    </TableCell>
                    <TableCell className="text-white py-1">
                      {formatCurrency(entry.interest)}
                    </TableCell>
                    <TableCell className="text-white py-1">
                      {formatCurrency(entry.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="h-8 hover:bg-transparent">
                  <TableCell className="text-white font-bold py-1">
                    Totals
                  </TableCell>
                  <TableCell className="text-white font-bold py-1">
                    {formatCurrency(totals.payment)}
                  </TableCell>
                  <TableCell className="text-white font-bold py-1">
                    {formatCurrency(totals.principal)}
                  </TableCell>
                  <TableCell className="text-white font-bold py-1">
                    {formatCurrency(totals.interest)}
                  </TableCell>
                  <TableCell className="text-white font-bold py-1"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisCharts;
