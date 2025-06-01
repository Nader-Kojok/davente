import { Building2, User } from 'lucide-react';

interface AccountTypeBadgeProps {
  accountType: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function AccountTypeBadge({ 
  accountType, 
  size = 'md', 
  showIcon = true 
}: AccountTypeBadgeProps) {
  const isBusinessAccount = accountType === 'business';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses[size]}
        ${isBusinessAccount 
          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
          : 'bg-green-100 text-green-800 border border-green-200'
        }
      `}
    >
      {showIcon && (
        <>
          {isBusinessAccount ? (
            <Building2 className={`${iconSizes[size]} mr-1.5`} />
          ) : (
            <User className={`${iconSizes[size]} mr-1.5`} />
          )}
        </>
      )}
      {isBusinessAccount ? 'Professionnel' : 'Particulier'}
    </span>
  );
} 