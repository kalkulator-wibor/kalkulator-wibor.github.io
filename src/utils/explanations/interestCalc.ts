import type { ExplanationStep, ExplanationContext } from '../explanationTypes';
import { formatPLN, formatPercent } from '../formatters';

function makeInterestStep(
  id: string,
  title: string,
  balance: number,
  ratePct: number,
  rateLabel: string,
  rateSymbol: string,
  days: number,
  result: number,
): ExplanationStep {
  return {
    id,
    title,
    formula: `${rateSymbol}_ods = S × (${rateSymbol} / 100) × d / 360`,
    inputs: [
      { label: 'Saldo początkowe', symbol: 'S', value: balance, formatted: formatPLN(balance) },
      { label: rateLabel, symbol: rateSymbol, value: ratePct, formatted: formatPercent(ratePct) },
      { label: 'Liczba dni w okresie', symbol: 'd', value: days, formatted: `${days} dni` },
      { label: 'Baza odsetkowa', symbol: '360', value: 360, formatted: '360 dni (konwencja bankowa)' },
    ],
    result: {
      label: `Odsetki (${rateLabel.toLowerCase()})`,
      symbol: `${rateSymbol}_ods`,
      value: result,
      formatted: formatPLN(result),
    },
  };
}

export function explainInterest(ctx: ExplanationContext): ExplanationStep[] {
  const { row, previousBalance } = ctx;
  const steps: ExplanationStep[] = [];

  steps.push(makeInterestStep(
    'interest-wibor', 'Odsetki od WIBOR',
    previousBalance, row.wiborRate, 'WIBOR 3M', 'W', row.days, row.interestWibor,
  ));

  steps.push(makeInterestStep(
    'interest-margin', 'Odsetki od marży banku',
    previousBalance, ctx.input.margin, 'Marża banku', 'M', row.days, row.interestMargin,
  ));

  if (ctx.bridgeActive && ctx.effectiveBridgeMargin > 0) {
    steps.push(makeInterestStep(
      'interest-bridge', 'Odsetki od marży pomostowej',
      previousBalance, ctx.effectiveBridgeMargin, 'Marża pomostowa', 'B',
      row.days, row.interestBridge,
    ));
  }

  steps.push({
    id: 'interest-total',
    title: 'Odsetki łącznie',
    formula: 'I = I_W + I_M' + (ctx.bridgeActive ? ' + I_B' : ''),
    inputs: [
      { label: 'Odsetki WIBOR', symbol: 'I_W', value: row.interestWibor, formatted: formatPLN(row.interestWibor) },
      { label: 'Odsetki marża', symbol: 'I_M', value: row.interestMargin, formatted: formatPLN(row.interestMargin) },
      ...(ctx.bridgeActive && ctx.effectiveBridgeMargin > 0 ? [{
        label: 'Odsetki pomostowe', symbol: 'I_B', value: row.interestBridge, formatted: formatPLN(row.interestBridge),
      }] : []),
    ],
    result: {
      label: 'Odsetki łącznie',
      symbol: 'I',
      value: row.interestTotal,
      formatted: formatPLN(row.interestTotal),
    },
  });

  return steps;
}
