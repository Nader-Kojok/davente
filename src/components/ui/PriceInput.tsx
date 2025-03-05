import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

export interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  step?: number;
  min?: number;
  currency?: string;
  required?: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  label = 'Prix',
  error,
  step = 500,
  min = 500,
  currency = 'FCFA',
  required = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(formatPrice(value));

  useEffect(() => {
    setInputValue(formatPrice(value));
  }, [value]);

  const roundToNearest = (price: number): number => {
    const remainder = price % 50;
    if (remainder < 25) {
      return price - remainder;
    } else {
      return price + (50 - remainder);
    }
  };

  const increment = () => {
    const newValue = roundToNearest(value + step);
    onChange(newValue);
    setInputValue(formatPrice(newValue));
  };

  const decrement = () => {
    const newValue = roundToNearest(Math.max(min, value - step));
    onChange(newValue);
    setInputValue(formatPrice(newValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    // Parse the number without spaces
    const numValue = parseInt(newInputValue.replace(/\s/g, ''), 10);

    // Only update the parent state if it's a valid number
    if (!isNaN(numValue)) {
      // Do not round here, wait for onBlur
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue.replace(/\s/g, ''), 10);
    let roundedValue = roundToNearest(numValue);

    if (isNaN(numValue) || numValue < min) {
      roundedValue = roundToNearest(min);
    }

    onChange(roundedValue);
    setInputValue(formatPrice(roundedValue));
  };

  function formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  const inputHeight = '44px'; // Set the desired height

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex rounded-md shadow-sm">
        {/* Minus button */}
        <button
          type="button"
          onClick={decrement}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:ring-opacity-50"
          style={{ height: inputHeight }} // Set height
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Input field - center aligned */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full h-full py-2 px-3 text-center border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:border-[#E00201]"
            required={required}
            style={{ height: inputHeight }} // Set height
          />
        </div>

        {/* Plus button */}
        <button
          type="button"
          onClick={increment}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E00201] focus:ring-opacity-50"
          style={{ height: inputHeight }} // Set height
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Currency indicator - separate from buttons */}
        <div
          className="flex items-center justify-center px-4 rounded-r-md border border-gray-300 text-gray-500 sm:text-sm bg-white"
          style={{ height: inputHeight }} // Set height
        >
          {currency}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PriceInput;
