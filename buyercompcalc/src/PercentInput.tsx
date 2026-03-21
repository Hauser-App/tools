import { useCallback } from 'react';

interface PercentInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  id: string;
  helpText?: string;
}

export default function PercentInput({
  label,
  value,
  onChange,
  max = 5,
  step = 0.1,
  id,
  helpText,
}: PercentInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseFloat(e.target.value);
      if (!isNaN(num) && num >= 0 && num <= max) {
        onChange(num);
      } else if (e.target.value === '') {
        onChange(0);
      }
    },
    [onChange, max]
  );

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-hauser-navy mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full pr-8 pl-3 py-2.5 border border-gray-300 rounded-lg text-right text-hauser-navy
            focus:outline-none focus:ring-2 focus:ring-hauser-blue/30 focus:border-hauser-blue
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-hauser-gray">
          %
        </span>
      </div>
      {helpText && (
        <p className="mt-1 text-xs text-hauser-gray">{helpText}</p>
      )}
    </div>
  );
}
