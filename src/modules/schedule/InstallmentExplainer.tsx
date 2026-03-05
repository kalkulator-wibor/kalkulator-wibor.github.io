import { useMemo } from 'react';
import type { InstallmentRow, LoanInput } from '../../utils/calculations';
import { generateExplanation } from '../../utils/explanations';
import { StepCard } from '../../components/ui/ExplanationCards';

interface Props { row: InstallmentRow; schedule: InstallmentRow[]; input: LoanInput; }

export default function InstallmentExplainer({ row, schedule, input }: Props) {
  const explanation = useMemo(() => generateExplanation(row, schedule, input), [row, schedule, input]);

  return (
    <div className="space-y-4">
      <div className="alert alert-info text-xs">
        <div>
          <p className="font-medium mb-1">Jak czytać te obliczenia?</p>
          <p>Poniżej przedstawiamy krok po kroku jak wyliczono daną wartość — wzór, dane wejściowe i wynik.</p>
        </div>
      </div>
      <div className="text-sm opacity-60">
        Rata nr <span className="font-bold opacity-100">{explanation.installmentNumber}</span>
        {' '}z dnia <span className="font-bold opacity-100">{explanation.date}</span>
      </div>
      {explanation.steps.map((step, i) => <StepCard key={step.id} step={step} index={i} />)}
    </div>
  );
}
