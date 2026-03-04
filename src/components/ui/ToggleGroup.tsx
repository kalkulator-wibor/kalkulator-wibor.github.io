interface ToggleItem<T extends string> {
  id: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  items: ToggleItem<T>[];
  active: T;
  onSelect: (id: T) => void;
  variant?: 'tabs' | 'pills';
}

export function ToggleGroup<T extends string>({ items, active, onSelect, variant = 'pills' }: ToggleGroupProps<T>) {
  return (
    <div className={variant === 'tabs' ? 'flex gap-1' : 'flex gap-2'}>
      {items.map(item => (
        <button key={item.id} onClick={() => onSelect(item.id)}
          className={`${variant === 'tabs' ? 'flex-1 py-2.5 px-3' : 'px-3 py-1'} rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            active === item.id
              ? 'bg-blue-600 text-white'
              : variant === 'tabs'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
