// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  const baseStyles = `inline-flex items-center px-8 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm transition-colors duration-200 ${className}`;

  const primaryStyles =
    'text-white bg-primary-500 hover:bg-primary-600 hover:text-white'; // Added hover:text-white
  const secondaryStyles =
    'text-primary-500 bg-white border-primary-500 hover:bg-primary-50'; // Example

  const variantStyles = variant === 'primary' ? primaryStyles : secondaryStyles;

  return (
    <button className={`${baseStyles} ${variantStyles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
