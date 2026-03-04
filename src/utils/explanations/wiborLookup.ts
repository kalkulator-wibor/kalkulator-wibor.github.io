import type { ExplanationStep, ExplanationContext } from '../explanationTypes';
import { formatPercent, formatDate } from '../formatters';

export function explainWiborLookup(ctx: ExplanationContext): ExplanationStep {
  const { row, wiborResetInfo } = ctx;
  const lookupDateStr = formatDate(wiborResetInfo.lookupDate);

  return {
    id: 'wibor-lookup',
    title: 'Stawka WIBOR 3M',
    formula: wiborResetInfo.wasReset
      ? `WIBOR = odczyt z tabeli na dzień ${lookupDateStr}`
      : 'WIBOR = bez zmiany (reset co 3 miesiące)',
    inputs: [
      {
        label: 'Data odczytu',
        symbol: 'D',
        value: wiborResetInfo.lookupDate.getTime(),
        formatted: lookupDateStr,
        source: wiborResetInfo.resetReason,
      },
    ],
    result: {
      label: 'Stawka WIBOR 3M',
      symbol: 'W',
      value: row.wiborRate,
      formatted: formatPercent(row.wiborRate),
      source: 'Tabela historyczna WIBOR 3M',
    },
    notes: wiborResetInfo.wasReset
      ? `Stawka odświeżona w tej racie (${wiborResetInfo.resetReason}).`
      : 'Stawka przeniesiona z poprzedniego okresu.',
  };
}
