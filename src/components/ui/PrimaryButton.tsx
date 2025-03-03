import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export default function PrimaryButton({
  href,
  children,
  icon: Icon,
  className = '',
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-8 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-[#E00201] hover:bg-[#CB0201] transition-colors duration-200 shadow-sm ${className}`}
    >
      {Icon && <Icon className="-ml-1 mr-2 h-5 w-5" />}
      {children}
    </Link>
  );
}