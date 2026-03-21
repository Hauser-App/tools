import { useRef, useCallback } from 'react';
import { parseCurrency } from './utils';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  placeholder?: string;
  helpText?: string;
  id: string;
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  min,
  placeholder,
  helpText,
  id,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = value > 0 ? value.toLocaleString('en-US') : '';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseCurrency(raw);
      onChange(num);
    },
    [onChange]
  );

  const error =
    min !== undefined && value > 0 && value < min
      ? `Minimum value is $${min.toLocaleString()}`
      : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-hauser-navy mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hauser-gray">
          $
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder ?? '0'}
          className={`w-full pl-7 pr-3 py-2.5 border rounded-lg text-right text-hauser-navy
            focus:outline-none focus:ring-2 focus:ring-hauser-blue/30 focus:border-hauser-blue
            ${error ? 'border-hauser-red' : 'border-gray-300'}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-hauser-red">{error}</p>}
      {helpText && !error && (
        <p className="mt-1 text-xs text-hauser-gray">{helpText}</p>
      )}
    </div>
  );
}
