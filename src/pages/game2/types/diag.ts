import type { IInventory } from "./inventory";
import type { IRowResult } from "./rowResult";

export type DiagnosticTone = "error" | "info" | "success";
export type DiagnosticEmphasis = "quiet" | "normal" | "loud";

export interface IDiagnosticEntry {
  id: string;
  type: DiagnosticTone;
  message: string;
  emphasis?: DiagnosticEmphasis;
}

export interface IDiagnosticPanelProps {
  rows: IRowResult[];
  inventory: IInventory;
}
