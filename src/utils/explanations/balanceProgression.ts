import type { ExplanationStep, ExplanationContext } from '../explanationTypes';
import { formatPLN } from '../formatters';

export function explainBalance(ctx: ExplanationContext): ExplanationStep {
  const { row, previousBalance } = ctx;

  return {
    id: 'balance',
    title: 'Saldo po racie',
    formula: 'S_nowe = S - K',
    inputs: [
      { label: 'Saldo przed ratą', symbol: 'S', value: previousBalance, formatted: formatPLN(previousBalance) },
      { label: 'Część kapitałowa', symbol: 'K', value: row.principal, formatted: formatPLN(row.principal) },
    ],
    result: {
      label: 'Saldo po racie',
      symbol: 'S_nowe',
      value: row.remainingBalance,
      formatted: formatPLN(row.remainingBalance),
    },
  };
}
