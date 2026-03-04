import type { InstallmentRow, LoanInput } from './calculations';

/** Pojedyncza nazwana wartość wejściowa/wyjściowa */
export interface NamedValue {
  label: string;
  symbol: string;
  value: number;
  formatted: string;
  source?: string;
}

/** Jeden atomowy krok obliczeniowy */
export interface ExplanationStep {
  id: string;
  title: string;
  formula: string;
  inputs: NamedValue[];
  result: NamedValue;
  notes?: string;
}

/** Pełne wyjaśnienie jednej raty */
export interface InstallmentExplanation {
  installmentNumber: number;
  date: string;
  steps: ExplanationStep[];
}

/** Kontekst potrzebny do wygenerowania wyjaśnień — budowany on-demand */
export interface ExplanationContext {
  row: InstallmentRow;
  input: LoanInput;
  previousBalance: number;
  remainingMonths: number;
  wiborResetInfo: {
    wasReset: boolean;
    resetReason: string;
    lookupDate: Date;
  };
  bridgeActive: boolean;
  effectiveBridgeMargin: number;
  annuityRate: number;
}
