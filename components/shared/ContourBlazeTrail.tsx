"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

export type ContourBlazeStage = "requested" | "approved" | "picked-up" | "returned" | "cancelled" | "rejected";

const STAGES: Array<{ key: ContourBlazeStage; label: string }> = [
  { key: "requested", label: "Requested" },
  { key: "approved", label: "Approved" },
  { key: "picked-up", label: "Picked up" },
  { key: "returned", label: "Returned" },
];

function getStageIndex(status: string) {
  const normalized = status?.toLowerCase() ?? "requested";
  if (normalized.includes("cancel")) return 5;
  if (normalized.includes("reject")) return 5;
  if (normalized.includes("return")) return 3;
  if (normalized.includes("pick")) return 2;
  if (normalized.includes("approve")) return 1;
  return 0;
}

export function ContourBlazeTrail({ status }: { status: string }) {
  const [activeIndex, setActiveIndex] = useState(getStageIndex(status));
  const completed = useMemo(() => Math.max(0, Math.min(activeIndex, STAGES.length - 1)), [activeIndex]);

  useEffect(() => {
    setActiveIndex(getStageIndex(status));
  }, [status]);

  const isCancelled = status?.toLowerCase().includes("cancel") || status?.toLowerCase().includes("reject");
  const showBranch = isCancelled;
  const branchLabel = status?.toLowerCase().includes("cancel") ? "Cancelled" : "Rejected";

  return (
    <div className="w-full">
      <div className="relative mt-3 flex items-center gap-2">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent transition-all duration-300"
          style={{ width: `${(completed / (STAGES.length - 1)) * 100}%` }}
        />
        {STAGES.map((stage, index) => {
          const isComplete = index <= completed;
          const isCurrent = index === completed;
          return (
            <div key={stage.key} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              ) : (
                <Circle className={`h-5 w-5 ${isCurrent ? "text-accent" : "text-muted-foreground"}`} />
              )}
              <span className={`text-[11px] ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>{stage.label}</span>
            </div>
          );
        })}
      </div>
      {showBranch ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {status?.toLowerCase().includes("cancel") ? <XCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span>{branchLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
