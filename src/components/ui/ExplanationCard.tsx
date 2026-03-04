import type { ExplanationStep, NamedValue } from '../../utils/explanationTypes';

export function ValuePill({ nv }: { nv: NamedValue }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
      <span className="font-mono text-blue-600 font-medium">{nv.symbol}</span>
      <span className="text-gray-400">=</span>
      <span className="font-medium text-gray-800">{nv.formatted}</span>
      {nv.source && (
        <span className="text-xs text-gray-400 ml-1">({nv.source})</span>
      )}
    </div>
  );
}

export function StepCard({ step, index }: { step: ExplanationStep; index: number }) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <h4 className="font-bold text-gray-800">{step.title}</h4>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5">
          <p className="text-xs font-medium text-blue-500 mb-1">Wzór</p>
          <p className="font-mono text-sm text-blue-800">{step.formula}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Dane wejściowe</p>
          <div className="flex flex-wrap gap-2">
            {step.inputs.map(nv => <ValuePill key={nv.symbol} nv={nv} />)}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-green-600">Wynik</p>
            <p className="font-mono text-sm text-green-800">
              {step.result.symbol} = {step.result.formatted}
            </p>
          </div>
          {step.result.source && (
            <span className="text-xs text-green-500">{step.result.source}</span>
          )}
        </div>

        {step.notes && (
          <p className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-3">
            {step.notes}
          </p>
        )}
      </div>
    </div>
  );
}
