export interface LoanTemplate {
  id: string;
  label: string;
  bank: string;
  period: string;           // np. "2015-2020"
  loanAmount: number;
  margin: number;            // marża (%)
  bridgeMargin: number;      // marża pomostowa (%)
  loanPeriodMonths: number;
  wiborType: '3M' | '6M';
  rateType: 'equal' | 'decreasing';  // raty równe / malejące
  interestMethod: '365/360' | '30/360';
  commission: number;        // prowizja (%)
  notes: string;
}

export const LOAN_TEMPLATES: LoanTemplate[] = [
  // --- SANTANDER (BZ WBK) ---
  {
    id: 'santander-2015',
    label: 'Santander (BZ WBK) ~2015',
    bank: 'Santander Bank Polska (d. BZ WBK)',
    period: '2013-2017',
    loanAmount: 200000,
    margin: 2.09,
    bridgeMargin: 1.00,
    loanPeriodMonths: 300,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 2.50,
    notes: 'Art. 3.05 - WIBOR 3M + marża. Pomostowa do wpisu hipoteki.',
  },
  {
    id: 'santander-2018',
    label: 'Santander ~2018-2020',
    bank: 'Santander Bank Polska',
    period: '2018-2020',
    loanAmount: 300000,
    margin: 1.89,
    bridgeMargin: 0.00,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 0.00,
    notes: 'Oferta bez prowizji, bez marży pomostowej.',
  },

  // --- PKO BP ---
  {
    id: 'pko-2014',
    label: 'PKO BP ~2014',
    bank: 'PKO Bank Polski',
    period: '2012-2015',
    loanAmount: 250000,
    margin: 1.65,
    bridgeMargin: 1.50,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 1.50,
    notes: 'Kredyt Własny Kąt. Wysoka marża pomostowa do wpisu hipoteki.',
  },
  {
    id: 'pko-2019',
    label: 'PKO BP ~2019-2021',
    bank: 'PKO Bank Polski',
    period: '2019-2021',
    loanAmount: 350000,
    margin: 1.99,
    bridgeMargin: 0.00,
    loanPeriodMonths: 300,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 0.00,
    notes: 'Kredyt mieszkaniowy Własny Kąt Hipoteczny.',
  },

  // --- mBANK ---
  {
    id: 'mbank-2015',
    label: 'mBank ~2015',
    bank: 'mBank (d. BRE Bank)',
    period: '2013-2016',
    loanAmount: 300000,
    margin: 1.70,
    bridgeMargin: 0.00,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 2.00,
    notes: 'mKredyt Hipoteczny. Brak marży pomostowej.',
  },
  {
    id: 'mbank-2020',
    label: 'mBank ~2020-2021',
    bank: 'mBank',
    period: '2020-2021',
    loanAmount: 400000,
    margin: 2.10,
    bridgeMargin: 0.00,
    loanPeriodMonths: 300,
    wiborType: '6M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 0.00,
    notes: 'WIBOR 6M zamiast 3M. Bez prowizji.',
  },

  // --- ING ---
  {
    id: 'ing-2016',
    label: 'ING Bank Śląski ~2016',
    bank: 'ING Bank Śląski',
    period: '2014-2018',
    loanAmount: 250000,
    margin: 1.85,
    bridgeMargin: 1.00,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 1.90,
    notes: 'Kredyt mieszkaniowy z marżą pomostową.',
  },

  // --- MILLENNIUM ---
  {
    id: 'millennium-2017',
    label: 'Bank Millennium ~2017',
    bank: 'Bank Millennium',
    period: '2015-2019',
    loanAmount: 280000,
    margin: 1.95,
    bridgeMargin: 1.20,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 2.00,
    notes: 'Kredyt hipoteczny. Marża pomostowa do wpisu hipoteki.',
  },

  // --- PEKAO ---
  {
    id: 'pekao-2016',
    label: 'Pekao SA ~2016',
    bank: 'Bank Pekao SA',
    period: '2014-2018',
    loanAmount: 300000,
    margin: 1.75,
    bridgeMargin: 0.80,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 1.50,
    notes: 'Kredyt hipoteczny. Odsetki actual/360.',
  },

  // --- BNP PARIBAS (d. BGŻ BNP) ---
  {
    id: 'bnp-2018',
    label: 'BNP Paribas ~2018',
    bank: 'BNP Paribas (d. BGŻ BNP)',
    period: '2017-2020',
    loanAmount: 350000,
    margin: 2.19,
    bridgeMargin: 0.00,
    loanPeriodMonths: 300,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 0.00,
    notes: 'Bez prowizji, bez marży pomostowej.',
  },

  // --- ALIOR ---
  {
    id: 'alior-2019',
    label: 'Alior Bank ~2019',
    bank: 'Alior Bank',
    period: '2018-2021',
    loanAmount: 250000,
    margin: 2.30,
    bridgeMargin: 0.00,
    loanPeriodMonths: 300,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 0.00,
    notes: 'Megahipoteka. Wyższa marża, bez dodatkowych kosztów.',
  },

  // --- CREDIT AGRICOLE ---
  {
    id: 'ca-2017',
    label: 'Credit Agricole ~2017',
    bank: 'Credit Agricole',
    period: '2015-2019',
    loanAmount: 200000,
    margin: 2.05,
    bridgeMargin: 1.00,
    loanPeriodMonths: 360,
    wiborType: '3M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 1.80,
    notes: 'Kredyt mieszkaniowy z marżą pomostową.',
  },

  // --- CITI HANDLOWY ---
  {
    id: 'citi-2016',
    label: 'Citi Handlowy ~2016',
    bank: 'Citi Handlowy',
    period: '2014-2018',
    loanAmount: 400000,
    margin: 1.60,
    bridgeMargin: 0.50,
    loanPeriodMonths: 360,
    wiborType: '6M',
    rateType: 'equal',
    interestMethod: '365/360',
    commission: 1.00,
    notes: 'WIBOR 6M. Niska marża, niska pomostowa.',
  },
];
