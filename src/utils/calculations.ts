import { getWiborRate as getDefaultWiborRate } from '../data/wiborRates';
import { daysBetween } from './formatters';

export interface WiborEntry { date: string; rate: number; }

export interface LoanInput {
  loanAmount: number;
  margin: number;
  loanPeriodMonths: number;
  startDate: Date;
  bridgeMargin: number;
  bridgeEndDate: Date | null;
  paymentDay: number;
  wiborData?: WiborEntry[];
}

function resolveWiborRate(date: Date, wiborData?: WiborEntry[]): number {
  if (!wiborData || wiborData.length === 0) return getDefaultWiborRate(date);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  let bestRate = wiborData[0].rate;
  for (const entry of wiborData) {
    if (entry.date <= dateStr) bestRate = entry.rate;
    else break;
  }
  return bestRate;
}

export interface InstallmentRow {
  number: number;
  date: Date;
  prevDate: Date;
  days: number;
  wiborRate: number;
  totalRate: number;
  installment: number;
  principal: number;
  interestTotal: number;
  interestWibor: number;
  interestMargin: number;
  interestBridge: number;
  remainingBalance: number;
  isPast: boolean;
}

export interface InstallmentRowNoWibor {
  number: number;
  date: Date;
  installment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface CalculationResult {
  schedule: InstallmentRow[];
  scheduleNoWibor: InstallmentRowNoWibor[];
  pastTotalPaid: number;
  pastPrincipalPaid: number;
  pastInterestTotal: number;
  pastInterestWibor: number;
  pastInterestMargin: number;
  pastInterestBridge: number;
  pastInstallmentsCount: number;
  futureTotalToPay: number;
  futurePrincipalToPay: number;
  futureInterestTotal: number;
  futureInterestWibor: number;
  futureInterestMargin: number;
  futureInstallmentsCount: number;
  pastTotalPaidNoWibor: number;
  pastInterestNoWibor: number;
  pastPrincipalNoWibor: number;
  futureTotalNoWibor: number;
  futureInterestNoWibor: number;
  overpaidInterest: number;
  futureSavings: number;
  currentInstallment: number;
  installmentNoWibor: number;
}

function getPaymentDate(startDate: Date, monthOffset: number, paymentDay: number): Date {
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + monthOffset;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = month % 12;
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  return new Date(targetYear, targetMonth, Math.min(paymentDay, daysInMonth));
}

function annuity(balance: number, annualRate: number, months: number): number {
  if (annualRate <= 0 || months <= 0) return months > 0 ? balance / months : balance;
  const r = annualRate / 100 / 12;
  const f = Math.pow(1 + r, months);
  return balance * (r * f) / (f - 1);
}

function interest(balance: number, ratePct: number, days: number): number {
  return balance * (ratePct / 100) * days / 360;
}

export function calculateLoan(input: LoanInput): CalculationResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const schedule: InstallmentRow[] = [];
  const scheduleNoWibor: InstallmentRowNoWibor[] = [];
  let balance = input.loanAmount;
  let balanceNoWibor = input.loanAmount;
  let prevDate = new Date(input.startDate);
  let currentWibor = resolveWiborRate(input.startDate, input.wiborData);
  let installmentAmount = 0;
  let installmentNoWiborAmount = 0;
  let monthsSinceReset = 0;

