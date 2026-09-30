import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'green' | 'yellow' | 'default' | 'outline' | string;
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export function Badge({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    outline: 'border border-gray-300 text-gray-700',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    default: 'text-sm px-3 py-1 font-semibold',
    lg: 'text-base px-3.5 py-1.5 font-semibold',
  };

  const variantClass = variantStyles[variant] || variantStyles.default;
  const sizeClass = sizeStyles[size] || sizeStyles.default;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantClass} ${sizeClass} transition-colors ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
