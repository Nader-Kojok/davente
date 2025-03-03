import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  variant?: 'primary' | 'secondary'; // Add a variant
}

export default function PrimaryButton({
  href,
  children,
  icon: Icon,
  className = '',
  variant = 'primary', // Default to primary
}: PrimaryButtonProps) {
  const baseStyles = `inline-flex items-center px-8 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm transition-colors duration-200 ${className}`;

  const primaryStyles = "text-white bg-primary-500 hover:bg-primary-600 hover:text-white"; // Added hover:text-white
  const secondaryStyles =
    "text-primary-500 bg-white border-primary-500 hover:bg-primary-50"; // Example

  const variantStyles = variant === "primary" ? primaryStyles : secondaryStyles;

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles}`}>
      {Icon && <Icon className="-ml-1 mr-2 h-5 w-5" />}
      {children}
    </Link>
  );
}
