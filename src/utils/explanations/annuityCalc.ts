import type { ExplanationStep, ExplanationContext } from '../explanationTypes';
import { formatPLN, formatPercent } from '../formatters';

export function explainAnnuity(ctx: ExplanationContext): ExplanationStep {
  const { previousBalance, annuityRate, remainingMonths, row } = ctx;
  const r = annuityRate / 100 / 12;
  const f = Math.pow(1 + r, remainingMonths);

  return {
    id: 'annuity',
    title: 'Rata annuitetowa (równa)',
    formula: 'R = S × (r × (1+r)^n) / ((1+r)^n - 1)',
    inputs: [
      { label: 'Saldo początkowe', symbol: 'S', value: previousBalance, formatted: formatPLN(previousBalance) },
      {
        label: 'Roczna stopa procentowa',
        symbol: 'p',
        value: annuityRate,
        formatted: formatPercent(annuityRate),
        source: `WIBOR ${formatPercent(row.wiborRate)} + marża ${formatPercent(ctx.input.margin)}` +
          (ctx.bridgeActive ? ` + pomostowa ${formatPercent(ctx.effectiveBridgeMargin)}` : ''),
      },
      { label: 'Stopa miesięczna (p/100/12)', symbol: 'r', value: r, formatted: r.toFixed(8) },
      { label: 'Pozostałe raty', symbol: 'n', value: remainingMonths, formatted: `${remainingMonths} mies.` },
      { label: '(1+r)^n', symbol: 'f', value: f, formatted: f.toFixed(8) },
    ],
    result: {
      label: 'Rata miesięczna',
      symbol: 'R',
      value: row.installment,
      formatted: formatPLN(row.installment),
    },
    notes: annuityRate <= 0
      ? 'Stopa <= 0, rata obliczona jako S / n (równomierny podział salda).'
      : ctx.wiborResetInfo.wasReset
        ? 'Rata przeliczona po odświeżeniu stawki WIBOR.'
        : 'Rata bez zmian (WIBOR nie był odświeżony w tym okresie).',
  };
}
