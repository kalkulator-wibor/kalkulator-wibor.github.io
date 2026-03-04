import type { InstallmentExplanation, ExplanationContext, ExplanationStep } from '../explanationTypes';
import type { InstallmentRow, LoanInput } from '../calculations';
import { formatDate } from '../formatters';
import { explainWiborLookup } from './wiborLookup';
import { explainInterest } from './interestCalc';
import { explainAnnuity } from './annuityCalc';
import { explainPrincipal } from './principalDerivation';
import { explainBalance } from './balanceProgression';

/**
 * Generuje pełne wyjaśnienie obliczeniowe dla jednej raty.
 * Kontekst rekonstruowany z tablicy harmonogramu — brak zmian w calculateLoan().
 *
 * UWAGA: detekcja resetu WIBOR opiera się na (row.number - 1) % 3 === 0,
 * co odpowiada logice monthsSinceReset w calculations.ts (linia 122-128).
 * Jeśli ta logika się zmieni, trzeba zaktualizować ten moduł.
 */
export function generateExplanation(
  row: InstallmentRow,
  schedule: InstallmentRow[],
  input: LoanInput,
): InstallmentExplanation {
  const rowIndex = row.number - 1;
  const previousBalance = rowIndex === 0
    ? input.loanAmount
    : schedule[rowIndex - 1].remainingBalance;

  const isResetPeriod = (row.number - 1) % 3 === 0;
  const remainingMonths = input.loanPeriodMonths - row.number + 1;
  const bridgeActive = input.bridgeEndDate ? row.date <= input.bridgeEndDate : false;
  const effectiveBridgeMargin = bridgeActive ? input.bridgeMargin : 0;
  const annuityRate = row.wiborRate + input.margin + effectiveBridgeMargin;

  const ctx: ExplanationContext = {
    row,
    input,
    previousBalance,
    remainingMonths,
    wiborResetInfo: {
      wasReset: isResetPeriod,
      resetReason: row.number === 1 ? 'pierwsza rata' : 'odświeżenie co 3 miesiące',
      lookupDate: row.date,
    },
    bridgeActive,
    effectiveBridgeMargin,
    annuityRate,
  };

  const steps: ExplanationStep[] = [
    explainWiborLookup(ctx),
    explainAnnuity(ctx),
    ...explainInterest(ctx),
    explainPrincipal(ctx),
    explainBalance(ctx),
  ];

  return {
    installmentNumber: row.number,
    date: formatDate(row.date),
    steps,
  };
}
