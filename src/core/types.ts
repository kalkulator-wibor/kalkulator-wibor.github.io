import type { WiborEntry } from '../utils/calculations';

export interface StoredLoanInput {
  loanAmount: number;
  margin: number;
  loanPeriodMonths: number;
  startDate: string;
  bridgeMargin: number;
  bridgeEndDate: string | null;
  paymentDay: number;
}

export interface PlaintiffData {
  name: string;
  address: string;
  pesel: string;
}

export interface LawsuitData {
  plaintiff: PlaintiffData;
  courtName: string;
  demandDate: string | null;
  evidenceChecklist: Record<string, boolean>;
}

export const EVIDENCE_ITEMS: Record<string, string> = {
  contract: 'Umowa kredytu',
  annexes: 'Aneksy do umowy',
  certificate: 'Zaświadczenie z banku o historii spłat',
  esis: 'Formularz ESIS (jeśli otrzymany)',
  demand: 'Wezwanie do zapłaty (kopia)',
  demandProof: 'Potwierdzenie nadania wezwania',
  repaymentHistory: 'Historia spłat rat kredytu',
};

export interface Case {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  input: StoredLoanInput;
  templateId: string | null;
  wiborDatasetId: string | null;
  lawsuit: LawsuitData;
}

export interface WiborDataset {
  id: string;
  name: string;
  createdAt: string;
  entries: WiborEntry[];
}
