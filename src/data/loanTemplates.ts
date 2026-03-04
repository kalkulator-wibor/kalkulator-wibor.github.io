export interface LoanTemplate {
  id: string;
  label: string;
  bank: string;
  period: string;
  loanAmount: number;
  margin: number;
  bridgeMargin: number;
  loanPeriodMonths: number;
  wiborType: '3M' | '6M';
  rateType: 'equal' | 'decreasing';
  interestMethod: '365/360' | '30/360';
  commission: number;
  notes: string;
}

const defaults = { wiborType: '3M' as const, rateType: 'equal' as const, interestMethod: '365/360' as const, bridgeMargin: 0, commission: 0 };

function tpl(t: Omit<LoanTemplate, 'wiborType' | 'rateType' | 'interestMethod' | 'bridgeMargin' | 'commission'> & Partial<Pick<LoanTemplate, 'wiborType' | 'rateType' | 'interestMethod' | 'bridgeMargin' | 'commission'>>): LoanTemplate {
  return { ...defaults, ...t };
}

export const LOAN_TEMPLATES: LoanTemplate[] = [
  tpl({ id: 'santander-2015', label: 'Santander (BZ WBK) ~2015', bank: 'Santander Bank Polska (d. BZ WBK)', period: '2013-2017',
    loanAmount: 200000, margin: 2.09, bridgeMargin: 1.00, loanPeriodMonths: 300, commission: 2.50,
    notes: 'Art. 3.05 - WIBOR 3M + marża. Pomostowa do wpisu hipoteki.' }),
  tpl({ id: 'santander-2018', label: 'Santander ~2018-2020', bank: 'Santander Bank Polska', period: '2018-2020',
    loanAmount: 300000, margin: 1.89, loanPeriodMonths: 360, notes: 'Oferta bez prowizji, bez marży pomostowej.' }),
  tpl({ id: 'pko-2014', label: 'PKO BP ~2014', bank: 'PKO Bank Polski', period: '2012-2015',
    loanAmount: 250000, margin: 1.65, bridgeMargin: 1.50, loanPeriodMonths: 360, commission: 1.50,
    notes: 'Kredyt Własny Kąt. Wysoka marża pomostowa do wpisu hipoteki.' }),
  tpl({ id: 'pko-2019', label: 'PKO BP ~2019-2021', bank: 'PKO Bank Polski', period: '2019-2021',
    loanAmount: 350000, margin: 1.99, loanPeriodMonths: 300, notes: 'Kredyt mieszkaniowy Własny Kąt Hipoteczny.' }),
  tpl({ id: 'mbank-2015', label: 'mBank ~2015', bank: 'mBank (d. BRE Bank)', period: '2013-2016',
    loanAmount: 300000, margin: 1.70, loanPeriodMonths: 360, commission: 2.00, notes: 'mKredyt Hipoteczny. Brak marży pomostowej.' }),
  tpl({ id: 'mbank-2020', label: 'mBank ~2020-2021', bank: 'mBank', period: '2020-2021',
    loanAmount: 400000, margin: 2.10, loanPeriodMonths: 300, wiborType: '6M', notes: 'WIBOR 6M zamiast 3M. Bez prowizji.' }),
  tpl({ id: 'ing-2016', label: 'ING Bank Śląski ~2016', bank: 'ING Bank Śląski', period: '2014-2018',
    loanAmount: 250000, margin: 1.85, bridgeMargin: 1.00, loanPeriodMonths: 360, commission: 1.90,
    notes: 'Kredyt mieszkaniowy z marżą pomostową.' }),
  tpl({ id: 'millennium-2017', label: 'Bank Millennium ~2017', bank: 'Bank Millennium', period: '2015-2019',
    loanAmount: 280000, margin: 1.95, bridgeMargin: 1.20, loanPeriodMonths: 360, commission: 2.00,
    notes: 'Kredyt hipoteczny. Marża pomostowa do wpisu hipoteki.' }),
  tpl({ id: 'pekao-2016', label: 'Pekao SA ~2016', bank: 'Bank Pekao SA', period: '2014-2018',
    loanAmount: 300000, margin: 1.75, bridgeMargin: 0.80, loanPeriodMonths: 360, commission: 1.50,
    notes: 'Kredyt hipoteczny. Odsetki actual/360.' }),
  tpl({ id: 'bnp-2018', label: 'BNP Paribas ~2018', bank: 'BNP Paribas (d. BGŻ BNP)', period: '2017-2020',
    loanAmount: 350000, margin: 2.19, loanPeriodMonths: 300, notes: 'Bez prowizji, bez marży pomostowej.' }),
  tpl({ id: 'alior-2019', label: 'Alior Bank ~2019', bank: 'Alior Bank', period: '2018-2021',
    loanAmount: 250000, margin: 2.30, loanPeriodMonths: 300, notes: 'Megahipoteka. Wyższa marża, bez dodatkowych kosztów.' }),
  tpl({ id: 'ca-2017', label: 'Credit Agricole ~2017', bank: 'Credit Agricole', period: '2015-2019',
    loanAmount: 200000, margin: 2.05, bridgeMargin: 1.00, loanPeriodMonths: 360, commission: 1.80,
    notes: 'Kredyt mieszkaniowy z marżą pomostową.' }),
  tpl({ id: 'citi-2016', label: 'Citi Handlowy ~2016', bank: 'Citi Handlowy', period: '2014-2018',
    loanAmount: 400000, margin: 1.60, bridgeMargin: 0.50, loanPeriodMonths: 360, wiborType: '6M', commission: 1.00,
    notes: 'WIBOR 6M. Niska marża, niska pomostowa.' }),
];
