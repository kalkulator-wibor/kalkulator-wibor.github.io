import type { ExplanationStep, ExplanationContext } from '../explanationTypes';
import { formatPLN } from '../formatters';

export function explainPrincipal(ctx: ExplanationContext): ExplanationStep {
  const { row, previousBalance, input } = ctx;
  const isLastInstallment = row.number === input.loanPeriodMonths;
  const rawPrincipal = row.installment - row.interestTotal;

  return {
    id: 'principal',
    title: 'Część kapitałowa raty',
    formula: isLastInstallment
      ? 'K = S (ostatnia rata — spłata całego salda)'
      : rawPrincipal > previousBalance
        ? 'K = S (kapitał przekroczyłby saldo)'
        : 'K = R - I',
    inputs: [
      { label: 'Rata miesięczna', symbol: 'R', value: row.installment, formatted: formatPLN(row.installment) },
      { label: 'Odsetki łącznie', symbol: 'I', value: row.interestTotal, formatted: formatPLN(row.interestTotal) },
      { label: 'Saldo przed ratą', symbol: 'S', value: previousBalance, formatted: formatPLN(previousBalance) },
    ],
    result: {
      label: 'Część kapitałowa',
      symbol: 'K',
      value: row.principal,
      formatted: formatPLN(row.principal),
    },
    notes: isLastInstallment
      ? 'Ostatnia rata kredytu — spłata całego pozostałego salda.'
      : rawPrincipal > previousBalance
        ? 'Kapitał ograniczony do salda (nadwyżka ponad saldo niemożliwa).'
        : undefined,
  };
}
