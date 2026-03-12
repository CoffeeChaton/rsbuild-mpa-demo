import { createContext, useContext } from "react";
import type { TEditor } from "../type";

interface IPlanContext {
  planName: string;
  setPlanName: (v: string) => void;
  customPlans: Record<string, string>;
  setCustomPlans: (v: Record<string, string>) => void;
  tsvB: string;
  setEditorOpen: (open: boolean, data?: Partial<TEditor>) => void;
}

export const PlanContext = createContext<IPlanContext | null>(null);

export function usePlanContext(): IPlanContext {
  const ctx = useContext(PlanContext);

  if (!ctx) {
    throw new Error("usePlanContext must be used inside PlanContext");
  }

  return ctx;
}
