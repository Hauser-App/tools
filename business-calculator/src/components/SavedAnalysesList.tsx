import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, FolderOpen } from "lucide-react";
import type { SavedAnalysis } from "@/lib/savedAnalyses";

interface SavedAnalysesListProps {
  analyses: SavedAnalysis[];
  onLoad: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const SavedAnalysesList = ({
  analyses,
  onLoad,
  onDelete,
}: SavedAnalysesListProps) => {
  return (
    <div className="w-full lg:max-w-[350px] bg-background rounded-[25px] overflow-hidden">
      <Card className="bg-[#262626]">
        <div className="flex flex-col p-5">
          <div className="flex items-center gap-2 pb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#BBB7AF]">
              Saved Analyses
            </span>
          </div>

          {analyses.length === 0 ? (
            <p className="text-[#BBB7AF] text-xs py-6">
              No saved analyses yet. Run an analysis and click "Save Analysis"
              to keep it here.
            </p>
          ) : (
            <ul className="divide-y divide-[#3a3a3a] max-h-[360px] overflow-y-auto">
              {analyses.map((analysis) => (
                <li
                  key={analysis.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[#BBB7AF] text-sm font-semibold truncate">
                      {analysis.formData.businessName || "Untitled Business"}
                    </p>
                    <p className="text-[#BBB7AF] text-xs">
                      {new Date(analysis.savedAt).toLocaleString()} ·{" "}
                      {formatCurrency(analysis.analysisData.metrics.valuation)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#BBB7AF] hover:text-[#BBB7AF] hover:bg-[#3a3a3a]"
                      onClick={() => onLoad(analysis)}
                      aria-label="Load analysis"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#E47192] hover:text-[#E47192] hover:bg-[#3a3a3a]"
                      onClick={() => onDelete(analysis.id)}
                      aria-label="Delete analysis"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SavedAnalysesList;
