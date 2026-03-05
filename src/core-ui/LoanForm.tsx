import { useState, useRef, useEffect } from 'react';
import type { LoanInput } from '../utils/calculations';
import { toDateString } from '../utils/formatters';
import { useCases, useInput, useActiveBankInfo } from '../core/CaseContext';

export default function LoanForm() {
  const { updateInput, setActiveTab, openSheetModule, activeTemplateId } = useCases();
  const bankInfo = useActiveBankInfo();
  const savedInput = useInput();
  const [loanAmount, setLoanAmount] = useState(savedInput ? String(savedInput.loanAmount) : '200000');
  const [margin, setMargin] = useState(savedInput ? savedInput.margin.toFixed(2) : '2.09');
  const [loanPeriod, setLoanPeriod] = useState(savedInput ? String(savedInput.loanPeriodMonths) : '300');
  const [startDate, setStartDate] = useState(savedInput ? toDateString(savedInput.startDate) : '');
  const [bridgeMargin, setBridgeMargin] = useState(savedInput ? savedInput.bridgeMargin.toFixed(2) : '0');
  const [bridgeEndDate, setBridgeEndDate] = useState(savedInput?.bridgeEndDate ? toDateString(savedInput.bridgeEndDate) : '');
  const [showBridge, setShowBridge] = useState(savedInput ? savedInput.bridgeMargin > 0 : false);
  const [paymentDay, setPaymentDay] = useState(savedInput ? String(savedInput.paymentDay) : '30');

  // Track previous templateId to detect external changes (sheet selection)
  const prevTemplateId = useRef(activeTemplateId);

  useEffect(() => {
    if (activeTemplateId === prevTemplateId.current) return;
    prevTemplateId.current = activeTemplateId;
    if (!bankInfo) return;
    const tpl = bankInfo.template;
    setLoanAmount(tpl.loanAmount.toString());
    setMargin(tpl.margin.toFixed(2));
    setLoanPeriod(tpl.loanPeriodMonths.toString());
    setPaymentDay('30');
    if (tpl.bridgeMargin > 0) {
      setShowBridge(true);
      setBridgeMargin(tpl.bridgeMargin.toFixed(2));
      setBridgeEndDate('');
    } else {
      setShowBridge(false);
      setBridgeMargin('0');
    }
    setStartDate('');
  }, [activeTemplateId, bankInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: LoanInput = {
      loanAmount: parseFloat(loanAmount.replace(/\s/g, '').replace(',', '.')),
      margin: parseFloat(margin.replace(',', '.')),
      loanPeriodMonths: parseInt(loanPeriod),
      startDate: new Date(startDate),
      bridgeMargin: showBridge ? parseFloat(bridgeMargin.replace(',', '.')) : 0,
      bridgeEndDate: showBridge && bridgeEndDate ? new Date(bridgeEndDate) : null,
      paymentDay: parseInt(paymentDay) || 30,
    };
    updateInput(input);
    setActiveTab('summary');
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
      <div className="card-body gap-4">
        <p className="label-caps pb-1">Dane z umowy kredytu</p>

        <button type="button" onClick={() => openSheetModule('templates')}
          className="btn btn-outline w-full justify-between">
          {bankInfo ? bankInfo.template.label : 'Wybierz szablon umowy'}
          <span className="text-xs opacity-50">lub wpisz ręcznie</span>
        </button>

        {bankInfo && (
          <div className="alert alert-info text-sm">
            <div>
              <p className="font-medium">{bankInfo.bank.name}</p>
              <p className="text-xs mt-1">
                {bankInfo.template.wiborType} + {bankInfo.template.margin}%
                {bankInfo.template.bridgeMargin > 0 && ` + pomostowa ${bankInfo.template.bridgeMargin}%`}
                {bankInfo.template.commission > 0 && ` | prowizja ${bankInfo.template.commission}%`}
                {' | '}{bankInfo.template.rateType === 'equal' ? 'raty równe' : 'raty malejące'}
                {' | '}{bankInfo.template.interestMethod}
              </p>
              <p className="text-xs mt-1 opacity-70">{bankInfo.template.notes}</p>
              <p className="text-xs mt-1 italic opacity-60">Uzupełnij kwotę, datę uruchomienia i okres z konkretnej umowy.</p>
            </div>
          </div>
        )}

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Kwota kredytu (PLN)</legend>
          <input type="text" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="input input-bordered w-full" placeholder="np. 121462.50" required />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Marża banku (%)</legend>
          <input type="text" value={margin} onChange={e => setMargin(e.target.value)} className="input input-bordered w-full" placeholder="np. 2.09" required />
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Okres (miesiące)</legend>
            <input type="number" value={loanPeriod} onChange={e => setLoanPeriod(e.target.value)} className="input input-bordered w-full" placeholder="np. 243" min="1" max="480" required />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Dzień raty</legend>
            <input type="number" value={paymentDay} onChange={e => setPaymentDay(e.target.value)} className="input input-bordered w-full" placeholder="30" min="1" max="31" required />
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Data uruchomienia kredytu</legend>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input input-bordered w-full" required />
        </fieldset>

        <div className="divider my-0"></div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showBridge} onChange={e => setShowBridge(e.target.checked)} className="checkbox checkbox-sm" />
          <span className="label-text">Marża pomostowa (do czasu wpisu hipoteki)</span>
        </label>
        {showBridge && (
          <div className="ml-6 space-y-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Marża pomostowa (%)</legend>
              <input type="text" value={bridgeMargin} onChange={e => setBridgeMargin(e.target.value)} className="input input-bordered w-full" placeholder="np. 1.00" />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Data zniesienia marży pomostowej</legend>
              <input type="date" value={bridgeEndDate} onChange={e => setBridgeEndDate(e.target.value)} className="input input-bordered w-full" />
            </fieldset>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full text-lg">Oblicz</button>

      </div>
    </form>
  );
}