  for (let i = 1; i <= input.loanPeriodMonths; i++) {
    const paymentDate = getPaymentDate(input.startDate, i, input.paymentDay);
    const days = daysBetween(prevDate, paymentDate);
    const remainingMonths = input.loanPeriodMonths - i + 1;
    const bridgeActive = input.bridgeEndDate ? paymentDate <= input.bridgeEndDate : false;
    const effectiveBridgeMargin = bridgeActive ? input.bridgeMargin : 0;

    monthsSinceReset++;
    if (monthsSinceReset >= 3 || i === 1) {
      if (i > 1) currentWibor = resolveWiborRate(paymentDate, input.wiborData);
      monthsSinceReset = 0;
      installmentAmount = annuity(balance, currentWibor + input.margin + effectiveBridgeMargin, remainingMonths);
      installmentNoWiborAmount = annuity(balanceNoWibor, input.margin + effectiveBridgeMargin, remainingMonths);
    }

    const iW = interest(balance, currentWibor, days);
    const iM = interest(balance, input.margin, days);
    const iB = interest(balance, effectiveBridgeMargin, days);
    const iTotal = iW + iM + iB;

    let principal = Math.max(installmentAmount - iTotal, 0);
    if (i === input.loanPeriodMonths || principal > balance) principal = balance;

    const isPast = paymentDate <= today;
    schedule.push({
      number: i, date: paymentDate, prevDate: new Date(prevDate), days,
      wiborRate: currentWibor, totalRate: currentWibor + input.margin + effectiveBridgeMargin,
      installment: principal + iTotal, principal, interestTotal: iTotal,
      interestWibor: iW, interestMargin: iM, interestBridge: iB,
      remainingBalance: balance - principal, isPast,
    });
    balance = Math.max(balance - principal, 0);

    const iNW = interest(balanceNoWibor, input.margin + effectiveBridgeMargin, days);
    let pNW = Math.max(installmentNoWiborAmount - iNW, 0);
    if (i === input.loanPeriodMonths || pNW > balanceNoWibor) pNW = balanceNoWibor;
    scheduleNoWibor.push({ number: i, date: paymentDate, installment: pNW + iNW, principal: pNW, interest: iNW, remainingBalance: balanceNoWibor - pNW });
    balanceNoWibor = Math.max(balanceNoWibor - pNW, 0);

    prevDate = paymentDate;
  }

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const pastRows = schedule.filter(r => r.isPast);
  const futureRows = schedule.filter(r => !r.isPast);
  const pastNW = scheduleNoWibor.filter((_, i) => schedule[i].isPast);
  const futureNW = scheduleNoWibor.filter((_, i) => !schedule[i].isPast);

  const pastInterestTotal = sum(pastRows.map(r => r.interestTotal));
  const pastTotalPaid = sum(pastRows.map(r => r.installment));
  const futureTotalToPay = sum(futureRows.map(r => r.installment));
  const pastInterestNW = sum(pastNW.map(r => r.interest));
  const futureTotalNW = sum(futureNW.map(r => r.installment));

  return {
    schedule, scheduleNoWibor,
    pastTotalPaid,
    pastPrincipalPaid: sum(pastRows.map(r => r.principal)),
    pastInterestTotal,
    pastInterestWibor: sum(pastRows.map(r => r.interestWibor)),
    pastInterestMargin: sum(pastRows.map(r => r.interestMargin)),
    pastInterestBridge: sum(pastRows.map(r => r.interestBridge)),
    pastInstallmentsCount: pastRows.length,
    futureTotalToPay,
    futurePrincipalToPay: sum(futureRows.map(r => r.principal)),
    futureInterestTotal: sum(futureRows.map(r => r.interestTotal)),
    futureInterestWibor: sum(futureRows.map(r => r.interestWibor)),
    futureInterestMargin: sum(futureRows.map(r => r.interestMargin)),
    futureInstallmentsCount: futureRows.length,
    pastTotalPaidNoWibor: sum(pastNW.map(r => r.installment)),
    pastInterestNoWibor: pastInterestNW,
    pastPrincipalNoWibor: sum(pastNW.map(r => r.principal)),
    futureTotalNoWibor: futureTotalNW,
    futureInterestNoWibor: sum(futureNW.map(r => r.interest)),
    overpaidInterest: pastInterestTotal - pastInterestNW,
    futureSavings: futureTotalToPay - futureTotalNW,
    currentInstallment: futureRows.length > 0 ? futureRows[0].installment : 0,
    installmentNoWibor: futureNW.length > 0 ? futureNW[0].installment : 0,
  };
}
