// src/components/ui/BaseLink.tsx
import Link, { LinkProps } from 'next/link';
import React from 'react';

interface BaseLinkProps extends LinkProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

const BaseLink: React.FC<BaseLinkProps> = ({
  href,
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'text-primary-500 hover:text-primary-700 hover:font-medium';
      break;
    case 'secondary':
      variantStyles = 'text-gray-500 hover:text-gray-700';
      break;
    default:
      variantStyles = 'text-primary-500 hover:text-primary-600';
      break;
  }

  return (
    <Link href={href} className={`${variantStyles} ${className}`} {...props}>
      {children}
    </Link>
  );
};

export default BaseLink;
