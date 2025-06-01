// src/components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  className = '',
  label,
  error
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            text-gray-900 bg-white resize-vertical
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
        />
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;
