import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';
    
    const variants = {
      success: 'bg-green-100 text-green-800 border border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
      info: 'bg-blue-100 text-blue-800 border border-blue-200',
      primary: 'bg-primary-100 text-primary-800 border border-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

