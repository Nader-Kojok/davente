// src/components/ui/Checkbox.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors
            ${checked 
              ? 'bg-[#E00201] border-[#E00201] text-white' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => !disabled && onChange?.({ target: { checked: !checked } } as any)}
        >
          {checked && <Check className="w-3 h-3" />}
        </div>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={id}
              className={`text-sm font-medium text-gray-900 cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
