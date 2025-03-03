// src/components/ui/Select.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | undefined; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  className,
  options,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={props.id}
          className={`form-input appearance-none pr-8 ${className} ${error ? 'border-red-500' : ''
            } w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E00201]
                         focus:border-transparent flex items-center justify-between`}
          {...props}
        >
          {options.map((option) => (
            <option key={`${option.value || ''}-${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
