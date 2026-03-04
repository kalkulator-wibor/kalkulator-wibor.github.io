import WiborDataManager from './WiborDataManager';
import type { WiborEntry } from '../utils/calculations';

interface Props {
  wiborData: WiborEntry[];
  wiborSource: 'default' | 'custom';
  onDataUpdate: (data: WiborEntry[]) => void;
  onBack: () => void;
}

export default function WiborDataPage({ wiborData, wiborSource, onDataUpdate, onBack }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dane WIBOR 3M</h2>
          <p className="text-sm text-gray-500 mt-1">
            Pobierz aktualne stawki z API, importuj plik CSV/JSON lub użyj danych domyślnych.
            {wiborSource === 'custom' ? ' Aktualnie: dane zaimportowane.' : ' Aktualnie: dane wbudowane (przybliżone).'}
          </p>
        </div>
        <button onClick={onBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium cursor-pointer">
          Wróć do kalkulatora
        </button>
      </div>
      <WiborDataManager wiborData={wiborData} onDataUpdate={onDataUpdate} />
    </div>
  );
}
