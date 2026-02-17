import { useState } from 'react';
import type { LoanInput } from '../utils/calculations';
import { LOAN_TEMPLATES } from '../data/loanTemplates';
import type { LoanTemplate } from '../data/loanTemplates';

interface Props {
  onCalculate: (input: LoanInput) => void;
}

export default function LoanForm({ onCalculate }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loanAmount, setLoanAmount] = useState('121462.50');
  const [margin, setMargin] = useState('2.09');
  const [loanPeriod, setLoanPeriod] = useState('243');
  const [startDate, setStartDate] = useState('2015-09-03');
  const [bridgeMargin, setBridgeMargin] = useState('1.00');
  const [bridgeEndDate, setBridgeEndDate] = useState('2015-10-15');
  const [showBridge, setShowBridge] = useState(true);
  const [paymentDay, setPaymentDay] = useState('30');
  const [templateInfo, setTemplateInfo] = useState<LoanTemplate | null>(null);

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tpl = LOAN_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) {
      setTemplateInfo(null);
      return;
    }

    setTemplateInfo(tpl);
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

    // Data uruchomienia - środek podanego okresu
    setStartDate('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCalculate({
      loanAmount: parseFloat(loanAmount.replace(/\s/g, '').replace(',', '.')),
      margin: parseFloat(margin.replace(',', '.')),
      loanPeriodMonths: parseInt(loanPeriod),
      startDate: new Date(startDate),
      bridgeMargin: showBridge ? parseFloat(bridgeMargin.replace(',', '.')) : 0,
      bridgeEndDate: showBridge && bridgeEndDate ? new Date(bridgeEndDate) : null,
      paymentDay: parseInt(paymentDay) || 30,
    });
  };

  // Grupuj szablony po banku
  const bankGroups = LOAN_TEMPLATES.reduce<Record<string, LoanTemplate[]>>((acc, tpl) => {
    if (!acc[tpl.bank]) acc[tpl.bank] = [];
    acc[tpl.bank].push(tpl);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-5">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
        Dane z umowy kredytu
      </h2>

      {/* Selektor szablonu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Szablon umowy
        </label>
        <select
          value={selectedTemplate}
          onChange={e => applyTemplate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="">-- wpisz ręcznie --</option>
          {Object.entries(bankGroups).map(([bank, templates]) => (
            <optgroup key={bank} label={bank}>
              {templates.map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.label} | marża {tpl.margin}% | {tpl.wiborType}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Info o wybranym szablonie */}
      {templateInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
          <p className="font-medium text-blue-800">{templateInfo.bank}</p>
          <p className="text-blue-600 text-xs mt-1">
            {templateInfo.wiborType} + {templateInfo.margin}%
            {templateInfo.bridgeMargin > 0 && ` + pomostowa ${templateInfo.bridgeMargin}%`}
            {templateInfo.commission > 0 && ` | prowizja ${templateInfo.commission}%`}
            {' | '}{templateInfo.rateType === 'equal' ? 'raty równe' : 'raty malejące'}
            {' | '}{templateInfo.interestMethod}
          </p>
          <p className="text-blue-500 text-xs mt-1">{templateInfo.notes}</p>
          <p className="text-blue-400 text-xs mt-1 italic">
            Uzupełnij kwotę, datę uruchomienia i okres z konkretnej umowy.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kwota kredytu (PLN)
        </label>
        <input
          type="text"
          value={loanAmount}
          onChange={e => setLoanAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="np. 121462.50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marża banku (%)
        </label>
        <input
          type="text"
          value={margin}
          onChange={e => setMargin(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="np. 2.09"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Okres (miesiące)
          </label>
          <input
            type="number"
            value={loanPeriod}
            onChange={e => setLoanPeriod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="np. 243"
            min="1"
            max="480"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dzień raty
          </label>
          <input
            type="number"
            value={paymentDay}
            onChange={e => setPaymentDay(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="30"
            min="1"
            max="31"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data uruchomienia kredytu
        </label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          required
        />
      </div>

      <div className="border-t pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBridge}
            onChange={e => setShowBridge(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Marża pomostowa (do czasu wpisu hipoteki)
          </span>
        </label>

        {showBridge && (
          <div className="mt-3 space-y-3 pl-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Marża pomostowa (%)
              </label>
              <input
                type="text"
                value={bridgeMargin}
                onChange={e => setBridgeMargin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="np. 1.00"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Data zniesienia marży pomostowej
              </label>
              <input
                type="date"
                value={bridgeEndDate}
                onChange={e => setBridgeEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg cursor-pointer"
      >
        Oblicz
      </button>

      <p className="text-xs text-gray-500 text-center">
        WIBOR 3M jest pobierany automatycznie z tabeli historycznych stawek.
        Obliczenia mają charakter szacunkowy/poglądowy.
      </p>
    </form>
  );
}
